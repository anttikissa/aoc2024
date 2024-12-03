import fs from 'fs'
let log = console.log

const input = fs.readFileSync('day3.txt', 'utf8')

let regex = /(mul\(\d{1,3},\d{1,3}\))|(do\(\))|(don't\(\))/g

let matches = input.match(regex)!

let result = 0
let enabled = 1

for (let match of matches) {
	if (match === 'do()') {
		enabled = 1
	} else if (match === "don't()") {
		enabled = 0
	} else if (match.startsWith('mul')) {
		let lhs = parseInt(match.slice(4))
		let rhs = parseInt(match.slice(match.indexOf(',') + 1))
		result += lhs * rhs * enabled
	}
}

log('result', result)
