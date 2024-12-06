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

// High 4 bits contain the visited status
const cellStatusVisited = 0x10

const width = input.indexOf('\n')
const height = input.length / (width + 1) // should be integer
const map = new Uint8Array(width * height)
let guardPos = 0 // Index in buf
let guardDir = 0 // 0: up, 1: right, 2: down, 3: left

for (let i = 0, mapPos = 0; i < input.length; i++) {
	if (input[i] === '^') {
		guardPos = mapPos
	}
	if (input[i] === '\n') {
		continue
	}
	map[mapPos++] = input[i] === '#' ? cellTypeOccupied : cellTypeEmpty
}

function toXY(pos: number) {
	let x = pos % width
	let y = (pos / width) | 0
	return { x, y }
}

function print(buf: Uint8Array, guardPos: number, guardDir: number) {
	let result = ''
	for (let i = 0; i < buf.length; i++) {
		if (i === guardPos) {
			result += '^>v<'[guardDir]
		} else {
			let low = buf[i] & 0x0f
			let high = buf[i] & 0xf0
			if (low === cellTypeOccupied) {
				result += '#'
			} else {
				if (high === cellStatusVisited) {
					result += 'X'
				} else {
					result += '.'
				}
			}
		}
		if (i % width! === width! - 1) result += '\n'
	}
	return result
}

log('buf', { width, height }, 'map:\n' + print(map, guardPos, guardDir))

function step(): number {
	// Mark cell as visited
	map[guardPos] |= 0x10

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

	// If next cell is occupied...
	if ((map[nextPos] & 0x0f) === cellTypeOccupied) {
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
	if (finished) break
}

let visitedCells = map.reduce((acc, cell) => acc + (cell & 0xf0 ? 1 : 0), 0)
log('part 1', visitedCells)

