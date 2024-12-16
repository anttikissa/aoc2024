// @ts-ignore
import input from './day16.txt'
import {
	assert,
	coords,
	fail,
	gridGet,
	gridMap,
	gridPrint,
	gridSet,
	log,
	range,
	RIGHT,
	straightDirections,
	toGrid,
	ValueSet,
	type Vec2,
	vecAdd,
} from './utils.ts'

let test = `
###############
#.......#....E#
#.#.###.#.###.#
#.....#.#...#.#
#.###.#####.#.#
#.#.#.......#.#
#.#.#####.###.#
#...........#.#
###.#.#####.#.#
#...#.....#.#.#
#.#.#.###.#.#.#
#.....#...#.#.#
#.###.#.#.#.#.#
#S..#.....#...#
###############`

// 1,13U
// 1,12U
// 1,11U
// 1,11R
// 2,11R

let test2 = `
#################
#...#...#...#..E#
#.#.#.#.#.#.#.#.#
#.#.#.#...#...#.#
#.#.#.#.###.#.#.#
#...#.#.#.....#.#
#.#.#.#.#.#####.#
#.#...#.#.#.....#
#.#.#####.#.###.#
#.#.#.......#...#
#.#.###.#####.###
#.#.#...#.....#.#
#.#.#.#####.###.#
#.#.#.........#.#
#.#.#.#########.#
#S#.............#
#################`

function solve(input: string) {
	let grid = toGrid(input)

	let goal = coords(grid).find((c) => gridGet(grid, c) === 'E')!

	// Down left up right
	type Dir = 0 | 1 | 2 | 3

	type Node = [x: number, y: number, dir: Dir]
	function printNode([x, y, dir]: Node) {
		return `${x},${y}${'DLUR'[dir]}`
		// return `[${x}, ${y}], ${'v<^>'[dir]})`
	}

	function moveStraight([x, y, dir]: Node): Node {
		return [...vecAdd([x, y], straightDirections[dir]), dir]
	}

	function turnRight([x, y, dir]: Node): Node {
		return [x, y, ((dir + 1) % 4) as Dir]
	}

	function turnLeft([x, y, dir]: Node): Node {
		return [x, y, ((dir - 1 + 4) % 4) as Dir]
	}

	let unvisited = new ValueSet<Node>()

	let seen = gridMap(grid, (c) => (c === '#' ? '#' : '.'))

	for (let [x, y] of coords(grid)) {
		let tile = gridGet(grid, [x, y])
		if (tile === '#') continue
		for (let dir of [0, 1, 2, 3]) {
			unvisited.add([x, y, dir as Dir])
		}
	}

	// [x, y] grid of [down, left, up, right] distances
	let distances: number[][][] = gridMap(grid, (tile) => {
		if (tile === 'S') return [1000, 1000, 1000, 0]
		return [Infinity, Infinity, Infinity, Infinity]
	})

	function getDistance([x, y, dir]: Node) {
		return gridGet(distances, [x, y])[dir] as number
	}

	function setDistance([x, y, dir]: Node, distance: number) {
		let cell = gridGet(distances, [x, y])
		if (gridGet(grid, [x, y]) === 'E') {
			log('Set distance to goal', [x, y, dir], distance)
		}
		if (typeof cell === 'string') {
			fail('setDistance', [x, y, dir], distance)
		} else {
			cell[dir] = distance
		}
	}

	function isValidPos([x, y, _]: Node) {
		return gridGet(grid, [x, y]) !== '#'
	}

	let trail: Node[] = []
	let trailDistances: number[] = []

	function step(): 'continue' | number {
		log(`step(): ${unvisited.size} remaining`)
		if (unvisited.size === 0) {
			let distancesToEnd = range(4).map((dir) =>
				getDistance([goal[0], goal[1], dir as Dir])
			)
			// log('distances to end', distancesToEnd)
			let shortestDistance = Math.min(...distancesToEnd)
			// log('empty unvisited, return', shortestDistance)
			return shortestDistance
		}

		// TODO optimize this

		let nearestNode = undefined
		let nearestNodeDistance = Infinity
		for (let node of [...unvisited]) {
			if (getDistance(node) < nearestNodeDistance) {
				nearestNode = node
				nearestNodeDistance = getDistance(node)
			}
		}
		if (!nearestNode) {
			fail('oops')
		}

		// let nodesSorted = [...unvisited].sort((n1: Node, n2: Node) => {
		// 	let d1 = getDistance(n1)
		// 	let d2 = getDistance(n2)
		//
		// 	// @ts-ignore
		// 	return d1 - d2
		// })
		//
		// let nearestNode = nodesSorted[0]
		// let nearestNodeDistance = getDistance(nearestNode)

		if (nearestNodeDistance === Infinity) {
			log('TODO considering a node that is unreachable, can this happen?')
			unvisited.delete(nearestNode)
			return 'continue'
		}

		trail.push(nearestNode)
		trailDistances.push(nearestNodeDistance)

		if (gridGet(grid, [nearestNode[0], nearestNode[1]]) === 'E') {
			log('Found goal', nearestNodeDistance)
			// Not yet
			// return nearestNodeDistance
		}

		// Do magic
		let straight: Node = moveStraight(nearestNode)
		let left: Node = turnLeft(nearestNode)
		let right: Node = turnRight(nearestNode)
		// log('Considering node', printNode(nearestNode), {
		// 	straight: printNode(straight),
		// 	left: printNode(left),
		// 	right: printNode(right),
		// 	dist: nearestNodeDistance,
		// })
		if (isValidPos(straight)) {
			let currDist = getDistance(straight)
			let newDist = nearestNodeDistance + 1
			if (newDist < currDist) {
				// 	log(
				// 		'New shortest path to',
				// 		printNode(straight),
				// 		'found:',
				// 		newDist,
				// 		'(go straight)'
				// 	)
				setDistance(straight, newDist)
			}
		}
		let currDistLeft = getDistance(left)
		let newDistLeft = nearestNodeDistance + 1000
		if (newDistLeft < currDistLeft) {
			// log(
			// 	'New shortest path to',
			// 	printNode(left),
			// 	'found:',
			// 	newDistLeft,
			// 	'(turn left)'
			// )

			setDistance(left, newDistLeft)
		}

		let currDistRight = getDistance(right)
		let newDistRight = nearestNodeDistance + 1000
		// if (printNode(right) === '1,11R') {
		// 	log('1,11R', { currDistRight, newDistRight })
		// }

		if (newDistRight < currDistRight) {
			// log(
			// 	'New shortest path to',
			// 	printNode(right),
			// 	'found:',
			// 	newDistRight,
			// 	'(turn right)'
			// )

			setDistance(right, newDistRight)
		}

		gridSet(seen, [nearestNode[0], nearestNode[1]], 'X')

		unvisited.delete(nearestNode)
		// return 'stop'
		return 'continue'
	}

	// log('grid', gridPrint(grid))
	// log('dist', gridPrint(distances))
	// log('unvisited', unvisited)

	while (true) {
		let result = step()
		if (result === 'continue') {
			continue
		}

		// printTrail()
		// log('!!! RESULT', result)

		return result
	}

	function printTrail() {
		log('============')
		log('============')
		log('Trail: (length: ' + trail.length + ')')
		for (let i = 0; i < trail.length; i++) {
			let [x, y, dir] = trail[i]
			let who = 'v<^>'[dir]
			let where = [x, y] as Vec2
			log(
				'GRID:\n' + gridPrint(grid, who, where),
				'distance to point:',
				trailDistances[i]
			)
		}
		log('END TRAIL ==')
		log('============')
	}
}

assert(solve(test), 7036)
assert(solve(test2), 11048)
assert(solve(input), 111480)
