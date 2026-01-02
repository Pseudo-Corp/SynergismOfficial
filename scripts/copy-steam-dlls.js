const fs = require('fs')
const path = require('path')

const cargoHome = process.env.CARGO_HOME || path.join(process.env.HOME || process.env.USERPROFILE, '.cargo')
const registryPath = path.join(cargoHome, 'registry', 'src')
const tauriDir = path.join(__dirname, '..', 'src-tauri')
const destDir = path.join(tauriDir, 'lib', 'steam')

// Find steamworks-sys directory
const registryDirs = fs.readdirSync(registryPath)
let steamworksSysPath = null

for (const dir of registryDirs) {
  const fullPath = path.join(registryPath, dir)
  const crates = fs.readdirSync(fullPath)
  const steamworksSys = crates.find((c) => c.startsWith('steamworks-sys-'))
  if (steamworksSys) {
    steamworksSysPath = path.join(fullPath, steamworksSys, 'lib', 'steam', 'redistributable_bin')
    break
  }
}

if (!steamworksSysPath) {
  console.error('steamworks-sys not found in cargo registry')
  process.exit(1)
}

console.log(`Found steamworks-sys at: ${steamworksSysPath}`)

// Copy redistributable_bin to lib/steam for bundling
fs.rmSync(destDir, { recursive: true, force: true })
fs.mkdirSync(destDir, { recursive: true })
fs.cpSync(steamworksSysPath, destDir, { recursive: true })
console.log(`Copied Steam DLLs to: ${destDir}`)

// Also copy to target/debug and target/release for dev runs
const targetDebug = path.join(tauriDir, 'target', 'debug')
const targetRelease = path.join(tauriDir, 'target', 'release')

const platform = process.platform
let dllName, srcSubdir

if (platform === 'win32') {
  dllName = 'steam_api64.dll'
  srcSubdir = 'win64'
} else if (platform === 'darwin') {
  dllName = 'libsteam_api.dylib'
  srcSubdir = 'osx'
} else {
  dllName = 'libsteam_api.so'
  srcSubdir = 'linux64'
}

const srcDll = path.join(steamworksSysPath, srcSubdir, dllName)

for (const targetDir of [targetDebug, targetRelease]) {
  if (fs.existsSync(targetDir)) {
    const destDll = path.join(targetDir, dllName)
    fs.copyFileSync(srcDll, destDll)
    console.log(`Copied ${dllName} to: ${targetDir}`)
  }
}
