// @ts-ignore
import file from './day15.txt'

import {
	assert,
	coords,
	fail,
	gridGet,
	gridPrint,
	gridSet,
	log,
	straightDirections,
	sum,
	toGrid,
	type Vec2,
	vecAdd,
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
	let [mapPart, instructionPart] = input.split('\n\n')

	function part2Mapper(what: string) {
		if (what === 'O') return '[]'
		if (what === '.') return '..'
		if (what === '#') return '##'
		if (what === '@') return '@.'
		if (what === 'o') return 'O.' // to test some corner cases
		return what
	}

	mapPart = mapPart
		.split('')
		.map(part === 2 ? part2Mapper : (i) => i)
		.join('')

	let grid = toGrid(mapPart)
	let instructions = instructionPart
		.trim()
		.split('')
		.filter((i: string) => i !== '\n')

	let robot = coords(grid).find((pos) => gridGet(grid, pos) === '@') as Vec2
	gridSet(grid, robot, '.')

	// log('grid before:\n' + gridPrint(grid, '@', robot) + '\n')

	function move(
		currPos: Vec2,
		dir: Vec2,
		mode: 'simulate' | 'for-real'
	): boolean {
		let nextPos = vecAdd(currPos, dir)
		let next = gridGet(grid, nextPos)

		try {
			switch (next) {
				case '.':
					return true
				case '#':
					return false
				case 'O':
					return move(nextPos, dir, mode)
				case '[':
				case ']':
					let nextDir = (next === '[' ? [1, 0] : [-1, 0]) as Vec2
					if (dir[0] === -nextDir[0] && dir[1] === 0) {
						return move(nextPos, dir, mode)
					} else {
						let pair = vecAdd(nextPos, nextDir)
						return move(pair, dir, mode) && move(nextPos, dir, mode)
					}
			}
		} finally {
			let curr = gridGet(grid, currPos)
			if (mode === 'for-real') {
				gridSet(grid, currPos, '.')
				gridSet(grid, nextPos, curr)
			}
		}
		fail('nope')
	}

	function step(instr: string) {
		let dir = straightDirections['v<^>'.indexOf(instr)]

		if (move(robot, dir, 'simulate')) {
			move(robot, dir, 'for-real')
			robot = vecAdd(robot, dir)
		}
	}

	for (let instr of instructions) {
		step(instr)
	}

	log('grid after:\n' + gridPrint(grid, '@', robot) + '\n')

	let boxes = [...coords(grid)].filter((pos) =>
		'O['.includes(gridGet(grid, pos))
	)
	let gps = boxes.map(([x, y]) => {
		return x + y * 100
	})

	return sum(gps)
}

assert(solve(test, 1), 10092)
assert(solve(file, 1), 1412971)
assert(solve(test, 2), 9021)
assert(solve(file, 2), 1429299)

log('ok')
