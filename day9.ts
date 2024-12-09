import { log, readFile } from './utils.ts'

let file = readFile('day9.txt')

// file = `2333133121414131402`

let input = file.trim().split('')

log('input', input.join(''))

let fs: (number | '.')[]
let id = 0

function createFs() {
	id = 0
	let result: (number | '.')[] = []

	for (let i = 0; i < input.length; i += 2) {
		let len = Number(input[i])
		let gap = Number(input[i + 1])
		while (len--) {
			result.push(id)
		}
		while (gap--) {
			result.push('.')
		}

		id++
		if (typeof gap === 'undefined') {
			log('undefined', i)
		}
	}
	return result
}

fs = createFs()

log('fs', fs.join(''))

// compact
let pos = 0
for (let i = fs.length - 1; i >= 0; i--) {
	if (i <= pos) {
		break
	}
	if (fs[i] === '.') {
		continue
	}
	let len = 0
	let id = fs[i]
	// for (let j = i; j >= 0 && log('fs, id', fs[j], id), fs[j] !== id ; j--) {
	// 	log('check j', j, fs[j])
	// 	// if (fs[j] !== id) {
	// 	// 	break
	// 	// }
	// 	len++
	// }
	// log('file', fs[i], 'lenmgth', len)

	while (fs[pos] !== '.') {
		if (pos === fs.length) {
			throw new Error('crash')
		}
		pos++
	}
	if (pos > i) {
		break
	}

	fs[pos] = fs[i]
	fs[i] = '.'
}

function sum() {
	let result = 0
	for (let i = 0; i < fs.length; i++) {
		if (fs[i] === '.') {
			continue
		}
		result += i * (fs[i] as number)
	}
	return result
}

let part1 = sum()

log('part 1', part1)

// part 2

input = file.trim().split('')
fs = createFs()
pos = 0
for (let i = fs.length - 1; i >= 0; i--) {
	if (i <= pos) {
		break
	}
	if (fs[i] === '.') {
		continue
	}
	let len = 0
	let id = fs[i]
	for (let j = i; j >= 0 && fs[j] === id; j--) {
		// log('!!! id', id)
		// log('check j', j, fs[j])
		// if (fs[j] !== id) {
		// 	break
		// }
		len++
		i = j
	}
	// log('id', id, 'len', len)

	// move (i .. i+len) to leftmost pos of at least size len
	let gapStart = -1
	for (let k = 0; k < i; k++) {
		if (fs[k] === '.') {
			if (gapStart === -1) {
				gapStart = k
			}
			if (k - gapStart + 1 === len) {
				for (let l = i; l < i + len; l++) {
					fs[gapStart + (l - i)] = fs[l]
					fs[l] = '.'
				}
				// log('fs after move', fs.join(''))
			}
		} else {
			gapStart = -1
		}
	}

	// log('file', fs[i], 'len', len)

	// while (fs[pos] !== '.') {
	// 	if (pos === fs.length) {
	// 		throw new Error('crash')
	// 	}
	// 	pos++
	// }
	// if (pos > i) {
	// 	break
	// }
	//
	// fs[pos] = fs[i]
	// fs[i] = '.'
}

// log('fs', fs.join(''))
let part2  = sum()

log('part 2', part2)
