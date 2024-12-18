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
		regs.push(BigInt(line.match(/(\d+)/)![0]))
	}
	let [_, memPart] = programPart.split(' ')
	let mem = memPart.split(',').map(Number)
	return { regsOrig: regs, memOrig: mem }
}

let instructions = ['adv', 'bxl', 'bst', 'jnz', 'bxc', 'out', 'bdv', 'cdv']

let regs = ['A', 'B', 'C']

// Program:
//
// Theory: the next 11 bits matter for the next output
//
// bst 4  ; B = A % 8    // Take lowest 3 bits of A
// bxl 3  ; B = B ^ 3    // XOR it with 3
// cdv 5  ; C = A >> B   // C = A >> [0..7] (still a huge number, only low 3 bits matter)
// adv 3  ; A = A >> 3   // Advance A by 3 bits
// bxc 1  ; B = B ^ C    // B = B ^ C ^ 5 (still a huge number, only low 3 bits matter)
// bxl 5  ; B = B ^ 5
// out 5  ; PRINT B % 8  // PRINT B (lowest 3 bits only)
// jnz 0  ; IF (A) GOTO 0

// To match output 0, the first 11 bits need to be correct
// To match output 0 and 1, the first 11 + 3 bits need to be correct
// To match output 0, 1, 3, the first 11 + 3 + 3 bits need to be correct

// Size of a: 3 bits * length of program (16 words) = 48 bits

// B = XOR(A % 8, 3)
// C = A >> B
// A >>= 3
// B = XOR(XOR(B, C), 5)
// PRINT B

function explain(instr: string, op: number) {
	function combo(op: number) {
		if (0 <= op && op <= 3) {
			return op
		} else {
			return regs[op - 4]
		}
	}

	switch (instr) {
		case 'adv':
			return `A = A >> ${combo(op)}`
		case 'bst':
			return `B = ${combo(op)} % 8`
		case 'bxl':
			return `B = B ^ ${op}`
		case 'cdv':
			return `C = A >> ${combo(op)}`
		case 'bxc':
			return `B = B ^ C`
		case 'out':
			return `PRINT ${combo(op)}`
		case 'jnz':
			return `IF (A) GOTO ${op}`
		default:
			return `i ${instr} n ${op}`
	}
}

function disasm(mem: number[]) {
	let pc = 0
	let out: string[] = []
	while (pc < mem.length) {
		let instr = instructions[mem[pc++]]
		let op = mem[pc++]
		let explanation = explain(instr, op)
		out.push(`${instr} ${op.toString().padEnd(2)} ; ${explanation}`)
	}
	return out.join('\n')
}

function step(regs: bigint[], mem: number[], out: number[] = []) {
	let reg = {
		get a(): bigint {
			return regs[0]
		},
		set a(value: bigint) {
			regs[0] = value
		},
		get b() {
			return regs[1]
		},
		set b(value: bigint) {
			if (value === -1108377597n) {
				log('!!! PERKL', value)
			}
			regs[1] = value
		},
		get c() {
			return regs[2]
		},
		set c(value: bigint) {
			regs[2] = value
		},
		get pc() {
			return regs[3]
		},
		set pc(value: bigint) {
			regs[3] = value
		},
	}

	function combo(val: bigint) {
		if (0 <= val && val <= 3) {
			return BigInt(val)
		}
		if (4 <= val && val <= 6) {
			return regs[Number(val) - 4]
		}
		fail('combo', val)
	}

	// if (!Number.isInteger(reg.pc)) {
	// 	fail('bug')
	// }
	if (reg.pc < 0n || reg.pc >= mem.length - 1) {
		return 'halt'
	}
	let instr = instructions[mem[Number(reg.pc++)]]
	let op = BigInt(mem[Number(reg.pc++)])
	// log('instruction:', instr, op)
	let val: bigint
	let lhs: bigint, rhs: bigint
	switch (instr) {
		case 'adv':
			lhs = reg.a
			rhs = combo(op)
			reg.a = lhs / 2n ** rhs
			break
		case 'bxl':
			reg.b = op ^ reg.b
			if (reg.b < 0) {
				fail('what', reg.b)
			}
			break
		case 'bst':
			val = combo(op)
			reg.b = val % 8n
			break
		case 'jnz':
			if (reg.a) {
				reg.pc = op
			}
			break
		case 'bxc':
			let prevB = reg.b
			reg.b = reg.b ^ reg.c
			if (reg.b < 0) {
				log('prev b was', prevB, { c: reg.c })
				printState(regs, mem)
				fail('what', reg.b)
			}
			break
		case 'out':
			val = combo(op)
			out.push(Number(val % 8n))
			if (val % 8n < 0n) {
				fail('what', val)
			}
			break
		case 'bdv':
			lhs = reg.a
			rhs = combo(op)
			reg.b = lhs / 2n ** rhs
			break
		case 'cdv':
			lhs = reg.a
			rhs = combo(op)
			reg.c = lhs / 2n ** rhs
			break
		default:
			fail()
	}
	// printState(regs, mem)
}

function printState(regs: bigint[], mem: number[]) {
	log('state', { regs, mem })
}

// printState()

function run(
	regs: bigint[],
	mem: number[],
	debug = false,
	expectedOut?: number[]
) {
	// let pc = 0

	let out: number[] = []

	if (debug) {
		log('run, regs:', regs, 'mem:', mem)
	}

	while (true) {
		let outLength = out.length
		let result = step(regs, mem, out)
		let outLengthAfter = out.length
		if (expectedOut) {
			if (outLengthAfter > outLength) {
				if (
					out[outLengthAfter - 1] !== expectedOut[outLengthAfter - 1]
				) {
					break
				}
			}
		}

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
	let regs = [0n, 0n, 9n, 0n]
	let mem = [2, 6]
	step(regs, mem)
	assert(regs[1], 1n)
}
// If register A contains 10, the program 5,0,5,1,5,4 would output 0,1,2.
{
	let regs = [10n, 0n, 0n, 0n]
	let mem = [5, 0, 5, 1, 5, 4]
	let out = run(regs, mem)
	assert(out, [0, 1, 2])
}
// If register A contains 2024, the program 0,1,5,4,3,0 would output 4,2,5,6,7,7,7,7,3,1,0 and leave 0 in register A.
{
	let regs = [2024n, 0n, 0n, 0n]
	let mem = [0, 1, 5, 4, 3, 0]
	let out = run(regs, mem)
	assert(out, [4, 2, 5, 6, 7, 7, 7, 7, 3, 1, 0])
	assert(regs[0], 0n)
}
// If register B contains 29, the program 1,7 would set register B to 26.
{
	let regs = [0n, 29n, 0n, 0n]
	let mem = [1, 7]
	step(regs, mem)
	assert(regs[1], 26n)
}
// If register B contains 2024 and register C contains 43690, the program 4,0 would set register B to 44354.
{
	let regs = [0n, 2024n, 43690n, 0n]
	let mem = [4, 0]
	step(regs, mem)
	assert(regs[1], 44354n)
}
{
	let regs = [80n, 3n, 0n, 0n]
	let mem = [6, 3] // bdv
	step(regs, mem)
	assert(regs[1], 80n / 2n ** 3n)
}
{
	let regs = [24n, 3n, 0n, 0n]
	let mem = [7, 3] // cdv
	step(regs, mem)
	assert(regs[2], 24n / 2n ** 3n)
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
	regsOrig[3] = 0n

	if (part === 1) {
		let out = run(regsOrig, memOrig)
		return out.join(',')
	}

	if (part === 2) {
		log('mem:', memOrig)
		log('program:\n' + disasm(memOrig))

		log('final expected', memOrig)

		function runWithA(a: bigint) {
			let regs = regsOrig.with(0, a)
			let mem = [...memOrig]
			return run(regs, mem, false)
		}

		// Program: 2,4,1,3,7,5,0,3,4,1,1,5,5,5,3,0

		// Assume that lowest 3 bits of A determine the last number of the output
		// Then A is shifted, so the last 3 x N bits determine the last N numbers
		function find(start: bigint, matchN: number): bigint {
			// log(`find ${start} match ${matchN}`)

			let a = start

			for (let i = 0n; i < 8n; i++) {
				let out = runWithA(a + i)
				let expected = out.slice(-matchN)
				if (equals(expected, memOrig.slice(-matchN))) {
					// log(`match ${matchN} with val ${a + i}`, out.slice(-matchN))
					if (matchN === memOrig.length) {
						return a + i
					} else {
						let result = find((a + i) * 8n, matchN + 1)
						if (result >= 0) {
							return result
						}
					}
				}
			}
			return -1n
		}

		let result = find(0n, 1)

		let out = runWithA(result)
		assert(out, memOrig)

		return result
	}
}

assert(solve(test), '4,6,3,5,6,3,5,2,1,0')
assert(solve(input), '1,5,0,5,2,0,1,3,5')

assert(solve(test2, 2), 117440n)
assert(solve(input, 2), 236581108670061n)

log('ok')
