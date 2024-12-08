import {
	addVec,
	coords,
	gridGet,
	gridIsWithin,
	pairs,
	readFile,
	subVec,
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

log('grid', grid)

function print(printAntis: boolean) {
	let result = ''
	for (let coord of coords(grid)) {
		if (coord[1] === 0 && coord[0] > 0) {
			result += '\n'
		}
		if (printAntis) {
			if (antinodes.has(coord.toReversed().join(','))) {
				result += '#'
			} else {
				result += gridGet(grid, [coord[1], coord[0]])
			}

		} else {
			result += gridGet(grid, [coord[1], coord[0]])

		}
	}
	return result
}

let freqs = new Map<string, Vec2[]>()

for (let coord of coords(grid)) {
	let freq = gridGet(grid, coord)
	if (freq !== '.') {
		if (freqs.has(freq)) {
			freqs.get(freq)!.push(coord)
		} else {
			freqs.set(freq, [coord])
		}
	}
}

let antinodes = new Set<string>() // x,y

for (let [freq, coords] of freqs.entries()) {
	// if (freq !== 'A')
	// 	continue

	for (let pair of pairs(coords)) {
		log('check pair', pair)

		// if (pair[0][0] === 8) {
		// 	if (pair[0][1] === 8) {
		// 		continue
		// 	}
		// }
		let diff = subVec(pair[1], pair[0])
		for (
			let anti1 = pair[0];
			gridIsWithin(anti1, grid);
			anti1 = subVec(anti1, diff)
		) {
			log('pair', pair, 'draws before', anti1 )
			antinodes.add(anti1.join(','))
		}
		for (
			let anti2 = pair[1];
			gridIsWithin(anti2, grid);
			anti2 = addVec(anti2, diff)
		) {
			antinodes.add(anti2.join(','))
		}
		// 1
		// let anti1 = subVec(pair[0], diff)
		// let anti2 = addVec(pair[1], diff)
		// if (gridIsWithin(anti1, grid)) {
		// 	antinodes.add(anti1.join(','))
		// }
		// if (gridIsWithin(anti2, grid)) {
		// 	antinodes.add(anti2.join(','))
		// }
	}

	log('freq', freq)
	log('coords', coords)
}

log('antinodes', antinodes)
log('!!! print\n' + print(true))

log('result', antinodes.size)
