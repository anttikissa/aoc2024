// @ts-ignore
import input from './day17.txt'
import { assert, fail, log } from './utils'

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

Program: 0,3,5,4,3,0
`

function parse(input: string) {
	let [regPart, programPart] = input.trim().split('\n\n')
	let regs = []
	for (let line of regPart.split('\n')) {
		regs.push(Number(line.match(/(\d+)/)![0]))
	}
	let [_, memPart] = programPart.split(' ')
	let mem = memPart.split(',').map(Number)
	return { regsOrig: regs, memOrig: mem }
}

let instructions = ['adv', 'bxl', 'bst', 'jnz', 'bxc', 'out', 'bdv', 'cdv']

function step(regs: number[], mem: number[], out: number[] = []) {
	let reg = {
		get a() {
			return regs[0]
		},
		set a(value: number) {
			regs[0] = Math.trunc(value)
		},
		get b() {
			return regs[1]
		},
		set b(value: number) {
			regs[1] = Math.trunc(value)
		},
		get c() {
			return regs[2]
		},
		set c(value: number) {
			regs[2] = Math.trunc(value)
		},
		get pc() {
			return regs[3]
		},
		set pc(value: number) {
			regs[3] = value
		},
	}

	function combo(val: number) {
		if (0 <= val && val <= 3) {
			return val
		}
		if (4 <= val && val <= 6) {
			return regs[val - 4]
		}
		fail('combo', val)
	}

	if (!Number.isInteger(reg.pc)) {
		fail('bug')
	}
	if (reg.pc < 0 || reg.pc >= mem.length - 1) {
		return 'halt'
	}
	let instr = instructions[mem[reg.pc++]]
	let op = mem[reg.pc++]
	// log('instruction:', instr, op)
	let val: number
	let lhs: number, rhs: number
	switch (instr) {
		case 'adv':
			lhs = reg.a
			rhs = combo(op)
			reg.a = lhs / 2 ** rhs
			break
		case 'bxl':
			reg.b = op ^ reg.b
			break
		case 'bst':
			val = combo(op)
			reg.b = val % 8
			break
		case 'jnz':
			if (reg.a) {
				reg.pc = op
			}
			break
		case 'bxc':
			reg.b = reg.b ^ reg.c
			break
		case 'out':
			val = combo(op)
			out.push(val % 8)
			break
		case 'bdv':
			lhs = reg.a
			rhs = combo(op)
			reg.b = lhs / 2 ** rhs
			break
		case 'cdv':
			lhs = reg.a
			rhs = combo(op)
			reg.c = lhs / 2 ** rhs
			break
		default:
			fail()
	}
	// printState(regs, mem)
}

function printState(regs: number[], mem: number[]) {
	log('state', { regs, mem })
}

// printState()

function run(regs: number[], mem: number[], debug = false) {
	// let pc = 0

	let out: number[] = []

	if (debug) {
		log('run, regs:', regs, 'mem:', mem)
	}

	while (true) {
		let result = step(regs, mem, out)
		if (result === 'halt') {
			break
		}
	}
	return out
}

// Tests
//
// If register C contains 9, the program 2,6 would set register B to 1.
{
	let regs = [0, 0, 9, 0]
	let mem = [2, 6]
	step(regs, mem)
	assert(regs[1], 1)
}
// If register A contains 10, the program 5,0,5,1,5,4 would output 0,1,2.
{
	let regs = [10, 0, 0, 0]
	let mem = [5, 0, 5, 1, 5, 4]
	let out = run(regs, mem)
	assert(out, [0, 1, 2])
}
// If register A contains 2024, the program 0,1,5,4,3,0 would output 4,2,5,6,7,7,7,7,3,1,0 and leave 0 in register A.
{
	let regs = [2024, 0, 0, 0]
	let mem = [0, 1, 5, 4, 3, 0]
	let out = run(regs, mem)
	assert(out, [4, 2, 5, 6, 7, 7, 7, 7, 3, 1, 0])
	assert(regs[0], 0)
}
// If register B contains 29, the program 1,7 would set register B to 26.
{
	let regs = [0, 29, 0, 0]
	let mem = [1, 7]
	step(regs, mem)
	assert(regs[1], 26)
}
// If register B contains 2024 and register C contains 43690, the program 4,0 would set register B to 44354.
{
	let regs = [0, 2024, 43690, 0]
	let mem = [4, 0]
	step(regs, mem)
	assert(regs[1], 44354)
}
{
	let regs = [80, 3, 0, 0]
	let mem = [6, 3] // bdv
	step(regs, mem)
	assert(regs[1], 80 / 2 ** 3)
}
{
	let regs = [24, 3, 0, 0]
	let mem = [7, 3] // cdv
	step(regs, mem)
	assert(regs[2], 24 / 2 ** 3)
}

function equals(copy: number[], out: number[]) {
	if (copy.length !== out.length) return false
	for (let i = 0; i < copy.length; i++) {
		if (copy[i] !== out[i]) {
			return false
		}
	}
	return true
}

assert(equals([1, 2, 3], [1, 2, 3]))
assert(!equals([1, 2, 3], [1, 2, 3, 4]))

function solve(input: string, part: 1 | 2 = 1) {
	let { regsOrig, memOrig } = parse(input)
	// fake pc
	regsOrig[3] = 0

	if (part === 1) {
		let out = run(regsOrig, memOrig)
		return out.join(',')
	}

	if (part === 2) {
		for (let i = 0; i < 1000000; i++) {
			let mem = [...memOrig]
			let regs = [...regsOrig]

			// let i = 117440
			regs[0] = i
			let out = run(regs, mem, i % 1000 === 0)

			if (equals(memOrig, out)) {
				return i
			}
		}
	}
}

assert(solve(test), '4,6,3,5,6,3,5,2,1,0')
assert(solve(input), '1,5,0,5,2,0,1,3,5')

assert(solve(test2, 2), 117440)

log('ok')
