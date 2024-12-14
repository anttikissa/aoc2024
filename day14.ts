// @ts-ignore
import input from './day14.txt'
import { assert, coords, fail, log, type Vec2 } from './utils'

let testInput = `
p=0,4 v=3,-3
p=6,3 v=-1,-3
p=10,3 v=-1,2
p=2,0 v=2,-1
p=0,0 v=1,3
p=3,0 v=-2,-2
p=7,6 v=-1,-3
p=3,0 v=-1,-2
p=9,3 v=2,3
p=7,3 v=-1,2
p=2,4 v=2,-3
p=9,5 v=-3,-3
`

let test2 = `
p=2,4 v=2,-3
`

async function sleep(number: number) {
	return new Promise((resolve) => setTimeout(resolve, number))
}

async function solve(
	input: string,
	width: number,
	height: number,
	steps = 100,
	draw = false
) {
	let seconds = 0

	let lines = input.trim().split('\n')
	type Robot = { pos: Vec2; vel: Vec2 }
	let robots: Robot[] = []

	for (let line of lines) {
		// @ts-ignore
		let [_, ...matches] = line.match(/p=(.*),(.*) v=(.*),(.*)/)
		let [px, py, vx, vy] = matches.map(Number)
		let pos = [px, py] as Vec2
		let vel = [vx, vy] as Vec2

		robots.push({ pos, vel })
	}

	function step() {
		for (let robot of robots) {
			robot.pos[0] = (robot.pos[0] + robot.vel[0] + width) % width
			robot.pos[1] = (robot.pos[1] + robot.vel[1] + height) % height
		}
	}

	function visualize() {
		let out = '\n'
		for (let coord of coords(height, width)) {
			// log({ coord, width, height })
			// log({ robots })
			if (coord[0] === (width - 1) / 2 || coord[1] === (height - 1) / 2) {
				out += ' '
				if (coord[0] === width - 1) {
					out += '\n'
				}

				continue
			}
			let robot = robots.filter(
				(r) => r.pos[0] === coord[0] && r.pos[1] === coord[1]
			)
			assert(robot.length < 10)
			out += String(robot.length)

			if (coord[0] === width - 1) {
				out += '\n'
			}
		}
		// log(out)
		return out
	}

	let init = 100
	while (init--) {
		step()
		seconds++
	}

	while (steps--) {
		// log({ i })
		if (draw) {
			// log('\n\n\n')
			log('after', seconds, 'seconds:')
			let vis = visualize()
			if (vis.includes('11111')) {
				log(vis)
			}
			seconds++

			// log('\n\n\n')
		}
		step()
	}
	let quads = [0, 0, 0, 0]

	function count() {
		for (let robot of robots) {
			let hw = (width - 1) / 2
			let hh = (height - 1) / 2

			if (robot.pos[0] < hw && robot.pos[1] < hh) {
				quads[0]++
			} else if (robot.pos[0] > hw && robot.pos[1] < hh) {
				quads[1]++
			} else if (robot.pos[0] < hw && robot.pos[1] > hh) {
				quads[2]++
			} else if (robot.pos[0] > hw && robot.pos[1] > hh) {
				quads[3]++
			}
		}
	}

	visualize()
	count()
	let result = quads.reduce((acc, x) => acc * x)
	// log({ quads }, result)

	return result
}

// assert(await solve(testInput, 11, 7), 12)
// assert(await solve(input, 101, 103), 230172768)

await solve(input, 101, 103, 10000, true)
