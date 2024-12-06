import { addVec, coords, gridGet, gridIsWithin, gridSet, log, readFile, toGrid, type Vec2 } from './utils.ts'

let input = readFile('day6.txt')

if (0) {
	input = `
....#.....
.........#
..........
..#.......
.......#..
..........
.#..^.....
........#.
#.........
......#...`
}

let grid = toGrid(input)

log('grid\n' + grid.map((row) => row.join('')).join('\n'))

let guardPos = coords(grid).find(([x, y]) => grid[y][x] === '^')!

log('guardPos', guardPos)

let dirs: Vec2[] = [
	[0, -1],
	[1, 0],
	[0, 1],
	[-1, 0],
]

let currentDir = 0

function step() {
	log('step', guardPos, dirs[currentDir])

	gridSet(grid, guardPos, 'X')
	let nextPos = addVec(guardPos, dirs[currentDir])
	if (!gridIsWithin(nextPos, grid)) {
		log('finished')
		return true
	}
	log('next at pos', nextPos, 'is', gridGet(grid, nextPos))

	if (gridGet(grid, nextPos) === '#') {
		log('swap dir')

		currentDir = (currentDir + 1) % 4
	} else {
		log('advance')
		guardPos = nextPos
	}
	return false
}

// noinspection StatementWithEmptyBodyJS
let finished = false
while (!finished) {
	finished = step()
}

let result = 0
for (let coord of coords(grid)) {
	if (gridGet(grid, coord) === 'X') {
		result++
	}
}

log('result', result)
