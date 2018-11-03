let parseValue = require('./Parser')
let fs = require('fs')
let text = fs.readFileSync(process.argv[2])
console.log(JSON.stringify(parseValue(text.toString())))
