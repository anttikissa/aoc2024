import fs from 'fs'

let log = console.log

let file = fs.readFileSync('day2.txt', 'utf8')
 // file = fs.readFileSync('day2-test.txt', 'utf8')
let lines = file.split('\n').filter(Boolean)
let reports = lines.map((line) => line.split(' ').map(Number))

function adjacents(arr: number[]) {
	let result = []
	for (let i = 0; i < arr.length - 1; i++) {
		result.push([arr[i], arr[i + 1]])
	}
	return result
}

let adjs = reports.map(adjacents)

function between(n: number, min: number, max: number) {
	return n >= min && n <= max
}

function safe(pairs: number[][]) {
	let increasing = pairs.every((pair) => pair[0] < pair[1])
	let decreasing = pairs.every((pair) => pair[0] > pair[1])
	let diffsOk = pairs.every((pair) => between(Math.abs(pair[1] - pair[0]), 1, 3))

	return (increasing || decreasing) && diffsOk
}

let result = 0

for (let adj of adjs) {
	if (safe(adj)) {
		result++
	}
}

log('total', result)
