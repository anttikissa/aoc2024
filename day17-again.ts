// @ts-ignore
import input from './day17.txt'
import { assert, log, toLines } from './utils'

let test = `
Register A: 729
Register B: 0
Register C: 0

Program: 0,1,5,4,3,0
`

function parse(input: string) {
	let regs = {
		A: 0,
		B: 0,
		C: 0,
	}
	let program: number[] = []

	toLines(input).forEach((line) => {
		if (line.startsWith('R')) {
			regs[line[9] as 'A' | 'B' | 'C'] = Number(line.slice(12))
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

	function reg(n: number) {
		return regs['ABC'[n] as 'A' | 'B' | 'C']
	}

	let ip = 0
	let output: number[] = []

	function step() {
		let instr = program[ip++]
		let op = program[ip++]
		let combo = op > 3 ? reg(op - 4) : op
		switch (instr) {
			case adv:
				regs.A = Math.trunc(regs.A / 2 ** combo)
				break
			case bxl:
				regs.B = xor(regs.B, op)
				break
			case bst:
				regs.B = regs.A % 8
				break
			case jnz:
				if (regs.A) ip = op
				break
			case bxc:
				regs.B = xor(regs.B, regs.C)
				break
			case out:
				output.push(combo % 8)
				break
			case bdv:
				regs.B = Math.trunc(regs.A / 2 ** combo)
				break
			case cdv:
				regs.C = Math.trunc(regs.A / 2 ** combo)
				break
		}
	}

	while (ip < program.length) {
		step()
	}

	return output.join(',')
}

assert(solve(test), '4,6,3,5,6,3,5,2,1,0')
assert(solve(input), '1,5,0,5,2,0,1,3,5')

log('ok')
