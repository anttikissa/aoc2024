import fs from 'fs'
let log = console.log

const input = fs.readFileSync('day3.txt', 'utf8')

let regex = /mul\(\d{1,3},\d{1,3}\)/g

let matches = input.match(regex)!

let result = 0
for (let match of matches) {
	let lhs = parseInt(match.slice(4))
	let rhs = parseInt(match.slice(match.indexOf(',') + 1))
	result += lhs * rhs
}

log('result', result)
