// @ts-ignore
import input from './day12.txt' with { type: 'text' }
import {
	adjacents,
	areaBounds,
	assert,
	coords,
	gridFloodFill,
	gridGet,
	gridNeighbors,
	isDiagonalNeighbor,
	log,
	product,
	range,
	sum,
	timer,
	toGrid,
	ValueSet,
	type Vec2,
} from './utils'

let test1 = `
AAAA
BBCD
BBCC
EEEC
`

let test2 = `
OOOOO
OXOXO
OOOOO
OXOXO
OOOOO`

type Region = {
	plant: string
	coords: ValueSet<Vec2>
}

function findRegions(grid: string[][]) {
	let regions: Region[] = []
	let remaining = new ValueSet(coords(grid))
	while (remaining.size) {
		let first = remaining.first()
		let plant = gridGet(grid, first)
		let coords = gridFloodFill(grid, first)

		regions.push({ plant, coords })
		remaining.deleteAll(coords)
	}
	return regions
}

function area(region: ValueSet<Vec2>) {
	return region.size
}

function perimeter(region: ValueSet<Vec2>) {
	let result = 0
	for (let coord of region) {
		for (let neighbor of gridNeighbors(coord)) {
			if (!region.has(neighbor)) {
				result++
			}
		}
	}
	return result
}

function sides(region: ValueSet<Vec2>) {
	let corners = 0

	let bounds = areaBounds(region)
	let xRange = range(bounds.min[0] - 1, bounds.max[0] + 1)
	let yRange = range(bounds.min[1] - 1, bounds.max[1] + 1)

	// Iterate over every 2x2 block overlapping the grid
	for (let xs of adjacents(xRange)) {
		for (let ys of adjacents(yRange)) {
			let twoByTwoBlock = [...product(xs, ys)] as Vec2[]
			let insideBlocks = twoByTwoBlock.filter((pos) => region.has(pos))

			if (insideBlocks.length === 1 || insideBlocks.length === 3) {
				corners++
			} else if (
				insideBlocks.length === 2 &&
				isDiagonalNeighbor(insideBlocks[0], insideBlocks[1])
			) {
				corners += 2
			}
		}
	}
	return corners
}

function solve(input: string, part: 1 | 2) {
	let grid = toGrid(input)
	let regions = findRegions(grid)

	let costFunctions = {
		1: (region: Region) => area(region.coords) * perimeter(region.coords),
		2: (region: Region) => area(region.coords) * sides(region.coords),
	}

	return sum(regions.map(costFunctions[part]!))
}

{
	using part1 = timer('part1')

	assert(solve(test1, 1), 140)
	assert(solve(input, 1), 1522850)
}

{
	using part2 = timer('part2')

	assert(solve(test1, 2), 80)
	assert(solve(input, 2), 953738)
}

log('ok')
