// Part 1

import { readFile, toLines } from './utils.ts'

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

// let orders = first.map(line => line.split('|').map(Number))
let pages = second.map((line) => line.split(',').map(Number))

// log('first', { orders, pages })

let correctPairs = new Set(first)

function pairs(arr: number[]) {
	let result = []
	for (let i = 0; i < arr.length; i++) {
		for (let j = i + 1; j < arr.length; j++) {
			result.push([arr[i], arr[j]])
		}
	}
	return result
}

function isCorrectPair([a, b]: number[]) {
	return correctPairs.has(`${a}|${b}`)
}

function isCorrect(order: number[]) {
	if (pairs(order).every(isCorrectPair)) {
		return true
	}
}

let corrects = pages.filter(isCorrect)
let incorrects = pages.filter(x => !isCorrect(x))

let middles = corrects.map((page) => page[(page.length / 2) | 0])

// log('middles', middles)

let result1 = middles.reduce((a, b) => a + b, 0)
log('part 1', result1)

function pageOrdering(a: number, b: number) {
	if (correctPairs.has(`${a}|${b}`)) {
		return -1
	} else {
		return 1
	}
}

log('correct', correctPairs)

let sorted = incorrects.map(page => page.sort(pageOrdering))
log('sorted', sorted)

let middles2 = sorted.map((page) => page[(page.length / 2) | 0])
log('middles2')

let result2 = middles2.reduce((a, b) => a + b, 0)
log('part 2', result2)

