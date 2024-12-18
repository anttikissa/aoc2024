// @ts-ignore
import input from './day18.txt'
import {
	assert,
	fail,
	gridCreate,
	gridGet,
	gridIsWithin,
	gridPrint,
	gridSet,
	log,
	straightDirections,
	timer,
	toLines,
	type Vec2,
	vecAdd,
} from './utils'

let test = `
5,4
4,2
4,5
3,0
2,1
6,3
2,4
1,5
0,6
3,3
2,6
5,1
1,2
5,5
2,5
6,5
1,4
0,4
6,4
1,1
6,1
1,0
0,5
1,6
2,0
`

function dijkstra(
	initial: Vec2,
	distance: (pos: Vec2) => number,
	transitions: (pos: Vec2) => { pos: Vec2; cost: number }[],
	updateDistance: (pos: Vec2, cost: number) => void,
	isEndNode: (pos: Vec2) => boolean
) {
	let unvisited = new Set<Vec2>([initial])

	function pop() {
		let sorted = [...unvisited].sort((a, b) => distance(a) - distance(b))
		unvisited.delete(sorted[0])
		return sorted[0]
	}

	while (unvisited.size) {
		let nearest = pop()
		let nearestDistance = distance(nearest)

		// log('visit', nearest, 'dist', nearestDistance)

		if (isEndNode(nearest)) {
			return nearestDistance
		}

		for (let transition of transitions(nearest)) {
			let { pos, cost } = transition
			let newDistance = nearestDistance + cost
			if (newDistance < distance(pos)) {
				updateDistance(pos, newDistance)
				unvisited.add(pos)
			}
		}
	}

	return Infinity
}

function solve(input: string, size: number, cut?: number, part: 1 | 2 = 1) {
	let lines = toLines(input)
	let pairs = lines.map((line) => line.split(',').map(Number) as Vec2)

	let grid!: string[][]
	let distances!: number[][]
	let startPos = [0, 0] as Vec2

	function initialize(bytes: number) {
		grid = gridCreate(size, size, '.')
		distances = gridCreate(size, size, Infinity)
		gridSet(distances, startPos, 0)

		let idx = 0
		for (let coord of pairs) {
			if (idx++ < bytes) {
				gridSet(grid, coord, '#')
			}
		}
	}

	function getDistance(pos: Vec2) {
		let result = gridGet(distances, pos)
		if (typeof result === 'string') return Infinity
		return result
	}

	function updateDistance(pos: Vec2, cost: number) {
		gridSet(distances, pos, cost)
	}

	function transitions(pos: Vec2) {
		let neighbors = straightDirections.map((dir) => vecAdd(pos, dir))
		return neighbors
			.filter((pos) => {
				return gridIsWithin(pos, grid) && gridGet(grid, pos) !== '#'
			})
			.map((pos) => ({ pos, cost: 1 }))
	}

	function isEndNode(pos: Vec2) {
		return pos[0] === size - 1 && pos[1] === size - 1
	}

	if (part === 1) {
		if (cut === undefined) fail()

		initialize(cut)

		return dijkstra(
			startPos,
			getDistance,
			transitions,
			updateDistance,
			isEndNode
		)
	}
	if (part === 2) {
		for (let i = 0; i < pairs.length; i++) {
			if (i % 100 === 0) log('progress', i, 'of', pairs.length)

			initialize(i)

			let result = dijkstra(
				startPos,
				getDistance,
				transitions,
				updateDistance,
				isEndNode
			)

			if (result === Infinity) {
				let lastPair = pairs[i - 1]
				log(`cut ${lastPair} made unreachable`)
				return lastPair.join(',')
			}
		}
		return null
	}
}

assert(solve(test, 7, 12), 22)

{
	using part1 = timer('part1')
	assert(solve(input, 71, 1024), 356)
}

assert(solve(test, 7, undefined, 2), '6,1')

{
	using part2 = timer('part2')
	assert(solve(input, 71, undefined, 2), 'xxx')
}

// log('Infin', [Infinity])
