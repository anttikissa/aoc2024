// @ts-ignore
import input from './day20.txt'

import {
	adjacents,
	assert,
	coords,
	fail,
	gridGet,
	gridIsWithin,
	gridMap,
	gridPrint,
	gridSet,
	log,
	straightDirections,
	timer,
	toGrid,
	ValueSet,
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

function dijkstra<Node>(
	initial: Node,
	distance: (pos: Node) => number,
	transitions: (pos: Node) => { pos: Node; cost: number }[],
	updateDistance: (pos: Node, cost: number) => void,
	isEndNode: (pos: Node) => boolean,
	// values are JSON.stringified nodes; whenever a shortest part is found,
	// the preceding node is recorded here
	optimalPredecessors?: Map<string, string[]>
) {
	let unvisited = [initial]
	let queuePos = 0

	// let unvisited = new Set<Node>([initial])

	function hasMore() {
		return queuePos < unvisited.length
	}

	function pop(): Node {
		if (queuePos >= unvisited.length) {
			fail('popped too much')
		}
		return unvisited[queuePos++]

		// return unvisited.shift()!
		// let sorted = [...unvisited].sort((a, b) => distance(a) - distance(b))
		// unvisited.delete(sorted[0])
		// return sorted[0]
	}

	function enqueue(node: Node) {
		// let dist = distance(node)
		// let allDistances = unvisited.map(distance)

		unvisited.push(node)
		// Keep the array in order
		if (unvisited.length >= 2) {
			let previous = unvisited[unvisited.length - 2]
			if (distance(node) < distance(previous)) {
				unvisited.sort((a, b) => distance(a) - distance(b))
			}
		}

		// let isOrdered = adjacents(unvisited).every(
		// 	([a, b]) => distance(a) <= distance(b)
		// )
		// if (!isOrdered) {
		// 	log('unvisited is not ordered', unvisited)
		// 	log('unvisited is not ordered', unvisited.map(distance))
		// 	fail('^^')
		// }
	}

	function addOptimalPredecessor(
		nodeN: Node,
		predecessorN: Node,
		wipe = false
	) {
		if (optimalPredecessors === undefined) {
			return
		}
		let node = JSON.stringify(nodeN)
		let predecessor = JSON.stringify(predecessorN)
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

	while (hasMore()) {
		let nearest = pop()
		let nearestDistance = distance(nearest)

		// log('visit', nearest, 'dist', nearestDistance)

		if (isEndNode(nearest)) {
			return nearestDistance
		}

		for (let transition of transitions(nearest)) {
			let { pos, cost } = transition
			let newDistance = nearestDistance + cost
			let previousDistance = distance(pos)
			// We only need one solution
			if (newDistance < previousDistance) {
				// if (newDistance <= previousDistance) {
				updateDistance(pos, newDistance)
				enqueue(pos)
				addOptimalPredecessor(
					pos,
					nearest,
					newDistance < previousDistance
				)
			}
		}
	}

	return Infinity
}

// TODO allow doing `maxHop` moves without wall checks once during the solution
function solve(input: string, maxHop: number, mustSaveAtLeast: number) {
	let grid = toGrid(input)

	let start = coords(grid).find((c) => gridGet(grid, c) === 'S')!
	// let end = coords(grid).find((c) => gridGet(grid, c) === 'E')!

	// log('print\n' + gridPrint(grid), start, end)

	let distances = gridMap(grid, (val) => (val === 'S' ? 0 : Infinity))

	function transitions(pos: Vec2) {
		let result = []
		let neighbors = straightDirections.map((dir) => vecAdd(pos, dir))
		for (let neighbor of neighbors) {
			if (gridIsWithin(neighbor, grid)) {
				if (gridGet(grid, neighbor) !== '#') {
					result.push({ pos: neighbor, cost: 1 })
				}
			}
		}
		return result
	}

	let baseline = dijkstra(
		start,
		(pos) => gridGet(distances, pos),
		transitions,
		(pos, cost) => gridSet(distances, pos, cost),
		(pos) => gridGet(grid, pos) === 'E'
	)

	// Start node:
	let cheatStart = { pos: start, cheatUsed: false }

	type Node = { pos: Vec2; cheatUsed: boolean }
	let cheatDistances: Map<string, number>

	function cheatGetDistance(node: Node) {
		return cheatDistances.get(JSON.stringify(node)) ?? Infinity
	}

	function cheatUpdateDistance(node: Node, distance: number) {
		cheatDistances.set(JSON.stringify(node), distance)
	}

	let bannedHops = new Set<number>()

	// function encodeHop(a, b) {
	// 	return JSON.stringify([a, b])
	// }

	// Words for grids smaller than 256 x 256
	function encodeHop([a, b]: Vec2, [c, d]: Vec2) {
		if (a < 0 || a >= 256 || b < 0 || b >= 256) {
			fail('cannot encode', { a, b, c, d })
		}
		return a * 256 ** 3 + b * 256 ** 2 + c * 256 + d
	}

	function neighbors(pos: Vec2, maxHop: number) {
		let result = []
		for (let i = -maxHop; i <= maxHop; ++i) {
			for (let j = -maxHop; j <= maxHop; ++j) {
				if (i === 0 && j === 0) {
					continue
				}
				let cost = Math.abs(i) + Math.abs(j)
				if (cost <= maxHop) {
					let neighbor = vecAdd(pos, [i, j])

					if (gridIsWithin(neighbor, grid)) {
						if (gridGet(grid, neighbor) !== '#') {
							let encodedHop = encodeHop(pos, neighbor)
							if (!bannedHops.has(encodedHop)) {
								result.push({ pos: neighbor, cost })
							}
						}
					}
				}
			}
		}
		return result
	}

	// log('neighbors', neighbors([2, 1], 4))

	// Transitions: (cheatUsed: false) -> pos to any pos in neighbors(maxHop), cheatUsed: true, cost: cost(hops),
	// Transitions: (cheatUsed: true) -> pos to any pos in neighbors(1), cost: 1
	function cheatTransitions(node: Node): { pos: Node; cost: number }[] {
		let result: { pos: Node; cost: number }[] = []
		// let cheatActivated = false

		// if (node.cheatUsed && node.cheatLeft > 0) {
		// 	cheatActivated = true
		// }
		// Normal case; move to any adjacent available spot
		for (let neighbor of neighbors(node.pos, 1)) {
			let newNode: Node = {
				...node,
				pos: neighbor.pos,
			}
			assert(neighbor.cost === 1)
			result.push({ pos: newNode, cost: 1 })
		}

		if (!node.cheatUsed) {
			// Or, if we haven't cheated, we can hop to a neighbor at most maxHop away
			for (let neighbor of neighbors(node.pos, maxHop)) {
				let newNode: Node = {
					...node,
					pos: neighbor.pos,
					cheatUsed: true,
				}
				result.push({ pos: newNode, cost: neighbor.cost })
			}
		}

		return result
	}

	// Any end node with matching pos is good
	function cheatIsEndNode(node: Node) {
		return gridGet(grid, node.pos) === 'E'
	}

	log('baseline', baseline)

	let saves = {}

	let cheatSolutions = 0
	let allSolutions = []

	while (true) {
		let optimalPredecessors = new Map<string, string[]>()

		cheatDistances = new Map<string, number>()
		cheatDistances.set(JSON.stringify(cheatStart), 0)

		// log('\nAttemping cheat solution, banned:', bannedNodes)
		let fastestWithCheat = dijkstra(
			cheatStart,
			cheatGetDistance,
			cheatTransitions,
			cheatUpdateDistance,
			cheatIsEndNode,
			optimalPredecessors
		)

		if (fastestWithCheat === Infinity) {
			log('INFINITY REACHED')
			log('All solutions so far', allSolutions)
			log('bannedHops', bannedHops)
			// log('cheatDistances', cheatDistances)
		}
		// log('fastest with cheats', fastestWithCheat)
		// log('fastest with cheats', optimalPredecessors)

		// Walk back from the end node
		let nextNode: string = [...optimalPredecessors.keys()].find((node) => {
			return gridGet(grid, JSON.parse(node).pos) === 'E'
		})!

		let path = [nextNode]

		// Ban the node where cheatLeft became 1
		// (no time to explain)
		while (true) {
			let node = optimalPredecessors.get(nextNode)!
			if (!node) {
				break
			}

			let nextParsed = JSON.parse(nextNode)

			assert(node.length === 1)

			let previousNode = node[0]
			path.push(previousNode)

			let previousParsed = JSON.parse(previousNode)
			if (nextParsed.cheatUsed && !previousParsed.cheatUsed) {
				bannedHops.add(encodeHop(previousParsed.pos, nextParsed.pos))
			}

			nextNode = previousNode

			if (nextNode === undefined) {
				break
			}
		}

		// let positions = path.map((n) => JSON.parse(n)).map((node) => node.pos)
		// log('path', positions.reverse())
		// log('cheat solution:\n' + gridPrint(grid, 'O', positions))

		// log('baseline is still', baseline)
		let save = baseline - fastestWithCheat
		// log(`cheat solution took ${fastestWithCheat} moves, saves`, save)

		if (save < mustSaveAtLeast) {
			log(
				`No more solutions, save ${save}, must save at least ${mustSaveAtLeast}`
			)
			break
		}

		// @ts-ignore debugging
		saves[save] = (saves[save] ?? 0) + 1
		cheatSolutions++
		allSolutions.push(fastestWithCheat)
		if (cheatSolutions % 10 === 0) {
			log(`Found ${cheatSolutions} solutions`)
		}
	}
	let savesKeys = Object.keys(saves)
		.map(Number)
		.sort((a, b) => a - b)

	log(
		'saves',
		'\n' +
			savesKeys
				.map(
					(key) =>
						`There are ${saves[key]} cheats that save ${key} picoseconds.`
				)
				.join('\n')
	)

	return cheatSolutions
}

{
	// Original: 100 ms
	// Shaved down to 40 ms
	// using perf = timer('test')
	// assert(solve(test, 2, 1), 44)
}

{
	// 1.4 s
	// using perf = timer('test with maxHop 20')
	// assert(solve(test, 20, 50), 285)
}

// Takes a long time
// assert(solve(input, 2, 100), 1263)

assert(solve(input, 20, 100), 10000)
