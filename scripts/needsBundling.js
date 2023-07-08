const { existsSync } = require('fs')

if (existsSync('dist')) {
  console.log('Skipping, build output already exists!')
} else if (!existsSync('package.json')) {
  console.log('Skipping, package.json does not exist -- dependencies cannot be installed')
} else {
  process.exit(1)
}
