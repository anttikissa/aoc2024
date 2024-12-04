import { readLines } from './utils.ts'

let log = console.log
let lines: string[][] = readLines('day4.txt').map((line) =>
	line.trim().split('')
)

let test = `
.M.S......
..A..MSMS.
.M.S.MAA..
..A.ASMSM.
.M.S.M....
..........
S.S.S.S.S.
.A.A.A.A..
M.M.M.M.M.
..........`

// lines = test.trim().split('\n').map(x => x.trim()).map(x => x.split(''))

let h = lines.length
let w = lines[0]?.length || 0

let diagonals = [
	[1, 1],
	[-1, -1],
	[1, -1],
	[-1, 1],
]

let validCombos = [
	'MSMS',
	'MSSM',
	'SMMS',
	'SMSM',
]

function get([x, y]: number[]) {
	return lines[x]?.[y] || ''
}

function advance([x, y]: number[], dir: number[], n: number) {
	while (n--) {
		x += dir[0]
		y += dir[1]
	}
	return [x, y]
}

function check(i: number, j: number) {
	let pos = [i, j]
	let chars = diagonals.map(diag => get(advance(pos, diag, 1)))
	if (validCombos.includes(chars.join(''))) {
		return 1
	}
	return 0
}

let result = 0

for (let i = 0; i < w; i++) {
	for (let j = 0; j < h; j++) {
		if (lines[i][j] === 'A') {
			result += check(i, j)
		}
	}
}

log('result', result)
