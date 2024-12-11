import { log, range } from './utils'

let input = `5 62914 65 972 0 805922 6521 1639064`

let test = `125 17`

// input = test

let stones = input.trim().split(' ').map(Number)

let times = 0

function blink() {
	times++
	let newStones = []

	for (let stone of stones) {
		if (stone === 0) {
			newStones.push(1)
		} else {
			let digits = (Math.log10(stone) | 0) + 1
			if (digits % 2 === 0) {
				let first = (stone / 10 ** (digits / 2)) | 0
				let second = stone % 10 ** (digits / 2)
				newStones.push(first)
				newStones.push(second)
			} else {
				newStones.push(stone * 2024)
			}
		}
	}

	stones = newStones
	if (times < 10) {
		log('stones', stones, 'length', stones.length)
	}
	log(`after blink ${times} length`, stones.length)
}

// for (let _ of range(6)) {
// 	log('start 6')
// 	blink()
// }

// for (let _ of range(75)) {
// 	blink()
// }

let cache = new Map<string, number>()

// How many stones will we have in n blinks?
function stoneCount(stones: number[], n: number) {
	if (n === 0) {
		return stones.length
	}

	let result = 0

	for (let stone of stones) {
		let cacheKey = `${stone}-${n}`
		if (cache.has(cacheKey)) {
			result += cache.get(cacheKey)!
			continue
		}
		if (stone === 0) {
			let count = stoneCount([1], n - 1)
			cache.set(`1-${n - 1}`, count)
			result += count
		} else {
			let digits = (Math.log10(stone) | 0) + 1
			if (digits % 2 === 0) {
				let first = (stone / 10 ** (digits / 2)) | 0
				let firstCount = stoneCount([first], n - 1)
				cache.set(`${first}-${n - 1}`, firstCount)

				let second = stone % 10 ** (digits / 2)
				let secondCount = stoneCount([second], n - 1)
				cache.set(`${second}-${n - 1}`, secondCount)

				result += firstCount + secondCount
			} else {
				let count = stoneCount([stone * 2024], n - 1)
				cache.set(`${stone * 2024}-${n - 1}`, count)
				result += count
			}
		}
	}

	return result
}

for (let i = 0; i < 80; i++) {
	log(`after ${i} blinks, length is `, stoneCount(stones, i))
}
