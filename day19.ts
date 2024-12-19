// @ts-ignore
import input from './day19.txt'
import { assert, cache, log, sum, timer } from './utils.ts'
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

	// log('patterns', patterns.length)
	// log('designs', designs.length)

	let possible = (design: string) => {
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

	possible = cache(possible)

	return designs.filter(possible).length
}

function solve2(input: string, part: 1 | 2 = 1) {
	let parts = input.trim().split('\n\n')

	let patterns = parts[0].split(', ')
	let designs = parts[1].split('\n')

	// log('patterns', patterns.length)
	// log('designs', designs.length)

	let patternsByColor = Object.groupBy(patterns, (pattern) => pattern[0])

	let possibilities = (design: string) => {
		if (design === '') {
			return 1
		}

		let first = design[0]

		let ways = 0
		// Speedup from this is about 260 ms -> 80 ms (roughly as expected)
		// for (let pattern of patterns) {
		for (let pattern of patternsByColor[first] || []) {
			if (design.startsWith(pattern)) {
				ways += possibilities(design.slice(pattern.length))
			}
		}

		return ways
	}

	possibilities = cache(possibilities)

	if (part === 1) {
		return designs.filter((design) => {
			// log('checking', design)

			return possibilities(design) > 0
		}).length
	}

	if (part === 2) {
		return sum(designs.map(possibilities))
	}
}

assert(solve(test), 6)
assert(solve2(test), 6)
assert(solve2(input), 317)

assert(solve2(test, 2), 16)
{
	// [perf] solve2: 88 ms
	using perf = timer('solve2')
	assert(solve2(input, 2), 883443544805484)
}

{
	// [perf] testSplitMemoized: 9611 ms
	// using perf = timer('testSplitMemoized')
	// assert(solve(input), 317)
}

log('ok')
