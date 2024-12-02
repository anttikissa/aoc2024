import * as fs from 'node:fs'

let log = console.log

let file = fs.readFileSync('day1.txt', 'utf8')
let lines = file.split('\n').filter(Boolean)

let pairs = lines.map((line) => line.split(/\s+/).map(Number))
let lefts = pairs.map((pair) => pair[0]).sort((x, y) => x - y)
let rights = pairs.map((pair) => pair[1]).sort((x, y) => x - y)

let counts = new Map<number, number>()
for (let n of rights) {
	if (!counts.has(n)) {
		counts.set(n, 1)
	} else {
		counts.set(n, counts.get(n)! + 1)
	}
}

log('counts', counts)

let total = 0
for (let i = 0; i < lefts.length; i++) {
	let sim = lefts[i] * (counts.get(lefts[i]) ?? 0)
	total += sim
}

log('total', total)
