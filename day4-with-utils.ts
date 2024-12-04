import {
	coords,
	diagonalDirections,
	directions,
	gridGet,
	mulVec,
	addVec,
	range,
	readFile,
	toGrid,
} from './utils.ts'

let log = console.log

let grid: string[][] = toGrid(readFile('day4.txt'))

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

// grid = toGrid(test)

// Part 1
let result1 = 0

for (let coord of coords(grid)) {
	if (gridGet(grid, coord) === 'X') {
		for (let direction of directions) {
			let letters = range(1, 3).map((i) =>
				gridGet(grid, addVec(coord, mulVec(direction, i)))
			)
			if (letters.join('') === 'MAS') {
				result1++
			}
		}
	}
}

log('part 1', result1)

// Part 2
let result2 = 0
let validCombinations = ['MMSS', 'SMMS', 'MSSM', 'SSMM']

for (let coord of coords(grid)) {
	if (gridGet(grid, coord) === 'A') {
		let rest = diagonalDirections.map((dir) => gridGet(grid, addVec(coord, dir)))
		if (validCombinations.includes(rest.join(''))) {
			result2++
		}
	}
}

log('part 2', result2)
