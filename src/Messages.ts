import { DOMCacheGetOrSet } from './Cache/DOM'

export interface Message {
  id: number
  title: string
  content: string
  type: 'info' | 'warning' | 'error' | 'success'
  priority: number
  is_active: boolean
  created_at: string
  updated_at: string
  expires_at?: string
}

export interface MessageReadStatus {
  id: number
  user_id: string
  message_id: number
  read_at: string
}

export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  id?: number
}

export interface MessageListResponse extends ApiResponse<Message[]> {
  success: true
  data: Message[]
}

export interface MessageResponse extends ApiResponse<Message> {
  success: true
  data: Message
}

export interface SuccessResponse extends ApiResponse<never> {
  success: true
}

export interface ErrorResponse extends ApiResponse<never> {
  success: false
  error: string
}

let unreadMessages: Message[] = []

export const fetchUnreadMessages = async (): Promise<Message[]> => {
  try {
    const response = await fetch('https://synergism.cc/messages/unread', {
      credentials: 'include'
    })

    if (!response.ok) {
      console.warn('Failed to fetch messages:', response.statusText)
      return []
    }

    const result = await response.json() as MessageListResponse

    if (result.success && result.data) {
      unreadMessages = result.data.sort((a, b) => b.priority - a.priority)
      updateMessagesNotificationBadge()
      return unreadMessages
    }

    return []
  } catch (error) {
    console.error('Error fetching unread messages:', error)
    return []
  }
}

export const markMessageAsRead = async (messageId: number): Promise<boolean> => {
  try {
    const response = await fetch(`https://synergism.cc/messages/${messageId}/mark-read`, {
      method: 'POST',
      credentials: 'include'
    })

    if (!response.ok) {
      console.warn('Failed to mark message as read:', response.statusText)
      return false
    }

    const result = await response.json() as SuccessResponse

    if (result.success) {
      // Remove the message from local unread list
      unreadMessages = unreadMessages.filter((msg) => msg.id !== messageId)
      updateMessagesUI()
      updateMessagesNotificationBadge()
      return true
    }

    return false
  } catch (error) {
    console.error('Error marking message as read:', error)
    return false
  }
}

export const getUnreadMessages = (): Message[] => {
  return unreadMessages
}

export const hasUnreadMessages = (): boolean => {
  return unreadMessages.length > 0
}

const getMessageTypeColor = (type: Message['type']): string => {
  switch (type) {
    case 'info':
      return '#4A90E2'
    case 'warning':
      return '#F5A623'
    case 'error':
      return '#D0021B'
    case 'success':
      return '#7ED321'
    default:
      return '#4A90E2'
  }
}

const getMessageTypeIcon = (type: Message['type']): string => {
  switch (type) {
    case 'info':
      return 'ℹ'
    case 'warning':
      return '⚠'
    case 'error':
      return '❌'
    case 'success':
      return '✅'
    default:
      return 'ℹ'
  }
}

const updateMessagesNotificationBadge = () => {
  const messagesSubtabButton = DOMCacheGetOrSet('switchSettingSubTab10')
  let badge = messagesSubtabButton.querySelector('.messages-notification-badge') as HTMLElement

  if (!badge) {
    // Create the badge if it doesn't exist
    badge = document.createElement('span')
    badge.className = 'messages-notification-badge'
    badge.style.cssText = `
      background-color: #fa3e3e;
      border-radius: 2px;
      color: white;
      padding: 1px 3px;
      font-size: 10px;
      position: absolute;
      top: 0;
      right: 0;
      display: none;
    `

    // Make the messages subtab button relative positioned to contain the absolute badge
    messagesSubtabButton.style.position = 'relative'
    messagesSubtabButton.appendChild(badge)
  }

  const messageCount = unreadMessages.length
  if (messageCount > 0) {
    badge.textContent = messageCount.toString()
    badge.style.display = 'block'
  } else {
    badge.style.display = 'none'
  }
}

export const updateMessagesUI = () => {
  const messagesContainer = DOMCacheGetOrSet('messagesContainer')

  if (unreadMessages.length === 0) {
    messagesContainer.innerHTML = `
      <div style="text-align: center; color: #666; font-style: italic; padding: 20px;">
        No unread messages
      </div>
    `
    return
  }

  messagesContainer.innerHTML = unreadMessages
    .map((message) => `
      <div class="message-item" style="
        border: 2px solid ${getMessageTypeColor(message.type)};
        border-radius: 8px;
        margin: 10px 0;
        padding: 15px;
        background: rgba(0,0,0,0.2);
        position: relative;
      ">
        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 10px;">
          <div style="display: flex; align-items: center; gap: 8px;">
            <span style="font-size: 18px;">${getMessageTypeIcon(message.type)}</span>
            <strong style="color: ${getMessageTypeColor(message.type)}; font-size: 16px;">
              ${message.title}
            </strong>
          </div>
          <button 
            class="mark-read-btn" 
            data-message-id="${message.id}"
            style="
              background: #333;
              border: 1px solid #666;
              color: white;
              padding: 4px 8px;
              border-radius: 4px;
              cursor: pointer;
              font-size: 12px;
            "
            onmouseover="this.style.background='#555'"
            onmouseout="this.style.background='#333'"
          >
            Mark Read
          </button>
        </div>
        <div style="color: #ccc; margin-bottom: 8px; white-space: pre-wrap;">
          ${message.content}
        </div>
        <div style="
          display: flex; 
          justify-content: space-between; 
          align-items: center; 
          font-size: 12px; 
          color: #999;
        ">
          <span>Priority: ${message.priority}</span>
          <span>${new Date(message.created_at).toLocaleDateString()}</span>
        </div>
      </div>
    `)
    .join('')

  // Add event listeners for mark as read buttons
  const markReadButtons = messagesContainer.querySelectorAll('.mark-read-btn')
  markReadButtons.forEach((button) => {
    button.addEventListener('click', async (e) => {
      const messageId = Number.parseInt((e.target as HTMLElement).getAttribute('data-message-id')!)
      const success = await markMessageAsRead(messageId)

      if (success) {
        // Remove the message element from DOM
        const messageItem = button.closest('.message-item') as HTMLElement
        if (messageItem) {
          messageItem.style.transition = 'opacity 0.3s ease-out'
          messageItem.style.opacity = '0'
          setTimeout(() => {
            updateMessagesUI()
          }, 300)
        }
      }
    })
  })
}

// Initialize messages on load
export const initializeMessages = async () => {
  await fetchUnreadMessages()
  updateMessagesUI()
  updateMessagesNotificationBadge()
}
