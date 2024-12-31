import input from './day24.txt'
import { assert, fail, log, timer, toLines } from './utils'

let test = `
x00: 1
x01: 1
x02: 1
y00: 0
y01: 1
y02: 0

x00 AND y00 -> z00
x01 XOR y01 -> z01
x02 OR y02 -> z02`

let test2 = `
x00: 1
x01: 0
x02: 1
x03: 1
x04: 0
y00: 1
y01: 1
y02: 1
y03: 1
y04: 1

ntg XOR fgs -> mjb
y02 OR x01 -> tnw
kwq OR kpj -> z05
x00 OR x03 -> fst
tgd XOR rvg -> z01
vdt OR tnw -> bfw
bfw AND frj -> z10
ffh OR nrd -> bqk
y00 AND y03 -> djm
y03 OR y00 -> psh
bqk OR frj -> z08
tnw OR fst -> frj
gnj AND tgd -> z11
bfw XOR mjb -> z00
x03 OR x00 -> vdt
gnj AND wpb -> z02
x04 AND y00 -> kjc
djm OR pbm -> qhw
nrd AND vdt -> hwm
kjc AND fst -> rvg
y04 OR y02 -> fgs
y01 AND x02 -> pbm
ntg OR kjc -> kwq
psh XOR fgs -> tgd
qhw XOR tgd -> z09
pbm OR djm -> kpj
x03 XOR y03 -> ffh
x00 XOR y04 -> ntg
bfw OR bqk -> z06
nrd XOR fgs -> wpb
frj XOR qhw -> z04
bqk OR frj -> z07
y03 OR x01 -> nrd
hwm AND bqk -> z03
tgd XOR rvg -> z12
tnw OR pbm -> gnj`

function solve(input: string) {
	let [part1, part2] = input.split('\n\n')

	type Wire = [name: string, value: number]
	let wires1 = toLines(part1).map((line) => line.split(': '))

	let gates1 = toLines(part2).map((line) => line.split(' -> '))

	type Gate = { a: string; op: string; b: string; target: string }

	let connections = new Map<string, Gate[]>()

	let wires: Map<string, number> = new Map()
	for (let [name, value] of wires1) {
		wires.set(name, Number(value))
	}

	let gates: Gate[] = []

	// @ts-ignore
	for (let [fn, target] of gates1) {
		let [a, op, b] = fn.split(' ')
		let gate = { a, op, b, target }
		log('gate', gate)
		gates.push(gate)
	}

	// Gates connected to 'a'
	let as = Map.groupBy(gates, (gate) => gate.a)
	// Gates connected to 'b'
	let bs = Map.groupBy(gates, (gate) => gate.b)
	log('as:', as)
	log('bs:', bs)

	log('wires', wires)
	// log('gates', gates)

	function simulate() {
		function setWire(name: string, value: number) {
			// log('setWire', name, value)
			wires.set(name, value)

			function handleGate(gate: Gate) {
				// log('setting gate', gate, { name, value })
				let a = wires.get(gate.a)
				if (typeof a !== 'number') {
					// log(`wire a not yet set: ${gate.a}`)
					return
				}
				let b = wires.get(gate.b)
				if (typeof b !== 'number') {
					// log(`wire b not yet set: ${gate.b}`)
					// queue.push([name, value])
					return
				}
				let result!: number
				switch (gate.op) {
					case 'AND':
						result = a & b
						break
					case 'OR':
						result = a | b
						break
					case 'XOR':
						result = a ^ b
						break
					default:
						fail()
				}
				setWire(gate.target, result)
			}

			let aGate = as.get(name)
			if (aGate) {
				for (let gate of aGate) {
					handleGate(gate)
				}
			}
			let bGate = bs.get(name)
			if (bGate) {
				for (let gate of bGate) {
					handleGate(gate)
				}
			}
		}
		for (let [name, value] of wires) {
			setWire(name, value)
		}
	}

	simulate()
	let result = 0

	for (let [name, value] of wires) {
		if (name.startsWith('z')) {
			let bit = parseInt(name.slice(1))
			// log('name', name, 'bit', bit, ':', value)
			result += value * 2 ** bit
		}
	}

	return result
}

assert(solve(test), 4)
assert(solve(test2), 2024)

{
	using perf = timer('input')
	assert(solve(input), 64755511006320)
}

log('ok')
