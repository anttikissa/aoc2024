import { readFile, toLines } from './utils.ts'

let file = readFile('day7.txt')
let log = console.log

let lines = toLines(file)
let test = `
190: 10 19
3267: 81 40 27
83: 17 5
156: 15 6
7290: 6 8 6 15
161011: 16 10 13
192: 17 8 14
21037: 9 7 18 13
292: 11 6 16 20`

// lines = toLines(test)

let add = (a: number, b: number) => a + b
let mul = (a: number, b: number) => a * b

// Part 1
function solve(line: string) {
	let [result, rest] = line.split(': ')
	let nums = rest.split(' ')
	let operators = nums.length - 1
	// Every binary combination of operators (0 is +, 1 is *)
	for (let i = 0; i < 2 ** operators; i++) {
		let acc = Number(nums[0])
		// log('check operators', line, i.toString(2))
		for (let j = 0; j < operators; j++) {
			let operator = i & (1 << j) ? mul : add
			acc = operator(acc, Number(nums[j + 1]))
		}
		// log('result', acc)
		if (acc === Number(result)) {
			// log('match', line, acc)
			return acc
		}
	}
	return 0
}

let result = 0
for (let line of lines) {
	result += solve(line)
}

log('part 1', result)

let concat = (a: number, b: number) => Number(String(a) + String(b))

// Part 1
function solve2(line: string) {
	let [result, rest] = line.split(': ')
	let nums = rest.split(' ')
	let operators = nums.length - 1
	for (let i = 0; i < 2 ** operators; i++) {
		let acc = Number(nums[0])
		// log('check operators', line, i.toString(2))
		let num = i
		for (let j = 0; j < operators; j++) {
			let rem = num % 2
			num = num / 2 | 0

			let operator = rem === 0 ? add : mul
			acc = operator(acc, Number(nums[j + 1]))
		}
		// log('result', acc)
		if (acc === Number(result)) {
			// log('match', line, acc)
			return acc
		}
	}
	return 0
}

let result2 = 0
for (let line of lines) {
	result2 += solve(line)
}

log('part 2', result2)
