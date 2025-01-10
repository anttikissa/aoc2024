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

function solve(input: string, part2 = false) {
	let [part1, inputPart2] = input.split('\n\n')

	type Wire = [name: string, value: number]
	let wires1 = toLines(part1).map((line) => line.split(': ')) as Wire[]
	let gates1 = toLines(inputPart2).map((line) => line.split(' -> '))

	type Gate = { a: string; op: string; b: string; target: string }

	let swaps = [
		['z12', 'djg'],
		['z19', 'sbg'],
		['mcq', 'hjm'],
		['z37', 'dsd'],
	]
	// sbg
	// swaps = []

	// let connections = new Map<string, Gate[]>()

	let wires: Map<string, number> = new Map()
	for (let [name, value] of wires1) {
		wires.set(name, Number(value))
	}

	let gates: Gate[] = []

	let gatesByTarget = new Map<string, Gate>()

	// @ts-ignore
	for (let [fn, target] of gates1) {
		if (part2) {
			for (let swap of swaps) {
				let describe = fn + ' -> ' + target
				if (target === swap[0]) {
					// log('swap target', target, `(${describe}) to`, swap[1])
					target = swap[1]
				} else if (target === swap[1]) {
					// log('swap target', target, `(${describe}) to`, swap[0])
					target = swap[0]
				}
			}
		}

		let [a, op, b] = fn.split(' ')
		let gate = { a, op, b, target }
		gates.push(gate)
		gatesByTarget.set(target, gate)
	}

	// Gates connected to 'a'
	let as = Map.groupBy(gates, (gate) => gate.a)
	// Gates connected to 'b'
	let bs = Map.groupBy(gates, (gate) => gate.b)

	let parents = new Map<string, string[]>()
	for (let gate of gates) {
		let { a, b, target } = gate
		if (parents.has(target)) {
			parents.get(target)!.push(a, b)
		} else {
			parents.set(target, [a, b])
		}
	}

	// part2 && log('as', as)
	// part2 && log('bs', bs)
	// part2 && log('parents', parents)

	function findAncestors(name: string): string[] {
		if (!parents.has(name)) return []
		let directAncestors = parents.get(name)!
		// log('directs', directAncestors)
		return [...directAncestors.flatMap(findAncestors), ...directAncestors]
	}

	function setWire(name: string, value: number) {
		// part2 && log('setWire', name, value)
		wires.set(name, value)

		function handleGate(gate: Gate) {
			// log('setting gate', gate, { name, value })
			let a = wires.get(gate.a)
			if (typeof a !== 'number') {
				// part2 && log(`wire a not yet set: ${gate.a}`)
				return
			}
			let b = wires.get(gate.b)
			if (typeof b !== 'number') {
				// part2 && log(`wire b not yet set: ${gate.b}`)
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
			// if (part2) log('set gate target', gate)
		}

		let aGates = as.get(name)
		// part2 && log('setWire, handle gate a', aGates, name)
		// WHY UNDEFIEND
		if (aGates) {
			for (let gate of aGates) {
				handleGate(gate)
			}
		}
		let bGate = bs.get(name)
		// part2 && log('setWire, handle gate b', bGate, name)
		if (bGate) {
			for (let gate of bGate) {
				handleGate(gate)
			}
		}
	}

	function simulate() {
		for (let [name, value] of wires) {
			setWire(name, value)
		}
	}

	function getZ() {
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

	if (!part2) {
		simulate()

		return getZ()
	}

	if (part2) {
		log('PART 2')

		let xBits = 0
		let yBits = 0
		for (let wire of wires.keys()) {
			if (wire.startsWith('x')) {
				xBits = Math.max(xBits, parseInt(wire.slice(1)))
			}
			if (wire.startsWith('y')) {
				yBits = Math.max(yBits, parseInt(wire.slice(1)))
			}
		}
		log('Bits:', { xBits, yBits })
		function pad2(value: bigint | number) {
			let val = Number(value)
			return val.toString().padStart(2, '0')
		}

		function setX(value: number) {
			let val = BigInt(value)
			for (let i = 0n; i <= xBits; i++) {
				let name = 'x' + pad2(i)
				let bit = (val >> i) & 1n
				// wires.set(name, Number(bit))
				// log('x setWire', name, bit)
				setWire(name, Number(bit))
			}
		}

		function setY(value: number) {
			let val = BigInt(value)
			for (let i = 0n; i <= yBits; i++) {
				let name = 'y' + pad2(i)
				let bit = (val >> i) & 1n

				// wires.set(name, Number(bit))
				// log('y setWire', name, bit)
				setWire(name, Number(bit))
			}
		}

		// function getZ() {
		// 	let result = BigInt(0)
		//
		// 	for (let wire of wires.keys()) {
		// 		if (wire.startsWith('z')) {
		// 			log('wire', wire)
		// 			let bit = parseInt(wire.slice(1))
		// 			log('name', wire, 'bit', bit, ':', wires.get(wire))
		// 			result += BigInt(wires.get(wire)!) << BigInt(bit)
		// 		}
		// 	}
		// 	return Number(result)
		// }

		let faults = 0

		for (let i = 0; i < 45; i++) {
			let a = 2 ** i
			let b = 2 ** i
			setX(a)
			setY(b)
			let z = getZ()

			if (38 <= i && i <= 38) {
				function output(str: string) {
					// console.log(str)
					require('fs').appendFileSync(`file${i}.dot`, str + '\n')
				}

				log(`Printing graph ${i}. Clear file file${i}.dot`)
				require('fs').writeFileSync(`file${i}.dot`, '')

				function printNode(name: string) {
					let gate = gatesByTarget.get(name)
					let colors = {
						AND: 'red',
						OR: 'green',
						XOR: 'yellow',
					}
					if (gate) {
						// @ts-ignore
						let col = colors[gate.op] || 'white'
						let fc = col === 'red' ? 'white' : 'black'
						let shape = name.startsWith('z') ? 'circle' : 'square'
						let warn = name.startsWith('z') && gate.op !== 'XOR'
						let warning = warn ? 'WARNING!!! ' : ''
						output(
							`  ${name} [label="${warning}${name} = ${gate.a} ${gate.op} ${gate.b}", fillcolor=${col}, fontcolor=${fc}, style=filled, shape=${shape}];`
						)
					} else {
						output(`  ${name};`)
					}
				}
				function printGate(gate: Gate) {
					output(`  ${gate.a} -> ${gate.target};`)
					output(`  ${gate.b} -> ${gate.target};`)
				}

				let startNode = `z${pad2(i)}`
				let ancestors = findAncestors(startNode)
				let moreAncestors: string[] = []
				for (let ii = 0; ii < 5; ii++) {
					let startNode = `z${pad2(i - ii)}`
					moreAncestors = moreAncestors.concat(
						findAncestors(startNode)
					)
				}
				let ancSet = new Set([...ancestors, ...moreAncestors])
				ancestors = [...ancSet]
				if (ancestors.length !== ancSet.size) {
					log('Duplicate ancestors', ancestors)
				}
				function handle(ancestor: string) {
					printNode(ancestor)
					let gate = gatesByTarget.get(ancestor)
					if (gate) {
						printGate(gate)
					}
				}

				// log('Ancestors:', ancestors)
				output('digraph {')
				for (let ancestor of ancestors) {
					handle(ancestor)
				}
				let ii = i + 1
				while (ii--) {
					let node = `z${pad2(ii)}`
					// if (i === 25) {
					// 	log('!!! handle', node)
					// }
					handle(node)
				}
				output('}')
			}

			if (z !== a + b) {
				let zPrinted = z.toString(2)

				log(
					`i: detected fault around bit ${i + 1}, highest output bit ${zPrinted.length - 1}`,
					{
						a: a.toString(2),
						b: b.toString(2),
						z: z.toString(2),
					}
				)

				faults++
			}
		}

		if (faults === 0) {
			return swaps
				.flatMap((x) => x)
				.sort()
				.join(',')
		}
	}
}

assert(solve(test), 4)
assert(solve(test2), 2024)

{
	using perf = timer('input')
	assert(solve(input), 64755511006320)
}

{
	// assert(solve(test, true), 123)
	assert(solve(input, true), 'djg,dsd,hjm,mcq,sbg,z12,z19,z37')
}

log('ok')
