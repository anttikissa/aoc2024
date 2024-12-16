// @ts-ignore
import input from './day16.txt'
import {
	assert,
	coords,
	fail,
	gridGet,
	gridMap,
	gridPrint,
	log,
	parseVec,
	range,
	straightDirections,
	timer,
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

let test3 = `
################
#..............#
#.############.#
#E..##########.#
###..#########.#
##..##########.#
#..###########.#
#.############.#
#S.............#
################
`

let test4 = `
#################
#...#.#.#.....#.#
#.#.#.#.#.#####.#
#.#...#.#.#.....#
#.#.#####.#.###.#
#.#.#.......#...#
#...###.#####.###
#.#.#...#.....#.#
#...#.#####.###.#
#.#.#.........#.#
#.E.#.#########.#
#S#.............#
#################
`

let unreachable = `
####
##E#
#S##
####
`

let unreachable2 = `
####
##.#
####
#SE#
####
`

function solve(input: string, part: 1 | 2 = 1) {
	let grid = toGrid(input)

	let startPos = coords(grid).find((c) => gridGet(grid, c) === 'S')!
	let goalPos = coords(grid).find((c) => gridGet(grid, c) === 'E')!

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

	// TODO make priority queue later
	let queue = new ValueSet<Node>([[startPos[0], startPos[1], 3]])

	function addQueue(node: Node) {
		queue.add(node)
	}

	function popNearestKnown(): [Node, number] {
		// TODO optimize this
		let nearestNode!: Node
		let nearestNodeDistance = Infinity
		for (let node of [...queue]) {
			if (getDistance(node) < nearestNodeDistance) {
				nearestNode = node
				nearestNodeDistance = getDistance(node)
			}
		}

		queue.delete(nearestNode)

		return [nearestNode, nearestNodeDistance]
	}

	// let seen = gridMap(grid, (c) => (c === '#' ? '#' : '.'))

	// for (let [x, y] of coords(grid)) {
	// 	let tile = gridGet(grid, [x, y])
	// 	if (tile === '#') continue
	// 	for (let dir of [0, 1, 2, 3]) {
	// 		queue.add([x, y, dir as Dir])
	// 	}
	// }

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
			log('Set distance to goal', printNode([x, y, dir]), distance)
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

	// For debugging: record of all visited nodes
	let trail: Node[] = []
	let trailDistances: number[] = []

	// values are JSON.stringified nodes; whenever a shortest part is found,
	// the preceding node is recorded here
	let optimalPredecessors = new Map<string, string[]>()

	function addOptimalPredecessor(
		nodeN: Node,
		predecessorN: Node,
		wipe = false
	) {
		let node = printNode(nodeN)
		let predecessor = printNode(predecessorN)
		if (optimalPredecessors.has(node)) {
			if (wipe) {
				optimalPredecessors.set(node, [predecessor])
			} else {
				optimalPredecessors.get(node)!.push(predecessor)
			}
		} else {
			optimalPredecessors.set(node, [predecessor])
		}
	}

	let steps = 0
	let goalsFound = 0

	function finish() {
		if (part === 1) {
			// Part 1
			let distancesToEnd = range(4).map((dir) =>
				getDistance([goalPos[0], goalPos[1], dir as Dir])
			)
			return Math.min(...distancesToEnd)
		}

		if (part === 2) {
			// Part 2
			let finalNodes = range(4).map(
				(dir) => [goalPos[0], goalPos[1], dir as Dir] as Node
			)
			finalNodes.sort((n1, n2) => getDistance(n1) - getDistance(n2))
			// log('finalNodes', finalNodes.map(printNode))
			// let node = printNode(finalNodes[0])

			let seen = new Set<string>()
			let unvisited: string[] = [printNode(finalNodes[0])]
			while (unvisited.length) {
				let node = unvisited.pop()!
				seen.add(node)

				let predecessors = optimalPredecessors.get(node)!
				if (!predecessors) {
					// log('no predecessors for', node)
					continue
				}
				let idx = 0
				for (let predecessor of predecessors) {
					// log(`predecessor ${idx++} of ${node}:`, predecessor)
					unvisited.push(predecessor)
				}
			}

			let seenPositions = new ValueSet<Vec2>(
				[...seen].map((node) => parseVec(node.slice(0, -1)))
			)

			// log('Optimal paths:\n' + gridPrint(grid, 'O', seenPositions))

			return seenPositions.size
		}

		return 0
	}

	function step(): 'continue' | number {
		steps++

		// log(`step(): ${queue.size} remaining`)
		if (queue.size === 0) {
			log('Exhausted search space at step', steps)
			return finish()
		}

		let [nearestNode, nearestNodeDistance] = popNearestKnown()

		if (!nearestNode) {
			fail('oops')
		}

		if (nearestNodeDistance === Infinity) {
			fail('should not happen')
		}

		trail.push(nearestNode)
		trailDistances.push(nearestNodeDistance)

		if (gridGet(grid, [nearestNode[0], nearestNode[1]]) === 'E') {
			goalsFound++

			log('Found goal', nearestNodeDistance, 'at step', steps)

			if (goalsFound === 4) {
				log('All goals found at step', steps)
				// return finish()
			}
		}

		let straight: Node = moveStraight(nearestNode)
		let left: Node = turnLeft(nearestNode)
		let right: Node = turnRight(nearestNode)

		function add(node: Node, distance: number) {
			let previousDistance = getDistance(node)
			if (distance <= previousDistance) {
				setDistance(node, distance)
				addQueue(node, distance)
				addOptimalPredecessor(
					node,
					nearestNode,
					distance < previousDistance
				)
			}
		}

		if (isValidPos(straight)) {
			add(straight, nearestNodeDistance + 1)
		}
		add(left, nearestNodeDistance + 1000)
		add(right, nearestNodeDistance + 1000)

		// queue.delete(nearestNode)
		steps++
		return 'continue'
	}

	while (true) {
		let result = step()
		if (result === 'continue') {
			continue
		}

		// printTrail()
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

// assert(solve(unreachable), Infinity)
// assert(solve(unreachable2), 1)

// assert(solve(test4), 7036)

{
	using part1 = timer('part1')
	assert(solve(test), 7036)
	assert(solve(test2), 11048)
	assert(solve(input), 111480)
}
{
	using part2 = timer('part2')
	assert(solve(test, 2), 45)
	assert(solve(test2, 2), 64)
	assert(solve(input, 2), 529)
}

log('ok')
