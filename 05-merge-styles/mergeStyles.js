const path = require('path')
const fs = require('fs')
module.exports = mergeStyles

function mergeStyles(__dirname, folderSrc, folderDist, nameCssFile) {
  const srcPath = path.join(__dirname, folderSrc)
  const distPath = path.join(__dirname, folderDist, nameCssFile)

  fs.mkdir(path.join(__dirname, folderDist), { recursive: true }, (err) => {
    if (err) console.error(err)
    const streamWrite = new fs.WriteStream(distPath, { encoding: 'utf-8' })
    streamWrite
      .on('error', (err) =>
        console.error(`Writing error, file : ${distPath}`, err)
      )
      .on('close', () => streamWrite.destroy())

    fs.readdir(srcPath, (err, files) => {
      for (const file of files) {
        const pathToCheck = path.join(srcPath, file)
        fs.stat(pathToCheck, function (err, stats) {
          if (stats.isFile() && path.extname(pathToCheck) === '.css') {
            const streamRead = new fs.ReadStream(pathToCheck, {
              encoding: 'utf-8',
            })
            streamRead.pipe(streamWrite)
            streamRead
              .on('error', (err) =>
                console.error(`Reading error file : ${pathToCheck}`, err)
              )
              .on('close', () => streamRead.destroy())
          }
          if (err) console.error(err)
        })
      }

      if (err) console.error(err)
    })
  })
}
