let input: string = require('fs').readFileSync('day6.txt', 'utf8')
let log = console.log

if (0)
	input = `....#.....
.........#
..........
..#.......
.......#..
..........
.#..^.....
........#.
#.........
......#...
`

// 4 lower bits contain the state of the cell
const cellTypeEmpty = 0
const cellTypeOccupied = 1

// High 4 bits contain the bitwise OR of the followed statuses:
// 0b00010000: visited while going up
// 0b00100000: visited while going right
// 0b01000000: visited while going down
// 0b10000000: visited while going left

const width = input.indexOf('\n')
const height = input.length / (width + 1) // should be integer
const map = new Uint8Array(width * height)
let guardInitialPos = 0 // Index in buf
let guardPos = 0 // Index in buf
let guardDir = 0 // 0: up, 1: right, 2: down, 3: left
// Record all cells visited
let visitedCells: number[] = []

for (let i = 0, mapPos = 0; i < input.length; i++) {
	if (input[i] === '^') {
		guardPos = guardInitialPos = mapPos
	}
	if (input[i] === '\n') {
		continue
	}
	map[mapPos++] = input[i] === '#' ? cellTypeOccupied : cellTypeEmpty
}

// function toXY(pos: number) {
// 	let x = pos % width
// 	let y = (pos / width) | 0
// 	return { x, y }
// }
//
// function print(buf: Uint8Array, guardPos: number, guardDir: number, extraObstacle?: number) {
// 	let result = ''
// 	for (let i = 0; i < buf.length; i++) {
// 		if (i === extraObstacle) {
// 			result += 'O'
// 			continue
// 		}
// 		if (i === guardPos) {
// 			result += '^>v<'[guardDir]
// 		} else {
// 			let low = buf[i] & 0x0f
// 			let high = buf[i] & 0xf0
// 			if (low === cellTypeOccupied) {
// 				result += '#'
// 			} else {
// 				let wentUpOrDown = high & 0b10100000
// 				let wentLeftOrRight = high & 0b01010000
// 				if (wentUpOrDown && wentLeftOrRight) {
// 					result += '+'
// 				} else if (wentUpOrDown) {
// 					result += '-'
// 				} else if (wentLeftOrRight) {
// 					result += '|'
// 				} else {
// 					result += '.'
// 				}
// 			}
// 		}
// 		if (i % width! === width! - 1) result += '\n'
// 	}
// 	return result
// }

// log('buf', { width, height }, 'map:\n' + print(map, guardPos, guardDir))

// Return 1 if we went outside the map, 2 if we found a loop, 0 otherwise
function step(extraObstacle?: number): number {
	// We were here before, in this same direction
	if (map[guardPos] & (0x10 << guardDir)) {
		return 2
	}

	// Mark cell as visited
	map[guardPos] |= 0x10 << guardDir
	visitedCells.push(guardPos)

	let nextPos!: number,
		out = false
	// Advance and check if we ventured outside the map
	switch (guardDir) {
		case 0:
			nextPos = guardPos - width
			out = nextPos < 0
			break
		case 1:
			nextPos = guardPos + 1
			out = nextPos % width === 0
			break
		case 2:
			nextPos = guardPos + width
			out = nextPos >= width * height
			break
		case 3:
			nextPos = guardPos - 1
			out = nextPos % width === width - 1
			break
	}

	if (out) {
		return 1
	}

	// If the next cell is occupied...
	if ((map[nextPos] & 0x0f) === cellTypeOccupied || nextPos === extraObstacle) {
		// Turn right
		guardDir = (guardDir + 1) % 4
	} else {
		// Otherwise advance to the next cell
		guardPos = nextPos
	}
	return 0
}

// Part 1
while (true) {
	let finished = step()
	if (finished) {
		// log('after finishing, map\n' + print(map, guardPos, guardDir))
		break
	}
}

let visitedInPart1 = [...new Set(visitedCells)]
log('part 1', visitedInPart1.length)

let loops = 0

for (let extraObstacle of visitedInPart1) {
	guardPos = guardInitialPos
	guardDir = 0
	for (let cell of visitedCells) {
		map[cell] &= 0x0f
	}
	visitedCells = []

	while (true) {
		let finished = step(extraObstacle)
		if (finished) {
			// log('finished', finished)
			loops += finished === 2 ? 1 : 0
			// if (finished === 2) {
			// 	log('after finishing, map\n' + print(map, guardPos, guardDir, extraObstacle))
			// }
			break
		}
	}
}

log('part 2', loops)
