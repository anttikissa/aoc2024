// @ts-ignore
import input from './day21.txt'
import {
	adjacents,
	assert,
	fail,
	gridFind,
	gridGet,
	gridIsWithin,
	log,
	timer,
	toGrid,
	toLines,
} from './utils'

// Numpad:
// 7 8 9
// 4 5 6
// 1 2 3
// . 0 B   (. is forbidden; A changed to B to avoid confusion)

// Arrowpad:
// . ^ A   (. is forbidden)
// < v >

// How does it work:
//
// 0 - numpad
//      ^ play0: <A^A>^^AvvvA -> 029B
// 1 - robot 1
//      ^ play1: v<<A>>^A<A>AvA<^AA>A<vAAA>^A -> <A^A>^^AvvvA
// 2 - robot 2
//      ^ play2: <vA<AA>>^AvAA<^A>A<v<A>>^AvA^A<vA>^A<v<A>^A>AAvA^A<v<A>A>^AAAvA<^A>A -> v<<A>>^A<A>AvA<^AA>A<vAAA>^A
// 3 - (human) input
// TODO - wrong amount of robots above (should be 3?)
//
// Inputs upwards are always a sequence of '<>^vA'

let numpad = toGrid('789\n456\n123\n.0B')
let arrowpad = toGrid('.^A\n<v>')

function play0(input: string) {
	let numpadPos = gridFind(numpad, (a) => a === 'B')!
	let output = ''
	let [x, y] = numpadPos

	for (let i = 0; i < input.length; i++) {
		let val = input[i]
		if (val === '<') x--
		if (val === '>') x++
		if (val === '^') y--
		if (val === 'v') y++
		assert(gridIsWithin(numpad, [x, y]))
		let button = gridGet(numpad, [x, y])
		assert(button !== '.')

		if (val === 'A') {
			output += button
		}
	}
	return output
}

function play1(input: string) {
	let arrowpadPos = gridFind(arrowpad, (a) => a === 'A')!
	let output = ''
	let [x, y] = arrowpadPos

	for (let i = 0; i < input.length; i++) {
		let val = input[i]
		if (val === '<') x--
		if (val === '>') x++
		if (val === '^') y--
		if (val === 'v') y++
		assert(gridIsWithin(arrowpad, [x, y]))
		let button = gridGet(arrowpad, [x, y])
		assert(button !== '.')

		if (val === 'A') {
			output += button
		}
	}
	return output
}

let play2 = play1

function play(input: string) {
	return play0(play1(play2(input)))
}

function onlyShortest(strs: string[]): string[] {
	let grouped = Object.groupBy(strs, (x) => x.length)
	let lengths = Object.keys(grouped)
		.map(Number)
		.sort((a, b) => a - b)
	let shortestLength = lengths[0]
	let shortests: string[] = grouped[shortestLength]!

	return shortests
}
function unplayAll(output: string): string[] {
	let result1 = onlyShortest(unplay0All(output))
	let result2 = onlyShortest(result1.flatMap((x) => unplay1All(x)))
	let result3 = onlyShortest(result2.flatMap((x) => unplay2All(x)))

	return result3

	// TODO
	// .flatMap((x) => unplay2(x))
}

assert(play0('<^<^^A>>Av<Avv>A'), '795B')
assert(play0('<A^A>^^AvvvA'), '029B')

assert(play1('v<<A>>^A<A>AvA<^AA>A<vAAA>^A'), '<A^A>^^AvvvA')
assert(play0('<A^A>^^AvvvA'), '029B')

assert(
	play2(
		'<vA<AA>>^AvAA<^A>A<v<A>>^AvA^A<vA>^A<v<A>^A>AAvA^A<v<A>A>^AAAvA<^A>A'
	),
	'v<<A>>^A<A>AvA<^AA>A<vAAA>^A'
)

assert(
	play(
		'<vA<AA>>^AvAA<^A>A<v<A>>^AvA^A<vA>^A<v<A>^A>AAvA^A<v<A>A>^AAAvA<^A>A'
	),
	'029B'
)

// interleavings('ab', '12') => [
//   'ab12',
//   'a1b2',
//   'a12b',
//   '1ab2',
//   '1a2b',
//   '12ab'
// ]

function interleavings(a: string, b: string): string[] {
	if (a.length === 0) return [b]
	if (b.length === 0) return [a]
	let aFirst = a[0]
	let aRest = a.slice(1)
	let bFirst = b[0]
	let bRest = b.slice(1)
	return [
		...interleavings(aRest, b).map((x) => aFirst + x),
		...interleavings(a, bRest).map((x) => bFirst + x),
	]
}

function combine(starts: string[], ends: string[]) {
	return starts.flatMap((start) => ends.map((end) => start + end))
}

// ARROWPAD ONLY
function shortestPaths(a: string, b: string) {
	// Get from a to b
	let [x1, y1] = gridFind(arrowpad, (val) => val === a)!
	let [x2, y2] = gridFind(arrowpad, (val) => val === b)!
	let dx = x2 - x1
	let xs = dx > 0 ? '>'.repeat(dx) : '<'.repeat(-dx)
	let dy = y2 - y1
	let ys = dy > 0 ? 'v'.repeat(dy) : '^'.repeat(-dy)

	let interleaved = interleavings(xs, ys)
	// Ban those that go over '.'
	if (a === '<') {
		interleaved = interleaved.filter((y) => !y.startsWith('^'))
	}
	if (b === '<') {
		interleaved = interleaved.filter((y) => !y.endsWith('v'))
	}
	return interleaved
}

function shortestPathsNumpad(a: string, b: string) {
	let [x1, y1] = gridFind(numpad, (val) => val === a)!
	let [x2, y2] = gridFind(numpad, (val) => val === b)!
	let dx = x2 - x1
	let xs = dx > 0 ? '>'.repeat(dx) : '<'.repeat(-dx)
	let dy = y2 - y1
	let ys = dy > 0 ? 'v'.repeat(dy) : '^'.repeat(-dy)

	let interleaved = interleavings(xs, ys)
	// Ban those that go over '.'
	if ('741'.includes(a) && '0B'.includes(b)) {
		if (a === '7') {
			interleaved = interleaved.filter((y) => !y.startsWith('vvv'))
		}
		if (a === '4') {
			interleaved = interleaved.filter((y) => !y.startsWith('vv'))
		}
		if (a === '1') {
			interleaved = interleaved.filter((y) => !y.startsWith('v'))
		}
	}
	if ('0B'.includes(a) && '741'.includes(b)) {
		if (a === 'B') {
			interleaved = interleaved.filter((y) => !y.startsWith('<<'))
		}
		if (a === '0') {
			interleaved = interleaved.filter((y) => !y.startsWith('<'))
		}
	}
	return interleaved
}

let lengths: Map<string, number[]> = new Map()

// Return shortest paths that result in the given output
function unplay1All(output: string) {
	let pairs = adjacents([...('A' + output)])

	let result: string[] = ['']
	for (let [a, b] of pairs) {
		let shortests = shortestPaths(a, b)
		shortests = shortests.map((x) => x + 'A')

		result = combine(result, shortests)
	}

	return result
}

let unplay2All = unplay1All

function unplay0All(output: string): string[] {
	let pairs = adjacents([...('B' + output)])

	let result: string[] = ['']
	for (let [a, b] of pairs) {
		let shortests = shortestPathsNumpad(a, b)
		shortests = shortests.map((x) => x + 'A')
		result = combine(result, shortests)
	}

	return result
}

function unplay(output: string, iterations = 2): string {
	let result = unplay0(output)

	while (iterations--) {
		result = unplay1(result)
	}

	return result
}

assert(shortestPaths('A', '^'), ['<'])
assert(shortestPaths('A', 'v'), ['<v', 'v<'])
assert(shortestPaths('A', '<'), ['<v<', 'v<<'])
assert(shortestPaths('<', '^'), ['>^'])

assert(shortestPathsNumpad('1', '0'), ['>v'])
assert(shortestPathsNumpad('0', '4'), ['^<^', '^^<'])
assert(shortestPathsNumpad('4', 'B'), ['>>vv', '>v>v', '>vv>', 'v>>v', 'v>v>'])

assert(
	play1(
		'<vA<AA>>^AvAA<^A>A<v<A>>^AvA^A<vA>^A<v<A>^A>AAvA^A<v<A>A>^AAAvA<^A>A'
	),
	'v<<A>>^A<A>AvA<^AA>A<vAAA>^A'
)
assert(
	unplay1All('v<<A>>^A<A>AvA<^AA>A<vAAA>^A').includes(
		'<vA<AA>>^AvAA<^A>A<v<A>>^AvA^A<vA>^A<v<A>^A>AAvA^A<v<A>A>^AAAvA<^A>A'
	)
)
assert(play1('<vA<AA>>^AvAA<^A>A'), 'v<<A>>^A')
assert(unplay1All('v<<A>>^A').includes('<vA<AA>>^AvAA<^A>A'))

assert(play1('v<<A>>^A'), '<A')
assert(unplay1All('<A').includes('v<<A>>^A'))

assert(play0('<A'), '0')
log('ok')

// log(unplay0('029B'))
log(unplayAll('029B')[0].length)

function solve(input: string) {
	let codes = toLines(input.replaceAll('A', 'B'))
	let result = 0
	for (let code of codes) {
		let num = parseInt(code)
		let shortestPath = unplayAll(code)[0].length

		log(code, shortestPath)
		result += num * shortestPath
	}

	return result
}

// Part 2

function goodness(path: string) {
	let pairs = adjacents([...path])
	let result = 0
	for (let [a, b] of pairs) {
		if (a === b) {
			result += 1000000
		}
	}

	for (let i = 0; i < path.length; i++) {
		// Cheated by looking at:
		// https://www.reddit.com/r/adventofcode/comments/1hj2odw/2024_day_21_solutions/
		// All else being the same, prioritize moving < over ^ over v over >. I found this through trial and error.
		if (path[i] === '<') {
			result += (10 - i) * 1000
		}
		if (path[i] === '^') {
			result += (10 - i) * 100
		}
		if (path[i] === 'v') {
			result += (10 - i) * 10
		}
		if (path[i] === '>') {
			result += (10 - i) * 1
		}
	}
	return result
}

function pickOptimal(sequences: string[]) {
	let sorted = sequences.sort((a, b) => goodness(b) - goodness(a))
	return sorted[0]
}

assert(goodness('<<v'), 1019080)
assert(goodness('<v<'), 18090)
assert(goodness('<^') > goodness('^<'))
assert(goodness('^v') > goodness('v^'))
assert(goodness('v>') > goodness('>v'))
assert(goodness('<<v') > goodness('v<<'))

assert(pickOptimal(['<<v', '<v<', 'v<<']), '<<v')

// Return the optimal solution
function unplay0(output: string) {
	let pairs = adjacents([...('B' + output)])

	let result = ''

	for (let [a, b] of pairs) {
		let shortests = shortestPathsNumpad(a, b)
		shortests = shortests.map((x) => x + 'A')
		let shortest = pickOptimal(shortests)
		result = result + shortest
	}

	return result
}

function unplay1(output: string) {
	let pairs = adjacents([...('A' + output)])

	let result = ''

	for (let [a, b] of pairs) {
		let shortests = shortestPaths(a, b)
		shortests = shortests.map((x) => x + 'A')
		let shortest = pickOptimal(shortests)
		result = result + shortest
	}

	return result
}

assert(unplay0('029B'), '<A^A^^>AvvvA')

// log('unplay', unplay1All('<A^A>^^AvvvA'))

// assert(unplay1('<A'), '<<vA>>^A')

// assert(unplay1('<A^A^^>AvvvA'), 'v<<A>>^A<A>AvA<^AA>A<vAAA>^Axx')
// v<<A>>^A<A>A<AAv>A^A<vAAA^>A
// v<<A>>^A<A>AvA<^AA>A<vAAA>^Axx

function shortestFor(code: string, iterations = 2): string {
	let result = unplay(code, iterations)
	return result

	// let result = unplayAll(code)
	// log('shortestFor', code, result[0])
	// return result[0].length
}

// ATTEMPT to solve part 2 by generating the optimal sequence
// Starts to take too much memory soon
function solve2(input: string, iterations = 2) {
	let codes = toLines(input.replaceAll('A', 'B'))

	let result = 0
	for (let code of codes) {
		let num = parseInt(code)
		let shortestPath = shortestFor(code, iterations)

		log(code, shortestPath.length)
		result += num * shortestPath.length
	}

	return result
}

// Final? attempt to solve

function unplay1length(output: string, iterations: number): number {
	if (iterations === 0) {
		return output.length
	}

	let pairs = adjacents([...('A' + output)])

	let result = 0

	for (let [a, b] of pairs) {
		// let shortests = shortestPaths(a, b)
		// shortests = shortests.map((x) => x + 'A')
		// let shortest = pickOptimal(shortests)
		// TOOD call unplay1length recursively
		// result = result + shortestLength
	}

	return result
}

function shortestFor3(code: string, iterations = 2) {
	// TODO look at shortestFor, inline, make recursive, change to calculate length instead
	// use unplay1length
	return 0
}

function solve3(input: string, iterations = 2) {
	let codes = toLines(input.replaceAll('A', 'B'))

	let result = 0
	for (let code of codes) {
		let num = parseInt(code)
		let shortestPathLength = shortestFor3(code, iterations)

		result += num * shortestPathLength
	}

	return result
}

let test = `
029A
980A
179A
456A
379A`

{
	using perf = timer('test')
	assert(solve(test), 126384)
}

{
	using perf = timer('solve2 test')
	assert(solve2(test), 126384)
}

{
	using perf = timer('solve3 test')
	assert(solve3(test), 126384)
}

{
	// using perf = timer('solve2 too heavy?')
	// Spoiler alert: yes it is
	// 400 ms
	// assert(solve2(test, 10), 178268300)
	// 900 ms
	// assert(solve2(test, 11), 0)
	// 2500 ms
	// assert(solve2(test, 12), 0)
	// 16 seconds
	// assert(solve2(test, 14), 0)
	// still waiting...
	// assert(solve2(test, 16), 0)
}

{
	using perf = timer('input')
	assert(solve(input), 134120)
}

{
	using perf = timer('solve2 input')
	assert(solve2(input), 134120)
}
