const fs = require('fs')
const path = require('path')

module.exports = copyDirectory

function copyDirectory(__dirname, folderSrc, folderDist) {
  const src = path.join(__dirname, folderSrc)
  const dist = path.join(__dirname, folderDist)

  function clearDir(dist) {
    fs.readdir(dist, { withFileTypes: true }, (err, files) => {
      for (const file of files) {
        const pathItem = path.join(dist, file.name)
        if (file.isDirectory()) {
          clearDir(pathItem)
        } else {
          fs.unlink(pathItem, (err) => {
            if (err) console.error(err)
          })
        }
      }
      if (err) console.error(err)
    })
  }

  function copyDir(dist, src) {
    fs.mkdir(dist, { recursive: true }, (err) => {
      if (err) console.error(err)

      fs.readdir(src, { withFileTypes: true }, (err, files) => {
        for (const file of files) {
          if (file.isDirectory()) {
            copyDir(path.join(dist, file.name), path.join(src, file.name))
          } else {
            const pathItemSrc = path.join(src, file.name)
            const pathItemDist = path.join(dist, file.name)

            fs.copyFile(pathItemSrc, pathItemDist, (err) => {
              if (err) {
                console.error(err)
              }
            })
            if (err) console.error(err)
          }
        }
      })
    })
  }

  fs.access(dist, fs.constants.F_OK, (err) => {
    if (!err) {
      // fs.rm(dist, { recursive: true, force: true }, (err) => console.error(err))
      // fs.rm не работает в версии node до v14.14.0, у меня 13.14, win7

      clearDir(dist)
    }
  })

  copyDir(dist, src)
}
