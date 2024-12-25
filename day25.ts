import input from './day25.txt' with { type: 'text' }

import {
	assert,
	gridColumns,
	gridGet,
	gridHeight,
	gridPrint,
	log,
	range,
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

	let ls = locks.map((lock) =>
		gridColumns(lock).map((col) => col.lastIndexOf('#'))
	)

	let ks = keys.map((key) =>
		gridColumns(key).map((col) => gridHeight(key) - col.indexOf('#') - 1)
	)

	let h = gridHeight(locks[0])
	assert(h, gridHeight(keys[0]))

	log('ls', ls.length)
	log('ks', ks.length)

	let result = 0
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
			// if (match) {
			// 	log('match, key', key)
			// 	log('lock', lock)
			// }
		}
	}

	return result
}

assert(solve(test), 3)
assert(solve(input), 3365)
