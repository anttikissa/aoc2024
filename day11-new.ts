import { cache, log, range, sum } from './utils'

let input = `5 62914 65 972 0 805922 6521 1639064`
let test = `125 17`

// input = test

let stones = input.trim().split(' ').map(Number)

let count = (stone: number, blinks: number): number => {
	if (blinks === 0) {
		return 1
	}
	if (stone === 0) {
		return count(1, blinks - 1)
	}
	let length = (Math.log10(stone) | 0) + 1
	if (length % 2 === 0) {
		let first = (stone / 10 ** (length / 2)) | 0
		let second = stone % 10 ** (length / 2)
		return count(first, blinks - 1) + count(second, blinks - 1)
	}
	return count(stone * 2024, blinks - 1)
}

count = cache(count)

function solve(blinks: number) {
	return sum(stones.map((stone) => count(stone, blinks)))
}

for (let i of range(0, 75)) {
	log(`${i} blinks: ${solve(i)}`)
}
