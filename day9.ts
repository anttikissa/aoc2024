import { log, readFile } from './utils.ts'

let file = readFile('day9.txt')

file = `2333133121414131402`

let input = file.trim().split('')

log('input', input.join(''))

let fs = []
let id = 0
for (let i = 0; i < input.length; i += 2) {
	let len = Number(input[i])
	let gap = Number(input[i + 1])
	while (len--) {
		fs.push(id)
	}
	while (gap--) {
		fs.push('.')
	}

	id++
	if (typeof gap === 'undefined') {
		log('undefined', i)
	}
}

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

let result = 0
for (let i = 0; i < fs.length; i++) {
	if (fs[i] === '.') {
		break
	}
	result += i * fs[i]
}

log('result', result)

// log('fs', fs.join(''))
