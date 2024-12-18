// @ts-ignore
import input from './day17.txt'
import { assert, log, range, toLines } from './utils'

let test = `
Register A: 729
Register B: 0
Register C: 0

Program: 0,1,5,4,3,0
`

let test2 = `
Register A: 2024
Register B: 0
Register C: 0

Program: 0,3,5,4,3,0`

const A = 0
const B = 1
const C = 2

type Regs = [number, number, number]
function parse(input: string) {
	let regs: Regs = [0, 0, 0]
	let program: number[] = []

	toLines(input).forEach((line) => {
		if (line.startsWith('R')) {
			regs['ABC'.indexOf(line[9])] = Number(line.slice(12))
		}
		if (line.startsWith('P')) {
			program = line.slice(9).split(',').map(Number)
		}
	})

	return { regs, program }
}

const adv = 0
const bxl = 1
const bst = 2
const jnz = 3
const bxc = 4
const out = 5
const bdv = 6
const cdv = 7

function xor(a: number, b: number) {
	return Number(BigInt(a) ^ BigInt(b))
}

function solve(input: string, part: 1 | 2 = 1) {
	let { regs, program } = parse(input)

	function run(regs: Regs, program: number[]) {
		let ip = 0
		let output: number[] = []

		function step() {
			let instr = program[ip++]
			let op = program[ip++]
			let combo = op > 3 ? regs[op - 4] : op
			switch (instr) {
				case adv:
					regs[A] = Math.trunc(regs[A] / 2 ** combo)
					break
				case bxl:
					regs[B] = xor(regs[B], op)
					break
				case bst:
					regs[B] = regs[A] % 8
					break
				case jnz:
					if (regs[A]) ip = op
					break
				case bxc:
					regs[B] = xor(regs[B], regs[C])
					break
				case out:
					output.push(combo % 8)
					break
				case bdv:
					regs[B] = Math.trunc(regs[A] / 2 ** combo)
					break
				case cdv:
					regs[C] = Math.trunc(regs[A] / 2 ** combo)
					break
			}
		}

		while (ip < program.length) {
			step()
		}

		return output
	}

	if (part === 1) {
		return run(regs, program).join(',')
	}

	if (part === 2) {
		// Assuming <things> about the input, do <magic>
		// Something to do with the fact that the last 3 bits remaining in A
		// register determine the last number printed
		function check(initialA: number, expected: number[]): number {
			let [next, ...rest] = expected
			for (let a of range(initialA, initialA + 7)) {
				let out = run(regs.with(A, a) as Regs, program)
				if (next === out[0]) {
					if (rest.length === 0) {
						return a
					}

					let result = check(a * 8, rest)
					if (result > 0) {
						return result
					}
				}
			}
			return -1
		}

		return check(0, program.toReversed())
	}
}

assert(solve(test), '4,6,3,5,6,3,5,2,1,0')
assert(solve(input), '1,5,0,5,2,0,1,3,5')

assert(solve(test2, 2), 117440)
assert(solve(input, 2), 236581108670061)

log('ok')
