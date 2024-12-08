import fs from 'fs'

export function log(...args: unknown[]) {
	let result = []

	for (let arg of args) {
		if (typeof arg === 'object') {
			result.push(JSON.stringify(arg))
		} else if (typeof arg === 'string') {
			result.push(arg)
		} else if (typeof arg === 'number') {
			result.push(arg.toString())
		} else {
			result.push(String(arg))
		}
	}

	console.log(result.join(' '))
}

//
// Reading and parsing
//

export function readFile(path: string) {
	return fs.readFileSync(path, 'utf8')
}

export function readLines(path: string) {
	return fs.readFileSync(path, 'utf8').split('\n').filter(Boolean)
}

export function toLines(file: string) {
	return file.split('\n').filter(Boolean)
}

export function toGrid(map: string) {
	return map
		.trim()
		.split('\n')
		.map((line) => line.trim().split(''))
}

export function toNumbers(line: string) {
	return line.split(/\s+/).map(Number)
}

//
// Iterating and generating
//

// range(3) => [0, 1, 2] ("range of 3 elements")
// range(1, 3) => [1, 2, 3] ("range of 1 to 4 inclusive")

export function range(min: number, max: number): number[]
export function range(n: number): number[]
export function range(n: number, max?: number) {
	if (typeof max === 'undefined') {
		return Array(n)
			.fill(0)
			.map((_, i) => i)
	} else {
		let min = n
		return Array(max - min + 1)
			.fill(0)
			.map((_, i) => i + min)
	}
}

// pairs([1, 2, 3]) =>
//   [[1, 2], [1, 3], [1, 4],
//            [2, 3], [2, 4],
//                    [3, 4]]

export function pairs<T>(arr: T[]) {
	let result = []
	for (let i = 0; i < arr.length; i++) {
		for (let j = i + 1; j < arr.length; j++) {
			result.push([arr[i], arr[j]])
		}
	}
	return result
}

//
// Vectors, directions, grids
//

export type Vec2 = [number, number]

export const straightDirections: Vec2[] = [
	[0, 1],
	[-1, 0],
	[0, -1],
	[1, 0],
]

export const diagonalDirections: Vec2[] = [
	[1, 1],
	[1, -1],
	[-1, -1],
	[-1, 1],
]

export const directions: Vec2[] = [...straightDirections, ...diagonalDirections]

export function coords(grid: unknown[][]): Generator<Vec2, void, unknown>
export function coords(h: number, w: number): Generator<Vec2, void, unknown>

export function* coords(hOrGrid: number | unknown[][], w?: number) {
	if (typeof hOrGrid !== 'number') {
		w = hOrGrid[0]?.length ?? 0
		hOrGrid = hOrGrid.length
	}
	if (w == null) {
		throw new Error('missing w')
	}

	for (let i of range(hOrGrid)) {
		for (let j of range(w)) {
			yield [j, i]
		}
	}
}

export function addVec([a, b]: Vec2, [c, d]: Vec2): Vec2 {
	return [a + c, b + d]
}

export function subVec([a, b]: Vec2, [c, d]: Vec2): Vec2 {
	return [a - c, b - d]
}

export function mulVec([a, b]: Vec2, x: number): Vec2 {
	return [a * x, b * x]
}

export function gridGet(grid: string[][], [x, y]: Vec2) {
	return grid[y]?.[x] || '.'
}

export function gridSet(grid: string[][], [x, y]: Vec2, value: string) {
	grid[y][x] = value
}

export function gridIsWithin([y, x]: Vec2, grid: string[][]) {
	return y >= 0 && y < grid.length && x >= 0 && x < grid[0].length
}
