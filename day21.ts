// @ts-ignore
import input from './day21.txt'
import {
	adjacents,
	assert,
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
function unplay(output: string): string[] {
	let result1 = onlyShortest(unplay0(output))
	let result2 = onlyShortest(result1.flatMap((x) => unplay1(x)))
	let result3 = onlyShortest(result2.flatMap((x) => unplay2(x)))

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
function unplay1(output: string) {
	let pairs = adjacents([...('A' + output)])

	let result: string[] = ['']
	for (let [a, b] of pairs) {
		let shortests = shortestPaths(a, b)
		shortests = shortests.map((x) => x + 'A')

		result = combine(result, shortests)
	}

	return result
}

let unplay2 = unplay1

function unplay0(output: string): string[] {
	let pairs = adjacents([...('B' + output)])

	let result: string[] = ['']
	for (let [a, b] of pairs) {
		let shortests = shortestPathsNumpad(a, b)
		shortests = shortests.map((x) => x + 'A')
		result = combine(result, shortests)
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
	unplay1('v<<A>>^A<A>AvA<^AA>A<vAAA>^A').includes(
		'<vA<AA>>^AvAA<^A>A<v<A>>^AvA^A<vA>^A<v<A>^A>AAvA^A<v<A>A>^AAAvA<^A>A'
	)
)
assert(play1('<vA<AA>>^AvAA<^A>A'), 'v<<A>>^A')
assert(unplay1('v<<A>>^A').includes('<vA<AA>>^AvAA<^A>A'))

assert(play1('v<<A>>^A'), '<A')
assert(unplay1('<A').includes('v<<A>>^A'))

assert(play0('<A'), '0')
log('ok')

// log(unplay0('029B'))
log(unplay('029B')[0].length)

function solve(input: string) {
	let codes = toLines(input.replaceAll('A', 'B'))
	let result = 0
	for (let code of codes) {
		let num = parseInt(code)
		let shortestPath = unplay(code)[0].length

		log(code, shortestPath)
		result += num * shortestPath
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
	using perf = timer('input')
	assert(solve(input), 134120)
}
