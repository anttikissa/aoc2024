import {
	coords,
	gridGet,
	gridWithinIs,
	log,
	straightDirections,
	toGrid,
	uniqueCount,
	type Vec2,
	vecAdd,
} from './utils.ts'

// @ts-ignore
import file from './day10.txt' with { type: 'text' }

// let file = readFile('day10.txt')

// log('file', file)

let grid = toGrid(file)

let test = `0123
1234
8765
9876`

test = `
...0...
...1...
...2...
6543456
7.....7
8.....8
9.....9`

test = `
..90..9
...1.98
...2..7
6543456
765.987
876....
987....`

test = `
10..9..
2...8..
3...7..
4567654
...8..3
...9..2
.....01
`

test = `
89010123
78121874
87430965
96549874
45678903
32019012
01329801
10456732`

// grid = toGrid(test)

let trailheads = [
	...coords(grid).filter((coord) => gridGet(grid, coord) === '0'),
]

// log({ grid, trailheads })

// Array of all tops reachable from pos
function countTops(pos: Vec2): Vec2[] {
	let height = gridGet(grid, pos)
	if (height === '.') {
		return []
	}

	if (gridGet(grid, pos) === '9') {
		return [pos]
	}
	let adjacentPositions = straightDirections.map((dir) => vecAdd(pos, dir))
	let legitPositions = adjacentPositions.filter((pos) => {
		return (
			// @ts-ignore sloppy JS comparison
			gridWithinIs(pos, grid) && gridGet(grid, pos) == Number(height) + 1
		)
	})

	return legitPositions.flatMap((pos) => countTops(pos))
}

// part 1
let result = 0

for (let trailhead of trailheads) {
	let tops = countTops(trailhead).map((pos) => pos.join(','))
	let uniques = uniqueCount(tops)
	result += uniques
}

log('part 1', result)

// part 2
let result2 = 0

for (let trailhead of trailheads) {
	let tops = countTops(trailhead).map((pos) => pos.join(','))
	let rating = tops.length
	result2 += rating
}

log('part 2', result2)
