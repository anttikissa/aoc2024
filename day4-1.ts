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

test = `
....XXMAS.
.SAMXMS...
...S..A...
..A.A.MS.X
XMASAMX.MM
X.....XA.A
S.S.S.S.SS
.A.A.A.A.A
..M.M.M.MM
.X.X.XMASX`

// test = `
// ......
// ..X...
// .SAMX.
// .A..A.
// XMAS.S
// .X....`

lines = test.trim().split('\n').map(x => x.trim()).map(x => x.split(''))

// Turn grid 90 degrees
function flip(grid: string[][]) {
	let width = grid[0].length
	let height = grid.length

	let result: string[][] = Array(width)
		.fill(0)
		.map(() => Array(height).fill(0))
	for (let i = 0; i < width; i++) {
		for (let j = 0; j < height; j++) {
			result[i][j] = grid[height - j - 1][i]
		}
	}
	return result
}

// Turn grid 45 degrees
function diag(grid: string[][]) {
	let width = grid[0].length
	let height = grid.length

	if (width !== height) {
		throw new Error('whoops')
	}

	let result: string[][] = Array(width)
		.fill(0)
		.map(() => Array(height).fill(0))

	for (let line = 0; line < height; line++) {
		for (let i = 0; i < width; i++) {
			if (line - i < 0) {
				continue
			}
			result[line][i] = grid[line - i][i]
		}
	}
	return result
}

// lines = [['x', 'y', 'z'], ['a', 'b', 'c'], '123'.split('')]
//
log(lines.length)
log(lines[0].length)

let grid = lines
let result = 0

function count(grid: string[][]) {
	let lines = grid.map((line) => line.join(''))
	let matches = 0
	for (let line of lines) {
		matches += (line.match(/XMAS/g) || []).length
	}
	return matches
}

for (let i = 0; i < 4; i++) {
	grid = flip(grid)
	result += count(grid)
	let diags = diag(grid)
	result += count(diags)
}

log('result', result)

// log(lines)
// log(diag(lines))
// log(flip(flip(lines)))
// log(flip(flip(flip(lines))))
// log(flip(flip(flip(flip(lines)))))
