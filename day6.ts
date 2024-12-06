import {
	addVec,
	coords,
	gridGet,
	gridIsWithin,
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

log('guardPos', guardPos)

let dirs: Vec2[] = [
	[0, -1],
	[1, 0],
	[0, 1],
	[-1, 0],
]

let guards = [
	'^',
	'>',
	'v',
	'<',
]

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
	gridSet(grid, guardPos, 'X')
	addPreviousDir(guardPos.join(','), dirs[currentDir])

	let nextPos = addVec(guardPos, dirs[currentDir])
	if (!gridIsWithin(nextPos, grid)) {
		// log('went outside', { nextPos })
		return true
	}

	if (gridGet(grid, nextPos).match(/[#O]/)) {
		// log('turn at', { guardPos, currentDir })
		currentDir = (currentDir + 1) % 4
	} else {
		// log('advance to', { nextPos })
		guardPos = nextPos

		if (gridGet(grid, guardPos) === 'X') {
			let prevDir = previousDirs.get(guardPos.join(','))
			if (prevDir) {
				// log('we been here', { guardPos, prevDir, currDir: dirs[currentDir] })
				if (guardPos.join(',') === '21,46') {
					gridSet(grid, guardPos, guards[currentDir])

					// log('grid at DEBUGPOS:\n' + printGrid(grid))
					// log('')
					// process.exit(0)
				}
			}
			if (checkPreviousDir(guardPos.join(','), dirs[currentDir])) {
				// log('loop at', guardPos)
				// we've been here before in the same direction
				return 'loop'
			}
		}

	}
	return false
}


let finished: boolean | 'loop' = false
while (!finished) {
	finished = step(origGrid)
}

let result = 0
for (let coord of coords(origGrid)) {
	if (gridGet(origGrid, coord) === 'X') {
		result++
	}
}

log('part 1', result)

// Part 2

function copyGrid(grid: string[][]) {
	return grid.map((row) => row.slice())
}

function placeObstruction(grid: string[][], pos) {
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
// for (let coord of [[11,45]]) {
for (let coord of coords(origGrid)) {
	log('check coord', coord)

	let copy = copyGrid(origGrid)
	placeObstruction(copy, coord)

	if (checkLoop(copy)) {
		log('loop at', coord)
		result2++
	}
}

log('part 2', result2)

