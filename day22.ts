import input from './day22.txt'
import { assert, log, range, timer } from './utils'

let test = `
1
10
100
2024`

function mixAndPrune(a: number, b: number) {
	return Number(BigInt(a) ^ BigInt(b)) % 16777216
}

function next(secret: number) {
	let a = secret * 64
	secret = mixAndPrune(secret, a)
	let b = Math.floor(secret / 32)
	secret = mixAndPrune(secret, b)
	let c = secret * 2048
	secret = mixAndPrune(secret, c)

	return secret
}

function solve(input: string, n: number) {
	let seeds = input.split('\n').filter(Boolean).map(Number)

	let result = 0
	for (let seed of seeds) {
		let num = seed
		for (let _ of range(n)) {
			num = next(num)
		}
		result += num
		// log(`${seed}: ${num}`)
	}

	return result
	// return seeds.length
}

assert(next(123), 15887950)
assert(next(15887950), 16495136)

// 5864043 too low
assert(solve(test, 2000), 37327623)
{
	using perf = timer('input')
	assert(solve(input, 2000), 20215960478)
}

log('ok')
