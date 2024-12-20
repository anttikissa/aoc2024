// @ts-ignore
import input from './day20.txt'

import {
	assert,
	coords,
	gridCreate,
	gridGet,
	gridHeight,
	gridHeight,
	gridIsWithin,
	gridMap,
	gridPrint,
	gridSet,
	gridWidth,
	log,
	range,
	straightDirections,
	timer,
	toGrid,
	type Vec2,
	vecAdd,
} from './utils.ts'

let test = `
###############
#...#...#.....#
#.#.#.#.#.###.#
#S#...#.#.#...#
#######.#.#.###
#######.#.#...#
#######.#.###.#
###..E#...#...#
###.#######.###
#...###...#...#
#.#####.#.###.#
#.#...#.#.#...#
#.#.#.#.#.#.###
#...#...#...###
###############
`

function shortestPaths(grid: string[][], start: Vec2) {
	let distances = gridCreate(gridWidth(grid), gridHeight(grid), Infinity)
	gridSet(distances, start, 0)
	let queue = [start]

	while (queue.length) {
		let pos = queue.shift()!
		let distance = gridGet(distances, pos)
		for (let direction of straightDirections) {
			let neighbor = vecAdd(pos, direction)
			if (gridGet(grid, neighbor) === '#') continue
			if (distance + 1 < gridGet(distances, neighbor)) {
				gridSet(distances, neighbor, distance + 1)
				queue.push(neighbor)
			}
		}
	}

	return distances
}

let test2 = `
#####
#S..#
#.#.#
##E.#
#####
`

function solve(input: string, maxCheatDistance: number, minSaving: number) {
	let grid = toGrid(input)
	let startPos = coords(grid).find((pos) => gridGet(grid, pos) === 'S')!
	let endPos = coords(grid).find((pos) => gridGet(grid, pos) === 'E')!
	let distancesFromStart = shortestPaths(grid, startPos)
	let distancesFromEnd = shortestPaths(grid, endPos)

	let baselinePicoseconds = gridGet(distancesFromStart, endPos)
	assert(baselinePicoseconds, gridGet(distancesFromEnd, startPos))

	let validCheats = 0

	for (let hopFrom of coords(grid)) {
		let distanceFromStart = gridGet(distancesFromStart, hopFrom)

		for (let i of range(-maxCheatDistance, maxCheatDistance)) {
			for (let j of range(-maxCheatDistance, maxCheatDistance)) {
				if (i === 0 && j === 0) continue
				let cheatDistance = Math.abs(i) + Math.abs(j)
				if (cheatDistance > maxCheatDistance) continue
				let targetPos = vecAdd(hopFrom, [i, j])
				if (!gridIsWithin(targetPos, grid)) continue

				let distanceToEnd = gridGet(distancesFromEnd, targetPos)

				let totalPicoseconds =
					distanceFromStart + cheatDistance + distanceToEnd
				let picosecondsSaved = baselinePicoseconds - totalPicoseconds
				if (picosecondsSaved >= minSaving) {
					validCheats++
				}
			}
		}
	}

	return validCheats

	// function fmt(dist: number) {
	// 	return dist === Infinity ? '  -' : String(dist).padStart(3)
	// }
	// log('TEST', '\n' + gridPrint(gridMap(distancesFromStart, fmt)))
	// log('TEST', '\n' + gridPrint(gridMap(distancesFromEnd, fmt)))
}

{
	// Original: 100 ms
	// Shaved down to 40 ms
	using perf = timer('test (2)')
	assert(solve(test, 2, 1), 44)
}

{
	// 1.4 s
	using perf = timer('test (20)')
	assert(solve(test, 20, 50), 285)
}

// Takes a long time
{
	using perf = timer('real (2)')
	assert(solve(input, 2, 100), 1263)
}

{
	using perf = timer('input (20)')
	assert(solve(input, 20, 100), 957831)
}
