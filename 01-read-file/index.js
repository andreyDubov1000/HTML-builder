const path = require('path')
const fs = require('fs')

const filePath = path.join(__dirname, 'text.txt')
const stream = new fs.ReadStream(filePath, { encoding: 'utf-8' })
let content = ''

stream.on('readable', function () {
  let chunk = stream.read()
  if (chunk !== null) {
    content += chunk
  }
})

stream.on('end', function () {
  console.log('File content:\n', content.trim())
})

stream.on('error', function (err) {
  if (err.code == 'ENOENT') {
    console.log('File NOT found')
  } else {
    console.error(err)
  }
})
