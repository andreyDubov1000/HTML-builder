const path = require('path')
const fs = require('fs')

const filePath = path.join(__dirname, 'secret-folder')

fs.readdir(filePath, (err, files) => {
  if (err) {
    console.error(err)
    return
  }
  for (const file of files) {
    const pathToCheck = path.join(filePath, `${file}`)
    fs.stat(pathToCheck, function (err, stats) {
      if (err) {
        console.error('Reading stats  error', err)
        return
      }
      if (stats.isFile()) {
        const name = path.basename(pathToCheck, path.extname(pathToCheck))
        const ext = path.extname(pathToCheck).split('.')[1]
        console.log(`${name} - ${ext} - ${stats.size / 1000}Kb`)
      }
    })
  }
})
