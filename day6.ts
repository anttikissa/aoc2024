import {
	vecAdd,
	coords,
	gridGet,
	gridWithinIs,
	gridSet,
	log,
	readFile,
	toGrid,
	type Vec2,
} from './utils.ts'

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

let origGrid = toGrid(input)

function printGrid(grid: string[][]) {
	return grid.map((row) => row.join('')).join('\n')
}

// log('grid at start:\n' + printGrid(origGrid))

let origGuardPos = coords(origGrid).find(([x, y]) => origGrid[y][x] === '^')!

let guardPos = origGuardPos

// log('guardPos', guardPos)

let dirs: Vec2[] = [
	[0, -1],
	[1, 0],
	[0, 1],
	[-1, 0],
]

let guards = ['^', '>', 'v', '<']

let currentDir = 0

let previousDirs = new Map<string, Set<Vec2>>()

function clearPreviousDirs() {
	previousDirs.clear()
}

function addPreviousDir(pos: string, dir: Vec2) {
	let prevDirs: Set<Vec2> | undefined = previousDirs.get(pos)
	if (!prevDirs) {
		previousDirs.set(pos, new Set<Vec2>([dir]))
	} else {
		prevDirs.add(dir)
	}
}

function checkPreviousDir(pos: string, dir: Vec2) {
	let prevDirs: Set<Vec2> | undefined = previousDirs.get(pos)
	if (prevDirs) {
		return prevDirs.has(dir)
	}
	return false
}

function step(grid: string[][]) {
	// Mark X as "we've been here"
	gridSet(grid, guardPos, 'X')
	// Record the direction we're been here in
	addPreviousDir(guardPos.join(','), dirs[currentDir])

	let nextPos = vecAdd(guardPos, dirs[currentDir])

	if (!gridWithinIs(nextPos, grid)) {
		// Next pos out of bounds -> quit
		return true
	}

	if (gridGet(grid, nextPos).match(/[#O]/)) {
		// Next pos blocked -> turn
		currentDir = (currentDir + 1) % 4
	} else {
		// We can advance - do it
		guardPos = nextPos

		// If we were here before in the same direction, we have a loop
		if (gridGet(grid, guardPos) === 'X') {
			if (checkPreviousDir(guardPos.join(','), dirs[currentDir])) {
				return 'loop'
			}
		}
	}
	return false
}

let part1Grid = copyGrid(origGrid)

let finished: boolean | 'loop' = false
while (!finished) {
	finished = step(part1Grid)
}

let result = 0
for (let coord of coords(part1Grid)) {
	if (gridGet(part1Grid, coord) === 'X') {
		result++
	}
}

log('part 1', result)

// Part 2

function copyGrid(grid: string[][]) {
	return grid.map((row) => row.slice())
}

function placeObstruction(grid: string[][], pos: Vec2) {
	gridSet(grid, pos, 'O')
}

function checkLoop(grid: string[][]) {
	clearPreviousDirs()
	guardPos = origGuardPos
	currentDir = 0

	let finished: boolean | 'loop' = false
	while (!finished) {
		finished = step(grid)
	}
	return finished === 'loop'
}

let result2 = 0
for (let coord of coords(origGrid)) {
	if (gridGet(part1Grid, coord) !== 'X') {
		continue
	}

	let copy = copyGrid(origGrid)
	placeObstruction(copy, coord)

	if (checkLoop(copy)) {
		// log('loop at', coord)
		result2++
	}
}

log('part 2', result2)
