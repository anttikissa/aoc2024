import input from './day13.txt' with { type: 'text' }
import {
	assert,
	fail,
	mtxInvertible,
	log,
	type Mtx2,
	mtxInvert,
	mtxMul,
	integerEnough,
} from './utils.ts'

let testInput = `
Button A: X+94, Y+34
Button B: X+22, Y+67
Prize: X=8400, Y=5400

Button A: X+26, Y+66
Button B: X+67, Y+21
Prize: X=12748, Y=12176

Button A: X+17, Y+86
Button B: X+84, Y+37
Prize: X=7870, Y=6450

Button A: X+69, Y+23
Button B: X+27, Y+71
Prize: X=18641, Y=10279`

function solve(input: string, problemPart: number) {
	let problemInputs = input.trim().split('\n\n')

	let problems = []

	for (let part of problemInputs) {
		let lines = part.split('\n')
		let [_1, a1, a2] = lines[0]!.match(/X\+(\d+), Y\+(\d+)/)!.map(Number)
		let [_2, b1, b2] = lines[1]!.match(/X\+(\d+), Y\+(\d+)/)!.map(Number)
		let [_3, x, y] = lines[2]!.match(/X=(\d+), Y=(\d+)/)!.map(Number)

		if (problemPart === 2) {
			x += 10000000000000
			y += 10000000000000
		}
		problems.push({ a1, a2, b1, b2, x, y })
	}

	let totalCost = 0
	for (let problem of problems) {
		let { a1, a2, b1, b2, x, y } = problem
		// i * a1 + j * b1 = x
		// i * a2 + j * b2 = y
		//
		// [ a1, b1 ] [ i ] = [ x ]
		// [ a2, b2 ] [ j ] = [ y ]
		//
		// Find i, j
		let mtx = [
			[a1, b1],
			[a2, b2],
		] as Mtx2
		if (!mtxInvertible(mtx)) {
			fail('matrix is not invertible')
		}
		let [i, j] = mtxMul(mtxInvert(mtx), [x, y])

		if (integerEnough(i) && integerEnough(j)) {
			let cost = Math.round(i) * 3 + Math.round(j)
			// log('problem', problem, { i, j, cost })
			totalCost += cost
		}
	}

	return totalCost
}

assert(solve(testInput, 1), 480)
assert(solve(input, 1), 39290)

assert(solve(testInput, 2), 875318608908)
assert(solve(input, 2), 73458657399094)
