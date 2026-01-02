use std::io::{Read, Write};
use std::sync::{mpsc, Arc, Mutex};
use steamworks::{AppId, Client, TicketForWebApiResponse};
use tauri::State;

const STEAM_APP_ID: u32 = 3552310;

pub struct SteamState(pub Arc<Mutex<Option<Client>>>);

pub fn steam_state() -> SteamState {
    SteamState(Arc::new(Mutex::new(None)))
}

pub fn steam_invoke_handler() -> impl Fn(tauri::ipc::Invoke) -> bool + Send + Sync + 'static {
    tauri::generate_handler![
        steam_init,
        steam_unlock_achievement,
        steam_clear_achievement,
        steam_is_achievement_unlocked,
        steam_cloud_save,
        steam_cloud_load,
        steam_cloud_delete,
        steam_cloud_exists,
        steam_get_auth_ticket
    ]
}

#[tauri::command]
pub fn steam_init(state: State<SteamState>) -> Result<bool, String> {
    // Prevent double initialization on hot reload
    if state.0.lock().unwrap().is_some() {
        log::info!("Steam already initialized, skipping");
        return Ok(true);
    }

    let client_result = Client::init_app(AppId(STEAM_APP_ID));
    match client_result {
        Ok(client) => {
            log::info!("Steam initialized successfully");
            *state.0.lock().unwrap() = Some(client);
            Ok(true)
        }
        Err(e) => Err(format!("Steam init failed: {}", e)),
    }
}

#[tauri::command]
pub fn steam_unlock_achievement(state: State<SteamState>, name: String) -> Result<(), String> {
    let guard = state.0.lock().unwrap();
    let client = guard.as_ref().ok_or("Steam not initialized")?;
    client
        .user_stats()
        .achievement(&name)
        .set()
        .map_err(|_| format!("Failed to unlock achievement: {}", name))?;
    client
        .user_stats()
        .store_stats()
        .map_err(|_| "Failed to store stats")?;
    Ok(())
}

#[tauri::command]
pub fn steam_clear_achievement(state: State<SteamState>, name: String) -> Result<(), String> {
    let guard = state.0.lock().unwrap();
    let client = guard.as_ref().ok_or("Steam not initialized")?;
    client
        .user_stats()
        .achievement(&name)
        .clear()
        .map_err(|_| format!("Failed to clear achievement: {}", name))?;
    client
        .user_stats()
        .store_stats()
        .map_err(|_| "Failed to store stats")?;
    Ok(())
}

#[tauri::command]
pub fn steam_is_achievement_unlocked(
    state: State<SteamState>,
    name: String,
) -> Result<bool, String> {
    let guard = state.0.lock().unwrap();
    let client = guard.as_ref().ok_or("Steam not initialized")?;
    client
        .user_stats()
        .achievement(&name)
        .get()
        .map_err(|_| format!("Failed to get achievement status: {}", name))
}

#[tauri::command]
pub fn steam_cloud_save(
    state: State<SteamState>,
    filename: String,
    data: String,
) -> Result<(), String> {
    let guard = state.0.lock().unwrap();
    let client = guard.as_ref().ok_or("Steam not initialized")?;
    let file = client.remote_storage().file(&filename);
    let mut writer = file.write();
    writer
        .write_all(data.as_bytes())
        .map_err(|e| format!("Failed to write to Steam Cloud: {}", e))?;
    Ok(())
}

#[tauri::command]
pub fn steam_cloud_load(
    state: State<SteamState>,
    filename: String,
) -> Result<Option<String>, String> {
    let guard = state.0.lock().unwrap();
    let client = guard.as_ref().ok_or("Steam not initialized")?;
    let file = client.remote_storage().file(&filename);

    if !file.exists() {
        return Ok(None);
    }

    let mut reader = file.read();
    let mut content = String::new();
    reader
        .read_to_string(&mut content)
        .map_err(|e| format!("Failed to read from Steam Cloud: {}", e))?;
    Ok(Some(content))
}

#[tauri::command]
pub fn steam_cloud_delete(state: State<SteamState>, filename: String) -> Result<(), String> {
    let guard = state.0.lock().unwrap();
    let client = guard.as_ref().ok_or("Steam not initialized")?;
    let file = client.remote_storage().file(&filename);
    if !file.delete() {
        return Err(format!("Failed to delete file: {}", filename));
    }
    Ok(())
}

#[tauri::command]
pub fn steam_cloud_exists(state: State<SteamState>, filename: String) -> Result<bool, String> {
    let guard = state.0.lock().unwrap();
    let client = guard.as_ref().ok_or("Steam not initialized")?;
    Ok(client.remote_storage().file(&filename).exists())
}

#[tauri::command]
pub async fn steam_get_auth_ticket(state: State<'_, SteamState>) -> Result<String, String> {
    let client_arc = Arc::clone(&state.0);

    tauri::async_runtime::spawn_blocking(move || {
        let (tx, rx) = mpsc::channel();

        let guard = client_arc.lock().unwrap();
        let client = guard.as_ref().ok_or("Steam not initialized")?;

        // Get the ticket handle to match in callback
        let ticket_handle = client
            .user()
            .authentication_session_ticket_for_webapi("synergism-backend");

        // Register callback - must keep handle alive
        let _callback = client.register_callback(move |response: TicketForWebApiResponse| {
            if response.ticket_handle == ticket_handle {
                let mut ticket = response.ticket;
                ticket.truncate(response.ticket_len as usize);
                let _ = tx.send(match response.result {
                    Ok(()) => Ok(ticket),
                    Err(e) => Err(format!("Steam ticket error: {}", e)),
                });
            }
        });

        // Drop the guard so run_callbacks can acquire the lock
        drop(guard);

        let start = std::time::Instant::now();
        let timeout = std::time::Duration::from_secs(10);

        loop {
            if start.elapsed() > timeout {
                if let Some(client) = client_arc.lock().unwrap().as_ref() {
                    client.user().cancel_authentication_ticket(ticket_handle);
                }
                return Err("Steam auth ticket request timed out".to_string());
            }

            if let Some(client) = client_arc.lock().unwrap().as_ref() {
                client.run_callbacks();
            }

            match rx.try_recv() {
                Ok(Ok(bytes)) => return Ok(hex::encode(&bytes)),
                Ok(Err(e)) => {
                    if let Some(client) = client_arc.lock().unwrap().as_ref() {
                        client.user().cancel_authentication_ticket(ticket_handle);
                    }
                    return Err(e);
                }
                Err(mpsc::TryRecvError::Empty) => {
                    std::thread::sleep(std::time::Duration::from_millis(10));
                }
                Err(mpsc::TryRecvError::Disconnected) => {
                    if let Some(client) = client_arc.lock().unwrap().as_ref() {
                        client.user().cancel_authentication_ticket(ticket_handle);
                    }
                    return Err("Steam ticket request failed - callback disconnected".to_string());
                }
            }
        }
    })
    .await
    .map_err(|e| e.to_string())?
}
