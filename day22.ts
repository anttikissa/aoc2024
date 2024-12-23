import input from './day22.txt'
import { assert, cache, log, max, range, timer } from './utils'

let test = `
1
10
100
2024`

let test2 = `
1
2
3
2024`

let next = (secret: number) => {
	let sec = secret

	let a = secret * 64
	secret = ((secret ^ a) >>> 0) % 16777216
	let b = (secret / 32) | 0
	secret = ((secret ^ b) >>> 0) % 16777216
	let c = secret * 2048
	secret = ((secret ^ c) >>> 0) % 16777216

	return secret
}

function solve(input: string, n: number, part: 1 | 2 = 1) {
	let seeds = input.split('\n').filter(Boolean).map(Number)

	if (part === 1) {
		let result = 0
		for (let seed of seeds) {
			let num = seed
			for (let _ of range(n)) {
				num = next(num)
			}
			result += num
		}
		return result
	}

	if (part === 2) {
		let totalsByMagic = Array(32 ** 4).fill(0)
		for (let seed of seeds) {
			let prevPrice = seed % 10
			let secret = seed
			let magic = 0
			let magicsSeen = new Set()
			for (let _ of range(n)) {
				secret = next(secret)
				let price = secret % 10
				let diff = prevPrice - price
				magic = ((magic << 5) + (diff + 10)) & (32 ** 4 - 1)
				if (!magicsSeen.has(magic)) {
					totalsByMagic[magic] += price
				}
				magicsSeen.add(magic)
				prevPrice = price
			}
		}

		return max(totalsByMagic)
	}
}

assert(next(123), 15887950)
assert(next(15887950), 16495136)

// 5864043 too low
assert(solve(test, 2000), 37327623)
{
	using perf = timer('part 1')
	assert(solve(input, 2000), 20215960478)
}

assert(solve(test2, 2000, 2), 23)

{
	using perf = timer('part 2')
	assert(solve(input, 2000, 2), 2221)
}

log('ok')
