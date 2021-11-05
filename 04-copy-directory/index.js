const fs = require('fs')
const path = require('path')
module.exports = copyDirectory

if (!module.parent) {
  copyDirectory(__dirname, 'files', 'files-copy')
}

function copyDirectory(__dirname, folderSrc, folderDist) {
  const src = path.join(__dirname, folderSrc)
  const dist = path.join(__dirname, folderDist)

  function clearDir(dist) {
    const unlink = (path) =>
      new Promise((res, rej) =>
        fs.unlink(path, (err) => {
          if (err) {
            rej(err)
          }
          res(true)
        })
      )
    const prArr = []
    return new Promise((res, rej) =>
      fs.readdir(dist, { withFileTypes: true }, (err, files) => {
        if (err) {
          rej(err)
        }
        for (const file of files) {
          const pathItem = path.join(dist, file.name)
          if (file.isDirectory()) {
            prArr.push(clearDir(pathItem))
          } else {
            prArr.push(unlink(pathItem))
          }
        }

        Promise.all(prArr)
          .then(() =>
            fs.rmdir(dist, (err) => {
              if (err) {
                console.error(err)
              }
              res()
            })
          )
          .catch((err) => console.error(err))
      })
    )
  }

  function copyDir(dist, src) {
    fs.mkdir(dist, { recursive: true }, (err) => {
      if (err) {
        console.error("Can't make folder", err)
        return
      }
      fs.readdir(src, { withFileTypes: true }, (err, files) => {
        if (err) {
          console.error(err)
          return
        }
        for (const file of files) {
          if (file.isDirectory()) {
            copyDir(path.join(dist, file.name), path.join(src, file.name))
          } else {
            const pathItemSrc = path.join(src, file.name)
            const pathItemDist = path.join(dist, file.name)

            fs.copyFile(pathItemSrc, pathItemDist, (err) => {
              if (err) {
                console.error("Can't copy files", err)
              }
            })
          }
        }
      })
    })
  }

  fs.access(dist, fs.constants.F_OK, (err) => {
    if (!err) {
      clearDir(dist)
        .then(() => copyDir(dist, src))
        .catch((err) => console.error(err))
    } else {
      copyDir(dist, src)
    }
  })
}
