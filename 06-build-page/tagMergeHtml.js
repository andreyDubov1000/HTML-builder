const path = require('path')
const fs = require('fs')
const { promisify } = require('util')
const readFilePromise = promisify(fs.readFile)

module.exports = tagMergeHtml

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

  // function myPromisRead(file, path) {
  //   return new Promise((res, rej) => {
  //     const fileName = file.name.split('.')[0]
  //     const regExp = new RegExp(`{{${fileName}}}`, 'ig')
  //     fs.readFile(path, 'utf-8', (err, contentHtml) => {
  //       if (err) rej(new Error(`Reading error, file ${fileName}\n`))
  //       mainContent = mainContent.replace(regExp, contentHtml)
  //       res(mainContent)
  //     })
  //   })
  // }
}
