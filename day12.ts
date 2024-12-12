// @ts-ignore
import file from './day12.txt' with { type: 'text' }
import {
	addVec,
	coords,
	diagonalDirections,
	gridGet,
	gridPrint,
	log,
	mulVec,
	parseVec,
	straightDirections,
	sum,
	toGrid,
	type Vec2,
} from './utils'

let input = file

let test = `AAAA
BBCD
BBCC
EEEC
`

test = `OOOOO
OXOXO
OOOOO
OXOXO
OOOOO`

// input = test

let grid = toGrid(input)

log('grid', '\n' + gridPrint(grid))

let remaining = new Set([...coords(grid)].map((c) => String(c)))

type Region = {
	color: string
	coords: Vec2[]
}

let regions: Region[] = []
while (remaining.size) {
	let first = [...remaining][0]
	let color = gridGet(grid, parseVec(first))
	let coords = traverse(parseVec(first))
	// log('group', gridGet(grid, parseVec(first)), coords)
	for (let g of coords) {
		remaining.delete(g)
	}

	regions.push({ color, coords: [...coords].map(parseVec) })
}

function traverse(start: Vec2) {
	let set = new Set<string>([String(start)])

	let newNeighbors = new Set<string>([String(start)])

	while (newNeighbors.size) {
		let firstNeighbor = [...newNeighbors][0]

		let pos = parseVec(firstNeighbor)
		newNeighbors.delete(firstNeighbor)
		let color = gridGet(grid, pos)
		let neighbors = straightDirections.map((dir) => addVec(pos, dir))
		let validNeighbors = neighbors.filter(
			(pos) => gridGet(grid, pos) === color
		)
		for (let neighbor of validNeighbors) {
			let neighborStr = String(neighbor)
			if (!set.has(neighborStr)) {
				newNeighbors.add(neighborStr)
				set.add(neighborStr)
			}
		}
	}

	return set
}

function area(region: Region) {
	return region.coords.length
}

function perimeter(region: Region) {
	let borders = region.coords.map((coord) => {
		let result = 0
		for (let dir of straightDirections) {
			let pos = addVec(coord, dir)
			if (gridGet(grid, pos) !== region.color) {
				result++
			}
		}
		return result
	})

	// log('borders', region.color, borders)

	return sum(borders)
}

function sides(region: Region) {
	let color = region.color

	let perim = perimeter(region)
	let straightness = 0

	for (let coord of region.coords) {
		let diagonalPoints: Vec2[] = diagonalDirections.map((dir) =>
			addVec(coord, mulVec(dir, 0.5))
		)
		for (let diagPoint of diagonalPoints) {
			let adjacentCoords = diagonalDirections.map((dir) =>
				addVec(diagPoint, mulVec(dir, 0.5))
			)

			let outsides = adjacentCoords
				.map((pos) => (gridGet(grid, pos) !== color ? 1 : 0))
				.join('')
			if (
				outsides === '1100' ||
				outsides === '0110' ||
				outsides === '0011' ||
				outsides === '1001'
			) {
				straightness += 0.5
			}
		}
	}

	return perim - straightness
}

let part1 = 0

for (let region of regions) {
	part1 += area(region) * perimeter(region)
}

log('part1', part1)

let part2 = 0
for (let region of regions) {
	// log('area', region.color, region.coords, 'sides', sides(region))

	part2 += area(region) * sides(region)
}

log('part2', part2)
