"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var utils_ts_1 = require("./utils.ts");
var input = (0, utils_ts_1.readFile)('day6.txt');
if (1) {
    input = "\n....#.....\n.........#\n..........\n..#.......\n.......#..\n..........\n.#..^.....\n........#.\n#.........\n......#...";
}
var origGrid = (0, utils_ts_1.toGrid)(input);
function printGrid(grid) {
    (0, utils_ts_1.log)('grid\n' + grid.map(function (row) { return row.join(''); }).join('\n'));
}
printGrid(origGrid);
var origGuardPos = (0, utils_ts_1.coords)(origGrid).find(function (_a) {
    var x = _a[0], y = _a[1];
    return origGrid[y][x] === '^';
});
var guardPos = origGuardPos;
(0, utils_ts_1.log)('guardPos', guardPos);
var dirs = [
    [0, -1],
    [1, 0],
    [0, 1],
    [-1, 0],
];
var currentDir = 0;
var previousDirs = new Map();
function clearPreviousDirs() {
    previousDirs.clear();
}
function step(grid) {
    (0, utils_ts_1.gridSet)(grid, guardPos, 'X');
    previousDirs.set(guardPos.join(','), dirs[currentDir]);
    var nextPos = (0, utils_ts_1.addVec)(guardPos, dirs[currentDir]);
    if (!(0, utils_ts_1.gridIsWithin)(nextPos, grid)) {
        return true;
    }
    if ((0, utils_ts_1.gridGet)(grid, nextPos) === '#') {
        currentDir = (currentDir + 1) % 4;
    }
    else {
        guardPos = nextPos;
        if ((0, utils_ts_1.gridGet)(grid, guardPos) === 'X') {
            (0, utils_ts_1.log)('check for loop at', guardPos);
            printGrid(grid);
            var prevDir = previousDirs.get(guardPos.join(','));
            if (prevDir) {
                (0, utils_ts_1.log)('there was prev dir', prevDir);
            }
            if (previousDirs.get(guardPos.join(',')) === dirs[currentDir]) {
                (0, utils_ts_1.log)('loop at', guardPos);
                // we've been here before in the same direction
                return 'loop';
            }
        }
    }
    return false;
}
// Part 1
var finished = false;
while (!finished) {
    finished = step(origGrid);
}
var result = 0;
for (var _i = 0, _a = (0, utils_ts_1.coords)(origGrid); _i < _a.length; _i++) {
    var coord = _a[_i];
    if ((0, utils_ts_1.gridGet)(origGrid, coord) === 'X') {
        result++;
    }
}
(0, utils_ts_1.log)('part 1', result);
// Part 2
function copyGrid(grid) {
    return grid.map(function (row) { return row.slice(); });
}
function placeObstruction(grid, pos) {
    (0, utils_ts_1.gridSet)(grid, pos, '#');
}
function checkLoop(grid) {
    clearPreviousDirs();
    guardPos = origGuardPos;
    var finished = false;
    while (!finished) {
        finished = step(grid);
    }
    return finished === 'loop';
}
var result2 = 0;
for (var _b = 0, _c = [[3, 6]]; _b < _c.length; _b++) {
    var coord = _c[_b];
    // for (let coord of coords(origGrid)) {
    var copy = copyGrid(origGrid);
    placeObstruction(copy, coord);
    if (checkLoop(copy)) {
        (0, utils_ts_1.log)('loop at', coord);
        result2++;
    }
}
(0, utils_ts_1.log)('part 2', result2);
