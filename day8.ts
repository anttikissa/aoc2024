import {
	vecAdd,
	coords,
	gridGet,
	gridIsWithin,
	pairs,
	readFile,
	vecSub,
	toGrid,
	type Vec2,
} from './utils.ts'

let file = readFile('day8.txt')
let log = console.log

let grid = toGrid(file)

let test = `............
........0...
.....0......
.......0....
....0.......
......A.....
............
............
........A...
.........A..
............
............`

// grid = toGrid(test)

// log('grid', grid)

function print(printAntis: boolean) {
	let result = ''
	for (let coord of coords(grid)) {
		let [y, x] = coord
		if (y === 0 && x > 0) {
			result += '\n'
		}
		if (printAntis) {
			if (antinodes.has(coord.join(','))) {
				result += '#'
			} else {
				result += gridGet(grid, coord)
			}
		} else {
			result += gridGet(grid, coord)
		}
	}
	return result
}

let antennas = coords(grid).filter((coord) => gridGet(grid, coord) !== '.')
let freqs = Map.groupBy(antennas, (coord) => gridGet(grid, coord))

let antinodes = new Set<string>()

for (let [freq, coords] of freqs) {
	for (let pair of pairs(coords)) {
		let diff = vecSub(pair[1], pair[0])
		let anti1 = vecSub(pair[0], diff)
		let anti2 = vecAdd(pair[1], diff)
		if (gridIsWithin(anti1, grid)) {
			antinodes.add(anti1.join(','))
		}
		if (gridIsWithin(anti2, grid)) {
			antinodes.add(anti2.join(','))
		}
	}
}

// log('map after 1:\n' + print(true))
log('result 1', antinodes.size)

antinodes.clear()

for (let [freq, coords] of freqs) {
	for (let pair of pairs(coords)) {
		let diff = vecSub(pair[1], pair[0])
		for (
			let anti1 = pair[0];
			gridIsWithin(anti1, grid);
			anti1 = vecSub(anti1, diff)
		) {
			antinodes.add(anti1.join(','))
		}
		for (
			let anti2 = pair[1];
			gridIsWithin(anti2, grid);
			anti2 = vecAdd(anti2, diff)
		) {
			antinodes.add(anti2.join(','))
		}
	}
}

// log('map after 2:\n' + print(true))
log('result 2', antinodes.size)
