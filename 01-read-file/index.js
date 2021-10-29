const path = require('path')
const fs = require('fs')

const filePath = path.join(__dirname, 'text.txt')
const stream = new fs.ReadStream(filePath, { encoding: 'utf-8' })

stream.on('readable', function () {
  const content = stream.read()
  if (content !== null) {
    console.log('File content:\n', content.trim())
  }
})

// stream.on('end', function () {
//   console.log('THE END')
// })
stream.on('error', function (err) {
  if (err.code == 'ENOENT') {
    console.log('File NOT found')
  } else {
    console.error(err)
  }
})
