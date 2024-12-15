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

function solve(input: string) {
	let [part1, part2] = input.split('\n\n')
	log('part1', part1)
	log('part2', part2)

	let grid = toGrid(part1)
	let instructions = part2
		.trim()
		.split('')
		.filter((i: string) => i !== '\n')

	let robot = coords(grid).find((pos) => gridGet(grid, pos) === '@') as Vec2
	gridSet(grid, robot, '.')

	log('grid\n' + gridPrint(grid, '@', robot) + '\n')

	// let cut = 2
	for (let instr of instructions) {
		step(instr)
	}

	function step(instr: string) {
		// if (cut-- < 0) return

		// log('step', instr, { robot })
		let dir = straightDirections['v<^>'.indexOf(instr)]
		let nextPos = vecAdd(robot, dir)

		function move(thisPos: Vec2, nextPos: Vec2): boolean {
			// log('move', thisPos, nextPos)
			let next = gridGet(grid, nextPos)
			let ok = false
			if (next === '#') {
				ok = false
			}
			if (next === 'O') {
				ok = move(nextPos, vecAdd(nextPos, dir))
			}
			if (next === '.') {
				ok = true
			}
			// log('move ok', { ok })
			if (ok) {
				let curr = gridGet(grid, thisPos)
				gridSet(grid, thisPos, '.')
				gridSet(grid, nextPos, curr)
			}

			return ok
		}

		if (move(robot, nextPos)) {
			robot = nextPos
		}

		// log('grid\n' + gridPrint(grid, '@', robot) + '\n')
	}

	let boxes = [...coords(grid)].filter((pos) => gridGet(grid, pos) === 'O')
	let gps = boxes.map(([x, y]) => {
		return x + y * 100
	})

	// log('boxes', boxes)
	// log('gps', gps)

	// log({ grid }, { instructions })

	return sum(gps)
}

assert(solve(test), 10092)
assert(solve(file), 1412971)

log('ok')
