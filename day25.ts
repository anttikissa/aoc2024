import input from './day25.txt' with { type: 'text' }

import {
	assert,
	coords,
	gridColumns,
	gridGet,
	gridHeight,
	gridPrint,
	log,
	range,
	timer,
	toGrid,
} from './utils'

let test = `
#####
.####
.####
.####
.#.#.
.#...
.....

#####
##.##
.#.##
...##
...#.
...#.
.....

.....
#....
#....
#...#
#.#.#
#.###
#####

.....
.....
#.#..
###..
###.#
###.#
#####

.....
.....
.....
#....
#.#..
#.#.#
#####`

function solve(input: string) {
	let datas = input.split('\n\n').map(toGrid)

	let locks = []
	let keys = []
	for (let data of datas) {
		if (gridGet(data, [0, 0]) === '#') {
			locks.push(data)
		} else {
			keys.push(data)
		}
	}

	log('locks', locks.length)
	log('keys', keys.length)

	// Problem set size: 250 x 250 so we can use any solution we like
	let solution = 'shorter'

	let result = 0

	if (solution === 'shorter') {
		function fits(key: string[][], lock: string[][]) {
			return !coords(key).some(
				(coord) =>
					gridGet(key, coord) === '#' && gridGet(lock, coord) === '#'
			)
		}

		for (let key of keys) {
			for (let lock of locks) {
				if (fits(key, lock)) {
					result++
				}
			}
		}

		return result
	} else if (solution === 'faster') {
		// The first solution I came up with
		let ls = locks.map((lock) =>
			gridColumns(lock).map((col) => col.lastIndexOf('#'))
		)

		let ks = keys.map((key) =>
			gridColumns(key).map(
				(col) => gridHeight(key) - col.indexOf('#') - 1
			)
		)

		let h = gridHeight(locks[0])
		assert(h, gridHeight(keys[0]))

		result = 0
		for (let key of ks) {
			for (let lock of ls) {
				let match = 1
				for (let i of range(key.length)) {
					if (key[i] + lock[i] >= h - 1) {
						match = 0
						break
					}
				}
				result += match
			}
		}

		return result
	}
}

assert(solve(test), 3)
{
	using perf = timer('input')
	assert(solve(input), 3365)
}
