import fs from 'fs'

let log = console.log

let file = fs.readFileSync('day2.txt', 'utf8')
let lines = file.split('\n').filter(Boolean)
let reports = lines.map((line) => line.split(' ').map(Number))

function range(n: number) {
	return Array(n).fill(0).map((_, i) => i)
}

function adjacents(arr: number[]) {
	return range(arr.length - 1).map(i => [arr[i], arr[i + 1]])
}

function between(n: number, min: number, max: number) {
	return n >= min && n <= max
}

function removeds(arr: number[]): number[][] {
	return range(arr.length).map(i => arr.toSpliced(i, 1))
}

function safe(report: number[]) {
	let pairs = adjacents(report)
	let increasing = pairs.every((pair) => pair[0] < pair[1])
	let decreasing = pairs.every((pair) => pair[0] > pair[1])
	let diffsOk = pairs.every((pair) =>
		between(Math.abs(pair[1] - pair[0]), 1, 3)
	)

	return (increasing || decreasing) && diffsOk
}

let safes = reports.filter(report => safe(report) || removeds(report).some(safe))
log('Total', safes.length)
