import { log, timer } from './utils'

import { watch } from 'fs/promises'

async function buildAll() {
	using t = timer('build')

	let result = await Bun.build({
		entrypoints: [
			'./day1-1.ts',
			'./day1-2.ts',
			'./day2-1.ts',
			'./day2-2.ts',
			'./day3-1.ts',
			'./day3-2.ts',
			'./day4-1.ts',
			'./day4-2.ts',
			'./day4-with-utils.ts',
			'./day5.ts',
			'./day6.ts',
			'./day6-without-utils.ts',
			'./day7.ts',
			'./day8.ts',
			'./day9.ts',
			'./day10.ts',
			'./day11.ts',
		],
		outdir: './output',
	})

	if (!result.success) {
		log(result)
	} else {
		for (let output of result.outputs) {
			let path = output.path
			let file = require('path').relative(__dirname, path)
			log('[build] built', file)
		}
	}
}

await buildAll()

if (process.argv.find((arg) => arg === '--watch' || arg === '-w')) {
	let watcher = watch(import.meta.dir)

	log('[build] watching for changes')
	for await (let event of watcher) {
		let filename = event.filename
		if (filename) {
			if (filename.match(/^day.*ts$/)) {
				log('[build] file', event.filename, event.eventType)
				await buildAll()
			}
		}
	}
}
