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
writeStream.on('error', (err) => console.error('Writing error', err))
rl.prompt()

rl.on('line', (line) => {
  if (line.trim().match(/^exit$/i)) {
    console.log(`\nThanks for your opinion, it's very important to us : exit`)
    rl.close()
  }
  writeStream.write(`${line}\n`)
  rl.prompt()
})
  .on('close', () => {
    console.log(`\nHave a great day!\n`)
    process.exit(0)
  })
  .on('error', (err) => console.error(err))
