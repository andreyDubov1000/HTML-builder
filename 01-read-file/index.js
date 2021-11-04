const path = require('path')
const fs = require('fs')

const filePath = path.join(__dirname, 'text.txt')
const stream = new fs.ReadStream(filePath, { encoding: 'utf-8' })
stream.pipe(process.stdout)

stream.on('close', function () {
  console.log('')
})

stream.on('error', function (err) {
  if (err.code == 'ENOENT') {
    console.log('File NOT found')
  } else {
    console.error(err)
  }
})
