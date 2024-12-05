// Part 1

import { pairs, readFile, toLines } from './utils.ts'

let log = console.log

let input = readFile('day5.txt')

if (0) {
	input = `
47|53
97|13
97|61
97|47
75|29
61|13
75|53
29|13
97|29
53|29
61|53
97|53
61|29
47|13
75|47
97|75
47|61
75|61
47|29
75|13
53|13

75,47,61,53,29
97,61,53,29,13
75,29,13
75,97,47,61,53
61,13,29
97,13,75,29,47`
}

let [first, second] = input.split('\n\n').map(toLines)

let pages = second.map((line) => line.split(',').map(Number))

let correctPairs = new Set(first)

function isCorrectPair([a, b]: number[]) {
	return correctPairs.has(`${a}|${b}`)
}

function isCorrect(order: number[]) {
	return pairs(order).every(isCorrectPair)
}

// Part 1

let corrects = pages.filter(isCorrect)
let incorrects = pages.filter((x) => !isCorrect(x))

let middles = corrects.map((page) => page[(page.length / 2) | 0])

let result1 = middles.reduce((a, b) => a + b, 0)
log('part 1', result1)

// Part 2

function comparator(a: number, b: number) {
	if (correctPairs.has(`${a}|${b}`)) {
		return -1
	} else {
		return 1
	}
}

let sorted = incorrects.map((page) => page.sort(comparator))
let middles2 = sorted.map((page) => page[(page.length / 2) | 0])
let result2 = middles2.reduce((a, b) => a + b, 0)
log('part 2', result2)
