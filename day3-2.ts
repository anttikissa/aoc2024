import fs from 'fs'
let log = console.log

const input = fs.readFileSync('day3.txt', 'utf8')

let regex = /(mul\(\d{1,3},\d{1,3}\))|(do\(\))|(don't\(\))/g

let matches = input.match(regex)!

let result = 0
let enabled = true

for (let match of matches) {
	if (match.startsWith('do()')) {
		enabled = true
	} else if (match.startsWith("don't()")) {
		enabled = false
	} else if (match.startsWith('mul')) {
		let lhs = parseInt(match.slice(4))
		let rhs = parseInt(match.slice(match.indexOf(',') + 1))
		result += lhs * rhs * Number(enabled)
	}
}

log('result', result)
