// @ts-ignore
import input from './day21.txt'
import {
	adjacents,
	assert,
	fail,
	fail,
	gridFind,
	gridGet,
	gridPrint,
	gridPrint,
	log,
	straightDirections,
	toGrid,
	toLines,
	type Vec2,
	vecAdd,
} from './utils'

let test = `
029A
980A
179A
456A
379A`

// test = '379A'

let numberPad = toGrid(`
789
456
123
.0A`)

let arrowPad = toGrid(`
.^A
<v>
`)

function compare(a: number, b: number) {
	return a - b
}

function play(code: string, pad: string[][]) {
	let chars = code.split('')
	let pos = gridFind(pad, (x) => x === 'A')!
	let result = ''

	let idx = 0
	// log('play chars', chars)
	for (let char of chars) {
		// log('pos', pos, 'char', char)
		idx++
		if (char === 'A') {
			result += gridGet(pad, pos)
			continue
		}
		let dir = straightDirections['v<^>'.indexOf(char)]
		// log('char', char, 'dir', dir)
		assert(dir)
		pos = vecAdd(pos, dir)
		if (gridGet(pad, pos) === '.') {
			log('INVALID, char is', char)
			fail(
				`invalid move at idx ${idx - 1}`,
				'\n' + code,
				'\n' + '^'.padStart(idx),
				'\n' + gridPrint(pad)
			)
		}
	}

	return result
}

function solve(input: string) {
	let result = 0

	for (let code of toLines(input)) {
		function howto(str: string, pad: string[][]): string {
			let chars = str.split('')

			chars.unshift('A') // we start from A
			let moves = adjacents(chars)

			function move(from: Vec2, to: Vec2) {
				let result = ''
				let right = to[0] - from[0]
				let down = to[1] - from[1]
				let left = -right
				let up = -down

				// let numberPad = toGrid(`
				// 789
				// 456
				// 123
				// .0A`)
				//
				// let arrowPad = toGrid(`
				// .^A
				// <v>
				// `)
				if (pad.length > 2) {
					// Number pad; try to produce RIGHT and UP first

					if (from[1] === 3) {
						while (right-- > 0) result += '>'
						while (up-- > 0) result += '^'
						while (down-- > 0) result += 'v'
						while (left-- > 0) result += '<'
					} else {
						while (right-- > 0) result += '>'
						// this is optimal for some reason
						// but cannot be done one the bottom row
						while (down-- > 0) result += 'v'
						while (left-- > 0) result += '<'

						// For some reason, moving this to after RIGHT
						// produces worse solutions!
						while (up-- > 0) result += '^'
					}
				} else {
					// Number pad; try to produce RIGHT and UP first
					// Arrow pad
					while (right-- > 0) result += '>'
					while (up-- > 0) result += '^'
					while (down-- > 0) result += 'v'
					while (left-- > 0) result += '<'
				}
				result += 'A'
				// log('result', result)
				return result
			}

			let allMoves = ''

			for (let [from, to] of moves) {
				allMoves += move(
					gridFind(pad, (x) => x === from)!,
					gridFind(pad, (x) => x === to)!
				)
			}

			let check = play(allMoves, pad)
			log('check', { str, check, ok: check === str })
			return allMoves
		}

		let moves1 = howto(code, numberPad)
		let moves2 = howto(moves1, arrowPad)
		let moves3 = howto(moves2, arrowPad)

		// THE THING:
		// 379A our solution is
		// v<<A>>^AvA^Av<<A>>^AAv<A<A>>^AAvAA^<A>Av<A>^AA<A>Av<A<A>>^AAAvA^<A>A
		// <A>A<AAv<AA>>^AvAA^Av<AAA>^A
		// ^A^^<<A>>AvvvA
		// 379A
		//
		// real solution is
		// <v<A>>^AvA^A<vA<AA>>^AAvA<^A>AAvA^A<vA>^AA<A>A<v<A>A>^AAAvA<^A>A
		// <A>Av<<AA>^AA>AvAA^A<vAAA>^A
		// ^A<<^^A>>AvvvA
		// 379A

		// log(
		// 	`OUR SOLUTION TO ${code}, length ${moves3.length}:`,
		// 	'\n' + [moves3, moves2, moves1].join('\n')
		// )

		let len = moves3.length
		let num = parseInt(code)
		log('len', `${len} * ${num}`, { result: len * num })
		log('')

		result += len * num

		// if (code === '379A') {
		// 	let exp1 =
		// 		'<v<A>>^AvA^A<vA<AA>>^AAvA<^A>AAvA^A<vA>^AA<A>A<v<A>A>^AAAvA<^A>A'
		// 	log('play exp1', '\n' + exp1)
		// 	let exp2 = play(exp1, arrowPad)
		// 	log('play exp2', '\n' + exp2)
		// 	let exp3 = play(exp2, arrowPad)
		// 	log('play exp3', '\n' + exp3)
		// 	let exp4 = play(exp3, numberPad)
		// 	log('and  exp4', '\n' + exp4)
		// 	log('expected:', '\n' + [exp1, exp2, exp3].join('\n'))
		// 	log('actually should be')
		// }
	}

	return result
}

assert(solve(test), 126384)

// 138560
// ANSWER TOO HIGH
assert(solve(input), 10)

log('ok')
