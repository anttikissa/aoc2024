// @ts-ignore
import input from './day20.txt'

import {
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

	while (unvisited.length) {
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
				unvisited.push(pos)
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
	assert(maxHop === 2)

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
	let cheatStart = { pos: start, cheatUsed: false, cheatLeft: 2 }

	// Transitions: (cheatUsed: false || cheatLeft: 0), pos -> pos to valid position, cost: 1
	// Transitions: (cheatUsed: true && cheatLeft > 0), pos -> pos to any position, cheatLeft--, cost: 1
	// Transitions: cheatUsed: false -> cheatUsed: true, cost: 0
	type Node = { pos: Vec2; cheatUsed: boolean; cheatLeft: number }
	let cheatDistances: Map<string, number>

	function cheatGetDistance(node: Node) {
		return cheatDistances.get(JSON.stringify(node)) ?? Infinity
	}

	function cheatUpdateDistance(node: Node, distance: number) {
		cheatDistances.set(JSON.stringify(node), distance)
	}

	let bannedNodes = new ValueSet<Node>()

	function neighbors(pos: Vec2, maxHop: number) {
		let result = []
		for (let i = -maxHop; i <= maxHop; ++i) {
			for (let j = -maxHop; j <= maxHop; ++j) {
				if (i === 0 && j === 0) {
					continue
				}
				if (Math.abs(i) + Math.abs(j) <= maxHop) {
					let neighbor = vecAdd(pos, [i, j])
					if (gridIsWithin(neighbor, grid)) {
						if (gridGet(grid, neighbor) !== '#') {
							result.push(neighbor)
						}
					}
				}
			}
		}
		return result
	}

	log('neighbors', neighbors([5, 5], 4))

	function cheatTransitions(node: Node): { pos: Node; cost: number }[] {
		let result: { pos: Node; cost: number }[] = []
		let cheatActivated = false

		if (node.cheatUsed && node.cheatLeft > 0) {
			cheatActivated = true
		}
		let neighbors = straightDirections.map((dir) => vecAdd(node.pos, dir))
		for (let neighbor of neighbors) {
			if (gridIsWithin(neighbor, grid)) {
				// Using cheat; in this case, we must use the cheat
				// First step (cheatLeft: 2), we can move through a wall
				if (cheatActivated && node.cheatLeft == 2) {
					let newNode: Node = {
						...node,
						pos: neighbor,
						cheatLeft: node.cheatLeft - 1,
					}
					if (!bannedNodes.has(newNode)) {
						result.push({ pos: newNode, cost: 1 })
					}
				} else {
					// Not using cheat; normal moves
					if (gridGet(grid, neighbor) !== '#') {
						let cheatLeft = node.cheatLeft
						if (cheatActivated && node.cheatLeft === 1) {
							// Second move of cheating is normal but uses up the cheat
							cheatLeft = 0
						}
						let newNode = {
							...node,
							cheatLeft,
							pos: neighbor,
						}
						result.push({ pos: newNode, cost: 1 })
					}
				}
			}
		}
		// Not using cheat; activate cheat
		if (!node.cheatUsed) {
			assert(node.cheatLeft === 2)
			let newNode = { ...node, cheatUsed: true }
			// Not sure if these can be ever banned but anyway
			result.push({
				pos: newNode,
				cost: 0,
			})
		}

		return result
	}

	// Any end node with matching pos is good
	function cheatIsEndNode(node: Node) {
		return gridGet(grid, node.pos) === 'E'
	}

	log('baseline', baseline)
	let cheatSolutions = 0
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
			if (nextParsed.cheatLeft === 1) {
				// log('Banning', nextParsed)
				bannedNodes.add(nextParsed)
			}

			assert(node.length === 1)

			let previousNode = node[0]
			path.push(previousNode)

			nextNode = previousNode

			if (nextNode === undefined) {
				break
			}
		}

		// let positions = path.map((n) => JSON.parse(n)).map((node) => node.pos)
		// log('path', positions.reverse())
		// log('cheat solution:\n' + gridPrint(grid, 'O', positions))

		let save = baseline - fastestWithCheat
		log(`cheat solution took ${fastestWithCheat} moves, saves`, save)

		if (save < mustSaveAtLeast) {
			break
		}
		cheatSolutions++
		if (cheatSolutions % 10 === 0) {
			log(`Found ${cheatSolutions} solutions`)
		}
	}

	return cheatSolutions
}

{
	// Original: 100 ms
	using perf = timer('test')
	assert(solve(test, 2, 1), 44)
}

// assert(solve(input, 100), 1263)
