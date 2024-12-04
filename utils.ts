import fs from 'fs'

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
	return map.trim().split('\n').map((line) => line.trim().split(''))
}

export function toNumbers(line: string) {
	return line.split(/\s+/).map(Number)
}


// 3 => [0, 1, 2]
export function range(n: number) {
	return Array(n)
		.fill(0)
		.map((_, i) => i)
}

export function* coords(h: number, w: number) {
	for (let i of range(h)) {
		for (let j of range(w)) {
			yield [i, j]
		}
	}
}

export type Vec2 = [number, number]

export function plus([a, b]: Vec2, [c, d]: Vec2): Vec2 {
	return [a + c, b + d]
}

export function mul([a, b]: Vec2, x: number): Vec2 {
	return [a * x, b * x]
}

export function get(grid: string[][], [x, y]: Vec2) {
	return grid[x]?.[y] || '.'
}
