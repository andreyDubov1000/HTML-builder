const path = require('path')
const fs = require('fs')
const { promisify } = require('util')
const readFilePromise = promisify(fs.readFile)

tagMergeHtml(__dirname, 'template.html', 'components', 'project-dist')
mergeStyles(__dirname, 'styles', 'project-dist', 'style.css')
copyDirectory(__dirname, 'assets', 'project-dist/assets')

function tagMergeHtml(__dirname, templateHtml, componentsFolder, distFolder) {
  const dist = path.join(__dirname, distFolder)
  const mainHtmlFilePath = path.join(__dirname, distFolder, 'index.html')
  const template = path.join(__dirname, templateHtml)
  const componentsHtml = path.join(__dirname, componentsFolder)
  const arrayPromises = []
  let mainContent = ''

  const readHtml = new fs.ReadStream(template, { encoding: 'utf-8' })

  readHtml.on('readable', () => {
    let chunk = readHtml.read()
    if (chunk !== null) {
      mainContent += chunk
    }
  })

  readHtml.on('end', function () {
    fs.readdir(componentsHtml, { withFileTypes: true }, (err, files) => {
      if (err) {
        console.error(`Reading error, folder : ${componentsHtml}\n`, err)
        return
      }
      for (const file of files) {
        const pathToCheck = path.join(componentsHtml, `${file.name}`)
        if (file.isFile() && path.extname(pathToCheck) === '.html') {
          arrayPromises.push(myPromisRead(file, pathToCheck))
        }
      }
      Promise.all(arrayPromises)
        .then(makeMainHtml)
        .catch((err) => console.error(err))
    })
  })

  function makeMainHtml() {
    fs.mkdir(dist, { recursive: true }, (err) => {
      if (err) {
        console.error(err)
        return
      }
      fs.writeFile(mainHtmlFilePath, mainContent, (err) => {
        if (err) console.error(err)
      })
    })
  }

  function myPromisRead(file, path) {
    const fileName = file.name.split('.')[0]
    const regExp = new RegExp(`{{${fileName}}}`, 'ig')
    return readFilePromise(path, 'utf-8')
      .then(
        (contentHtml) =>
          (mainContent = mainContent.replace(regExp, contentHtml))
      )
      .catch((err) => console.error(err))
  }
}

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

function copyDirectory(__dirname, folderSrc, folderDist) {
  const src = path.join(__dirname, folderSrc)
  const dist = path.join(__dirname, folderDist)

  function clearDir(dist) {
    fs.readdir(dist, { withFileTypes: true }, (err, files) => {
      if (err) {
        console.error(err)
        return
      }
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
    })
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
    }
  })

  copyDir(dist, src)
}
