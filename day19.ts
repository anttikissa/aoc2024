// @ts-ignore
import input from './day19.txt'
import { assert, cache, log } from './utils.ts'
let test = `
r, wr, b, g, bwu, rb, gb, br

gbbr
bggr
brwrr
rrbgbr
ubwu
bwurrg
brgr
bbrgwb
`

function solve(input: string) {
	let parts = input.trim().split('\n\n')

	let patterns = parts[0].split(', ')
	let designs = parts[1].split('\n')

	log('patterns', patterns.length)
	log('designs', designs.length)

	function possible(design: string) {
		if (design === '') {
			return true
		}

		for (let pattern of patterns) {
			let parts = design.split(pattern)

			if (parts.length > 1) {
				if (parts.every(possible)) {
					return true
				}
			}
		}

		return false
	}

	return designs.filter(possible).length
}

function solve2(input: string) {
	let parts = input.trim().split('\n\n')

	let patterns = parts[0].split(', ')
	let designs = parts[1].split('\n')

	log('patterns', patterns.length)
	log('designs', designs.length)

	let patternsByColor = Object.groupBy(patterns, (pattern) => pattern[0])

	log('patternsByColor', patternsByColor)

	let possible = (design: string, advance: number = 0) => {
		log('check design', { design, advance })

		if (design === '') {
			return true
		}

		let first = design[0]

		for (let pattern of patternsByColor[first] || []) {
			if (design.startsWith(pattern)) {
				if (
					possible(
						design.slice(pattern.length),
						advance + pattern.length
					)
				) {
					return true
				}
			}
		}

		return false
	}

	possible = cache(possible)

	return designs.filter((design) => {
		log('checking', design)

		return possible(design)
	}).length
}

assert(solve(test), 6)
assert(solve2(input), 317)

log('ok')
