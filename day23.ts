import input from './day23.txt'
import { assert, cache, fail, log, max, pairs, range, timer } from './utils'

let test = `
kh-tc
qp-kh
de-cg
ka-co
yn-aq
qp-ub
cg-tb
vc-aq
tb-ka
wh-tc
yn-cg
kh-ub
ta-co
de-co
tc-td
tb-wq
wh-td
ta-ka
td-qp
aq-cg
wq-ub
ub-vc
de-ta
wq-aq
wq-vc
wh-yn
ka-de
kh-ta
co-tc
wh-qp
tb-vc
td-yn`

function solve(input: string, part: 1 | 2 = 1) {
	let lines = input.trim().split('\n')
	let computerPairs = lines.map((line) => line.split('-'))
	let nodes = new Set<string>()
	let connections = new Map<string, string[]>()

	function addConnection(a: string, b: string) {
		if (connections.has(a)) {
			connections.get(a)!.push(b)
		} else {
			connections.set(a, [b])
		}
	}

	for (let pair of computerPairs) {
		nodes.add(pair[0])
		nodes.add(pair[1])
		addConnection(pair[0], pair[1])
		addConnection(pair[1], pair[0])
	}

	function isConnected(x: string, y: string) {
		return connections.get(x)?.includes(y)
	}

	let startsWithT = [...nodes].filter((node) => node.startsWith('t'))

	let results = new Set<string>()

	if (part === 1) {
		for (let node of startsWithT) {
			let connected = connections.get(node)!
			for (let [x, y] of pairs(connected)) {
				if (isConnected(x, y)) {
					results.add([node, x, y].sort().join(','))
				}
			}
		}

		return results.size
	}

	if (part === 2) {
		function findLargestClique(): string[] {
			// Convert nodes set to array for easier manipulation
			const nodeArray = Array.from(nodes)
			let maxClique: string[] = []

			// Helper function for Bron-Kerbosch algorithm with pivoting
			function bronKerbosch(R: string[], P: string[], X: string[]) {
				if (P.length === 0 && X.length === 0) {
					// Found a maximal clique
					if (R.length > maxClique.length) {
						maxClique = [...R]
					}
					return
				}

				// Choose pivot vertex
				const union = [...P, ...X]
				const pivot = union[0]
				const pivotConnections = connections.get(pivot) || []

				// For each vertex in P that's not connected to pivot
				for (const v of P) {
					if (!pivotConnections.includes(v)) {
						const neighbors = connections.get(v) || []

						// Recursive call with updated sets
						bronKerbosch(
							[...R, v],
							P.filter((n) => neighbors.includes(n)),
							X.filter((n) => neighbors.includes(n))
						)

						// Move vertex to X
						P = P.filter((n) => n !== v)
						X = [...X, v]
					}
				}
			}

			// Initialize sets for Bron-Kerbosch algorithm
			bronKerbosch([], nodeArray, [])

			return maxClique
		}

		const largestClique = findLargestClique()

		return largestClique.sort().join(',')
	}
}

assert(solve(test), 7)
assert(solve(input), 1302)

assert(solve(test, 2), 'co,de,ka,ta')
assert(solve(input, 2), 'cb,df,fo,ho,kk,nw,ox,pq,rt,sf,tq,wi,xz')

log('ok')
