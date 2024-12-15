// @ts-ignore
import file from './day15.txt'

import {
	assert,
	coords,
	gridGet,
	log,
	straightDirections,
	toGrid,
	vecAdd,
	type Vec2,
	gridPrint,
	gridSet,
	sum,
	fail,
} from './utils'

let test = `
##########
#..O..O.O#
#......O.#
#.OO..O.O#
#..O@..O.#
#O#..O...#
#O..O..O.#
#.OO.O.OO#
#....O...#
##########

<vv>^<v^>v>^vv^v>v<>v^v<v<^vv<<<^><<><>>v<vvv<>^v^>^<<<><<v<<<v^vv^v>^
vvv<<^>^v^^><<>>><>^<<><^vv^^<>vvv<>><^^v>^>vv<>v<<<<v<^v>^<^^>>>^<v<v
><>vv>v^v^<>><>>>><^^>vv>v<^^^>>v^v^<^^>v^^>v^<^v>v<>>v^v^<v>v^^<^^vv<
<<v<^>>^^^^>>>v^<>vvv^><v<<<>^^^vv^<vvv>^>v<^^^^v<>^>vvvv><>>v^<<^^^^^
^><^><>>><>^^<<^^v>>><^<v>^<vv>>v>>>^v><>^v><<<<v>>v<v<v>vvv>^<><<>^><
^>><>^v<><^vvv<^^<><v<<<<<><^v<<<><<<^^<v<^^^><^>>^<v^><<<^>>^v<v^v<v^
>^>>^v>vv>^<<^v<>><<><<v<<v><>v<^vv<<<>^^v^>^^>>><<^v>>v^v><^^>>^<>vv^
<><^^>^^^<><vvvvv^v<v<<>^v<v>v<<^><<><<><<<^^<<<^<<>><<><^^^>^^<>^>v<>
^^>vv<^v^v<vv>^<><v<^v>^^^>>>^^vvv^>vvv<>>>^<^>>>>>^<<^v>^vvv<>^<><<v>
v^^>>><<^^<>>^v^<v^vv<>v^<<>^<^v^v><^<<<><<^<v><v<>vv>>v><v^<vv<>v^<<^
`

let test2 = `
#######
#...#.#
#.....#
#..OO@#
#..O..#
#.....#
#######

<vv<<^^<<^^`

function solve(input: string, part = 1) {
	let [part1, part2] = input.split('\n\n')
	// log('part1', part1)
	// log('part2', part2)

	function mapper(what: string) {
		if (what === 'O') return '[]'
		if (what === '.') return '..'
		if (what === '#') return '##'
		if (what === '@') return '@.'
		if (what === 'o') return 'O.'
		return what
	}

	part1 = part1
		.split('')
		.map(part === 2 ? mapper : (i) => i)
		.join('')

	let grid = toGrid(part1)
	let instructions = part2
		.trim()
		.split('')
		.filter((i: string) => i !== '\n')

	let robot = coords(grid).find((pos) => gridGet(grid, pos) === '@') as Vec2
	gridSet(grid, robot, '.')

	log('grid\n' + gridPrint(grid, '@', robot) + '\n')

	let cut = Infinity
	let stp = 0

	// cut = 2

	function step(instr: string) {
		if (cut-- <= 0) return

		// log(`STEP ${stp++}`, instr, { robot })
		let dir = straightDirections['v<^>'.indexOf(instr)]
		let nextPos = vecAdd(robot, dir)

		function isOkToMove(thisPos: Vec2, nextPos: Vec2): boolean {
			// log(
			// 	'\n\nSTART move',
			// 	{ thisPos, nextPos },
			// 	', grid is\n' + gridPrint(grid, instr, thisPos)
			// )

			let cur = gridGet(grid, thisPos)
			let next = gridGet(grid, nextPos)
			// log('isOkToMove()', { thisPos, nextPos, cur, next })

			let ok = true

			if (next === '#') {
				ok = false
			}
			if (next === 'O') {
				ok = isOkToMove(nextPos, vecAdd(nextPos, dir))
			}
			if (next === '[') {
				let pair = vecAdd(nextPos, [1, 0])
				if (dir[0] === -1 && dir[1] === 0) {
					ok = isOkToMove(nextPos, vecAdd(nextPos, dir))
				} else {
					// Move pair first
					let pairNext = vecAdd(pair, dir)
					ok = isOkToMove(pair, pairNext)
					if (ok) {
						ok = isOkToMove(nextPos, vecAdd(nextPos, dir))
					} else {
						// Undo move of pair?? UMM not necessary
						// move(pairNext, pair)
					}
				}
			}

			// function vertical(dir: Vec2) {
			// 	return dir[0] === 0 && dir[1] !== 0
			// }

			if (next === ']') {
				let pair = vecAdd(nextPos, [-1, 0])
				// if (vertical(dir)) {
				// 	ok &&= isOkToMove(nextPos, vecAdd(nextPos, dir))
				// 	ok &&= isOkToMove(pair, vecAdd(pair, dir))
				// } else
				{
					if (dir[0] === 1 && dir[1] === 0) {
						ok = isOkToMove(nextPos, vecAdd(nextPos, dir))
					} else {
						// Move pair first
						let pairNext = vecAdd(pair, dir)
						ok = isOkToMove(pair, pairNext)
						if (ok) {
							ok = isOkToMove(nextPos, vecAdd(nextPos, dir))
						} else {
							// // Undo move of pair
							// move(pairNext, pair)
						}
					}
				}
			}
			if (next === '.') {
				ok = true
			}
			if (ok) {
				let curr = gridGet(grid, thisPos)
				// gridSet(grid, thisPos, '.')
				// gridSet(grid, nextPos, curr)
			}

			return ok
		}

		function move(thisPos: Vec2, nextPos: Vec2): boolean {
			// log(
			// 	'\n\nSTART move',
			// 	{ thisPos, nextPos },
			// 	', grid is\n' + gridPrint(grid, instr, thisPos)
			// )

			let cur = gridGet(grid, thisPos)
			let nextThing = gridGet(grid, nextPos)

			// log(`moving ${cur} to a (${nextThing})`, {
			// 	thisPos,
			// 	nextPos,
			// 	// movePair,
			// })

			// if (movePair === false && thisPos[0] === 7) {
			// 	fail('movePair is false')
			// }
			// log('move', thisPos, nextPos)
			let next = gridGet(grid, nextPos)
			let ok = true
			// log('false 1')
			if (next === '#') {
				ok = false
				log('false 2')
			}
			if (next === 'O') {
				ok = move(nextPos, vecAdd(nextPos, dir))
				if (!ok) log('false 3')
			}
			if (next === '[') {
				let pair = vecAdd(nextPos, [1, 0])
				// We came from right, don't attempt to move pair first
				if (dir[0] === -1 && dir[1] === 0) {
					ok = move(nextPos, vecAdd(nextPos, dir))
				} else {
					// Move pair first
					let pairNext = vecAdd(pair, dir)
					ok = move(pair, pairNext)
					if (ok) {
						ok = move(nextPos, vecAdd(nextPos, dir))
					} else {
						// Undo move of pair
						move(pairNext, pair)
					}
				}
			}
			if (next === ']') {
				let pair = vecAdd(nextPos, [-1, 0])
				// We came from right, don't attempt to move pair first
				if (dir[0] === -1 && dir[1] === 0) {
					ok = move(nextPos, vecAdd(nextPos, dir))
				} else {
					// Move pair first
					let pairNext = vecAdd(pair, dir)
					ok = move(pair, pairNext)
					if (ok) {
						ok = move(nextPos, vecAdd(nextPos, dir))
					} else {
						// Undo move of pair
						move(pairNext, pair)
					}
				}
			}
			if (next === '.') {
				ok = true
			}
			if (ok) {
				let curr = gridGet(grid, thisPos)
				gridSet(grid, thisPos, '.')
				gridSet(grid, nextPos, curr)
			}

			return ok
		}

		if (isOkToMove(robot, nextPos)) {
			if (move(robot, nextPos)) {
				robot = nextPos
			}
		}

		// log('grid\n' + gridPrint(grid, '@', robot) + '\n')
	}

	for (let instr of instructions) {
		step(instr)
		stp++
	}

	log('grid\n' + gridPrint(grid, '@', robot) + '\n')

	let boxes = [...coords(grid)].filter((pos) =>
		'O['.includes(gridGet(grid, pos))
	)
	let gps = boxes.map(([x, y]) => {
		return x + y * 100
	})

	// log('boxes', boxes)
	// log('gps', gps)

	// log({ grid }, { instructions })

	return sum(gps)
}

//
assert(solve(test, 1), 10092)
assert(solve(file, 1), 1412971)
//
assert(solve(test, 2), 9021)
assert(solve(file, 2), 1429299)
// assert(solve(test2, 2), 123)

log('ok')
