import fs from 'fs'

//
// Logging, debugging & testing
//

export function log(...args: unknown[]) {
	let t = new Date().toISOString().replace('T', ' ').replace('Z', '')
	let result: string[] = []

	function print(arg: unknown) {
		let str = ''
		if (typeof arg === 'object') {
			if (arg instanceof Set) {
				let contents = print([...arg])
				str = `new Set(${contents})`
			} else if (arg instanceof Map) {
				str = 'new Map("TODO")'
			} else if (arg instanceof Error) {
				str = '[ERROR] ' + arg.message
			} else {
				str = JSON.stringify(arg)
			}
		} else if (typeof arg === 'string') {
			str = arg
		} else if (typeof arg === 'number') {
			str = arg.toString()
		} else {
			str = String(arg)
		}
		return str
	}

	for (let arg of args) {
		result.push(print(arg))
	}

	console.log(t, result.join(' '))
}

export function fail(...whatever: unknown[]): never {
	log('fail:', ...whatever)
	throw new Error('error')
}

export function assert(truthy: unknown): void
export function assert(a: unknown, b: unknown): void
export function assert(a: unknown, b?: unknown) {
	if (b === undefined) {
		if (!a) {
			throw new Error(`expected ${a} to be truthy`)
		}
	} else if (a !== b) {
		throw new Error(`expected ${a} to equal ${b}`)
	}
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

// [1,2,3] => [[1,2], [2,3]]
export function adjacents(arr: number[]) {
	return range(arr.length - 1).map((i) => [arr[i], arr[i + 1]])
}

// Cartesian product
// product([1,2], ['x', 'y']) => [[1, 'x'], [1, 'y'], [2, 'x'], [2, 'y']]
export function* product<T, U>(a: Iterable<T>, b: Iterable<U>) {
	for (let x of a) {
		for (let y of b) {
			yield [x, y]
		}
	}
}

//
// Vectors, directions, grids
//

export type Vec2 = [x: number, y: number]

// Opposite of String(vec)
export function parseVec(vec: string): Vec2 {
	let result = vec.split(',').map(Number)
	if (result.length !== 2) {
		throw new Error('invalid vec')
	}
	return result as Vec2
}

export const DOWN = [0, 1] as Vec2
export const LEFT = [-1, 0] as Vec2
export const UP = [0, -1] as Vec2
export const RIGHT = [1, 0] as Vec2

export const straightDirections: Vec2[] = [DOWN, LEFT, UP, RIGHT]

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
	for (let y of range(hOrGrid)) {
		for (let x of range(w)) {
			yield [x, y]
		}
	}
}

// [ x1, x2 ]
// [ y1, y2 ]
export type Mtx2 = [x: Vec2, y: Vec2]

export function mtxMul(mtx: Mtx2, vec: Vec2): Vec2 {
	let [[a, b], [c, d]] = mtx
	let [x, y] = vec
	return [a * x + b * y, c * x + d * y]
}

// Calculate determinant
function mtxDet(mtx: [x: [x: number, y: number], y: [x: number, y: number]]) {
	return mtx[0][0] * mtx[1][1] - mtx[0][1] * mtx[1][0]
}

export function mtxInvertible(mtx: Mtx2): boolean {
	return mtxDet(mtx) !== 0
}

export function mtxInvert(mtx: Mtx2): Mtx2 {
	let [[a, b], [c, d]] = mtx
	let det = mtxDet(mtx)
	return [
		[d / det, -b / det],
		[-c / det, a / det],
	]
}

// Because floating point math is hard
export function integerEnough(n: number, tolerance = 1e-4) {
	return Math.abs(n - Math.round(n)) < tolerance
}

export function vecAdd([a, b]: Vec2, [c, d]: Vec2): Vec2 {
	return [a + c, b + d]
}

export function vecSub([a, b]: Vec2, [c, d]: Vec2): Vec2 {
	return [a - c, b - d]
}

export function vecMul([a, b]: Vec2, x: number): Vec2 {
	return [a * x, b * x]
}

export function gridGet<T>(grid: T[][], [x, y]: Vec2) {
	return grid[y]?.[x] || '.'
}

export function gridMap<T, U>(grid: T[][], fn: (value: T) => U) {
	let result = []
	for (let row of grid) {
		let newRow = Array(row.length)
		for (let i = 0; i < row.length; i++) {
			newRow[i] = fn(row[i])
		}
		result.push(newRow)
	}
	return result
}

export function gridSet(grid: string[][], [x, y]: Vec2, value: string) {
	if (!gridIsWithin([x, y], grid)) {
		log('gridSet outside', [x, y])
		return
	}
	grid[y][x] = value
}

export function gridNeighbors(pos: Vec2) {
	return straightDirections.map((dir) => vecAdd(pos, dir))
}

export function isDiagonalNeighbor(a: Vec2, b: Vec2) {
	let [dx, dy] = vecSub(a, b)
	return Math.abs(dx) === 1 && Math.abs(dy) === 1
}

export function gridWidth(grid: string[][]) {
	return grid[0].length
}

export function gridHeight(grid: string[][]) {
	return grid.length
}

export function gridIsWithin([x, y]: Vec2, grid: string[][]) {
	return y >= 0 && y < grid.length && x >= 0 && x < grid[0].length
}

export function areaBounds(area: ValueSet<Vec2>) {
	let min = [Infinity, Infinity]
	let max = [-Infinity, -Infinity]

	for (let pos of area) {
		min[0] = Math.min(min[0], pos[0])
		min[1] = Math.min(min[1], pos[1])
		max[0] = Math.max(max[0], pos[0])
		max[1] = Math.max(max[1], pos[1])
	}
	return { min, max }
}

export function gridPrint<T>(grid: T[][], who?: string, where?: Vec2) {
	let prev = '.'

	let y, x
	if (who && where) {
		;[x, y] = where
		prev = gridGet(grid, where)
		gridSet(grid, where, who)
	}
	let result = grid.map((row) => row.join('')).join('\n')
	if (who && where) {
		gridSet(grid, where, prev)
	}

	return result
}

export function gridFloodFill(
	grid: string[][],
	start: Vec2,
	color = gridGet(grid, start),
	visited = new ValueSet()
): ValueSet<Vec2> {
	visited.add(start)
	for (let neighbor of gridNeighbors(start)) {
		if (gridGet(grid, neighbor) === color && !visited.has(neighbor)) {
			gridFloodFill(grid, neighbor, color, visited)
		}
	}

	return visited
}

//
// Set stuff
//
export function uniqueCount(arr: unknown[]) {
	return new Set(arr).size
}

// Like Set, but for types where deep equality is desired instead of reference
// equality
//
// Not all methods of Set<> implemented, add as needed
//
// let v = new ValueSet()
// v.add([1,2])
// assert(v.has([1,2]))
export class ValueSet<T> {
	set = new Set<string>()
	unparse = (value: T) => JSON.stringify(value)
	parse = (str: string) => JSON.parse(str)

	constructor(values?: Iterable<T>) {
		if (values !== undefined) {
			// @ts-ignore go home TS
			this.set = new Set<string>(values.map(this.unparse))
		} else {
			this.set = new Set<string>()
		}
	}

	has(value: T) {
		return this.set.has(this.unparse(value))
	}

	add(value: T) {
		return this.set.add(this.unparse(value))
	}

	delete(value: T) {
		return this.set.delete(this.unparse(value))
	}

	// Custom
	deleteAll(values: Iterable<T>) {
		for (let value of values) {
			this.delete(value)
		}
	}

	get size() {
		return this.set.size
	}

	*values() {
		for (let val of this.set.values()) {
			yield this.parse(val)
		}
	}

	[Symbol.iterator]() {
		return this.values()
	}

	// Custom; pick one element from the set
	// O(n)
	first() {
		assert(this.size > 0)
		return this.parse([...this.set.values()][0])
	}

	difference(other: ValueSet<T>) {
		let result = new ValueSet()
		result.set = this.set.difference(other.set)
		return result
	}

	// Helps with logging
	toJSON() {
		return [...this.values()]
	}
}

//
// Misc math
//

export function sum(numbers: number[]) {
	return numbers.reduce((a, b) => a + b, 0)
}

//
// Caching
//

export function cache<T>(fn: (...args: any[]) => T): (...args: any[]) => T {
	let cache = new Map<string, any>()
	return (...args: any[]): T => {
		let key = JSON.stringify(args)
		if (cache.has(key)) {
			return cache.get(key)
		}
		let result = fn(...args)
		cache.set(key, result)
		return result
	}
}

//
// Performance
//

// Usage:
//
// using t = timer('name')
//
// Alternatively,
//
// timer.start('name')
// ... code ...
// timer.end('name')
//
export function timer(what: string) {
	return timer.timer(what)
}

timer.startTimes = new Map<string, number>()

timer.start = function (what: string) {
	this.startTimes.set(what, Date.now())
}

timer.end = function (what: string) {
	let start = this.startTimes.get(what)
	if (!start) {
		throw new Error(`forgot to call perf.start('${what}')?`)
	}
	let elapsed = Date.now() - start
	log(`[perf] ${what}: ${elapsed} ms`)
}

timer.timer = function (what: string) {
	this.start(what)
	return {
		[Symbol.dispose]: () => this.end(what),
	}
}

//
// Web stuff
//

// Function that does nothing, call this to avoid tree-shaking
export function include(...args: unknown[]) {}

export function $(selector: string) {
	return document.querySelector(selector)
}
