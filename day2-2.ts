import { range, readLines, toNumbers } from './utils.ts'

let log = console.log

let reports = readLines('day2.txt').map(toNumbers)

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
log('total', safes.length)
