import { $, include, log, range } from './utils.ts'

// @ts-ignore
import file from './day9.txt' with { type: 'text' }

let input = file
input = `2333133121414131402`

let finished = false

let blocks: number[] = []

function addFile(idx: number, id: number, len: number) {
	while (len--) {
		blocks[idx++] = id
	}
	return idx
}

function addGap(idx: number, len: number) {
	while (len--) {
		blocks[idx++] = -1
	}
	return idx
}

let readPos = 0
let writePos = 0

function init() {
	let idx = 0
	for (let i of range(input.length)) {
		if (i % 2 === 0) {
			idx = addFile(idx, i / 2, Number(input[i]))
		} else {
			idx = addGap(idx, Number(input[i]))
		}
	}

	readPos = blocks.length - 1
	writePos = 0
}

function visualize() {
	if (typeof window === 'undefined') {
		return
	}

	$('.input pre')!.textContent = input
	$('.state pre')!.textContent = blocks
		.map((b) => {
			if (b === -1) {
				return '.'
			}
			if (b >= 0 && b <= 9) {
				return b.toString()
			}
			return `[${b}]`
		})
		.join('')

	log({ readPos, writePos })
}

// Get file at 'readPos', reading backwards
function getFile() {
	while (readPos >= 0 && blocks[readPos] === -1) {
		readPos--
	}
	let lastBlock = readPos
	let id = blocks[readPos]
	let firstBlock = readPos
	while (blocks[readPos] === id) {
		firstBlock = readPos
		readPos--
	}
	return { id, firstBlock, lastBlock }
}

function step() {
	log('step')
	// let file = getFile(readPos)
	// let gap = getGap(writePos)
	log('file', file)
}

function run() {
	while (!finished) {
		step()
		if (Math.random() < 0.5) {
			finished = true
		}
	}
}

include(visualize, run)

init()
visualize()

if (typeof window !== 'undefined') {
	$('.step')!.addEventListener('click', () => {
		step()
		visualize()
	})
	// $('.run')!.addEventListener('click', () => {
	// 	run()
	// 	visualize()
	// })
}
