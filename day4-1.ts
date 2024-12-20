import { readLines } from './utils.ts'

let log = console.log
let lines: string[][] = readLines('day4.txt').map((line) =>
	line.trim().split('')
)

let test = `
MMMSXXMASM
MSAMXMSMSA
AMXSXMAAMM
MSAMASMSMX
XMASAMXAMM
XXAMMXXAMA
SMSMSASXSS
SAXAMASAAA
MAMMMXMMMM
MXMXAXMASX`

// test = `
// ......
// ..X...
// .SAMX.
// .A..A.
// XMAS.S
// .X....`

// lines = test.trim().split('\n').map(x => x.trim()).map(x => x.split(''))

let h = lines.length
let w = lines[0]?.length || 0

let directions = [
	[0, 1],
	[1, 0],
	[0, -1],
	[-1, 0],
	[1, 1],
	[1, -1],
	[-1, 1],
	[-1, -1]
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
	let count = 0
	let pos = [i, j]
	for (let dir of directions) {
		if (get(advance(pos, dir, 1)) === 'M'
			&& get(advance(pos, dir, 2)) === 'A'
			&& get(advance(pos, dir, 3)) === 'S') {
			count++
		}
	}
	return count
}

// log('h', h, 'w', w)
let result = 0

for (let i = 0; i < w; i++) {
	for (let j = 0; j < h; j++) {
		if (lines[i][j] === 'X') {
			result += check(i, j)
		}
	}
}

log('result', result)
