import rl from 'readline'

const readline = rl.createInterface({
  input: process.stdin,
  output: process.stdout
})

let log = console.log

let start = Date.now()
log(new Date(start).toISOString().replace('T', ' ').replace('Z', ''))

log('You can start reading the description now. Press enter when passed')

function pad2(n: number) {
	return n < 10 ? `0${n}` : n
}

readline.on('line', () => {
	let end = Date.now()
	log(new Date(end).toISOString().replace('T', ' ').replace('Z', ''))

	let time = end - start

	let ms = time % 1000 | 0
	time /= 1000

	let s = time % 60 | 0
	time /= 60

	let min = time % 60 | 0
	time /= 60

	let h = time | 0

//	log({ h, min, s, ms })

	log(`Total time: ${h}:${pad2(min)}:${pad2(s)}`)

	process.exit(0)
})
