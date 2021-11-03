const path = require('path')
const fs = require('fs')
module.exports = mergeStyles

function mergeStyles(__dirname, folderSrc, folderDist, nameCssFile) {
  const srcPath = path.join(__dirname, folderSrc)
  const distPath = path.join(__dirname, folderDist, nameCssFile)

  fs.mkdir(path.join(__dirname, folderDist), { recursive: true }, (err) => {
    if (err) {
      console.error("Can't make folder", err)
      return
    }
    const streamWrite = new fs.WriteStream(distPath, { encoding: 'utf-8' })
    streamWrite
      .on('error', (err) =>
        console.error(`Writing error, file : ${distPath}\n`, err)
      )
      .on('close', () => streamWrite.destroy())

    fs.readdir(srcPath, (err, files) => {
      if (err) {
        console.error(`Reading error, folder : ${srcPath}\n`, err)
        return
      }
      for (const file of files) {
        const pathToCheck = path.join(srcPath, file)
        fs.stat(pathToCheck, function (err, stats) {
          if (err) {
            console.error('Reading stats  error', err)
            return
          }
          if (stats.isFile() && path.extname(pathToCheck) === '.css') {
            const streamRead = new fs.ReadStream(pathToCheck, {
              encoding: 'utf-8',
            })
            streamRead
              .on('error', (err) =>
                console.error(`Reading error, file : ${pathToCheck}\n`, err)
              )
              .on('close', () => streamRead.destroy())
            streamRead.pipe(streamWrite)
          }
        })
      }
    })
  })
}
