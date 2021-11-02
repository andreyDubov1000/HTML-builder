const path = require('path')
const fs = require('fs')
const readline = require('readline')

const filePath = path.join(__dirname, `log.txt`)
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: 'What do You have to say? (or <exit>)> ',
})
const writeStream = fs.createWriteStream(filePath, { encoding: 'utf-8' })

rl.prompt()

rl.on('line', (line) => {
  switch (line.trim()) {
    case 'exit':
      console.log(
        `\nThanks for your opinion, it's very important to us : ${line}`
      )
      rl.close()
      break
    default:
     
      writeStream.write(`${line}\n`)
      break
  }
  rl.prompt()
})
  .on('close', () => {
    console.log(`\nHave a great day!\n`)
    process.exit(0)
  })
  .on('error', function (err) {
    if (err.code == 'ENOENT') {
      console.log('File NOT exist!')
    } else {
      console.error(err)
    }
  })
