import fs from 'fs'

export function readLines(path: string) {
	return fs.readFileSync(path, 'utf8').split('\n').filter(Boolean)
}

export function toNumbers(line: string) {
	return line.split(/\s+/).map(Number)
}

// 3 => [0, 1, 2]
export function range(n: number) {
	return Array(n).fill(0).map((_, i) => i)
}
