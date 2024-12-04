import { coords, readFile, readLines, toGrid } from './utils.ts'

let log = console.log

let grid: string[][] = toGrid(readFile('day4.txt'))

let test = `
.M.S......
..A..MSMS.
.M.S.MAA..
..A.ASMSM.
.M.S.M....
..........
S.S.S.S.S.
.A.A.A.A..
M.M.M.M.M.
..........`

grid = toGrid(test)

let h = grid.length
let w = grid[0].length

for (let coord of coords(h, w)) {
	log('coord', coord)
}
