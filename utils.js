"use strict";
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.directions = exports.diagonalDirections = exports.straightDirections = void 0;
exports.log = log;
exports.readFile = readFile;
exports.readLines = readLines;
exports.toLines = toLines;
exports.toGrid = toGrid;
exports.toNumbers = toNumbers;
exports.range = range;
exports.pairs = pairs;
exports.coords = coords;
exports.addVec = addVec;
exports.mulVec = mulVec;
exports.gridGet = gridGet;
exports.gridSet = gridSet;
exports.gridIsWithin = gridIsWithin;
var fs_1 = require("fs");
function log() {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
    }
    console.log.apply(console, args);
}
//
// Reading and parsing
//
function readFile(path) {
    return fs_1.default.readFileSync(path, 'utf8');
}
function readLines(path) {
    return fs_1.default.readFileSync(path, 'utf8').split('\n').filter(Boolean);
}
function toLines(file) {
    return file.split('\n').filter(Boolean);
}
function toGrid(map) {
    return map
        .trim()
        .split('\n')
        .map(function (line) { return line.trim().split(''); });
}
function toNumbers(line) {
    return line.split(/\s+/).map(Number);
}
function range(n, max) {
    if (typeof max === 'undefined') {
        return Array(n)
            .fill(0)
            .map(function (_, i) { return i; });
    }
    else {
        var min_1 = n;
        return Array(max - min_1 + 1)
            .fill(0)
            .map(function (_, i) { return i + min_1; });
    }
}
// pairs([1, 2, 3]) =>
//   [[1, 2], [1, 3], [1, 4],
//            [2, 3], [2, 4],
//                    [3, 4]]
function pairs(arr) {
    var result = [];
    for (var i = 0; i < arr.length; i++) {
        for (var j = i + 1; j < arr.length; j++) {
            result.push([arr[i], arr[j]]);
        }
    }
    return result;
}
exports.straightDirections = [
    [0, 1],
    [-1, 0],
    [0, -1],
    [1, 0],
];
exports.diagonalDirections = [
    [1, 1],
    [1, -1],
    [-1, -1],
    [-1, 1],
];
exports.directions = __spreadArray(__spreadArray([], exports.straightDirections, true), exports.diagonalDirections, true);
function coords(hOrGrid, w) {
    var _i, _a, i, _b, _c, j;
    var _d, _e;
    return __generator(this, function (_f) {
        switch (_f.label) {
            case 0:
                if (typeof hOrGrid !== 'number') {
                    w = (_e = (_d = hOrGrid[0]) === null || _d === void 0 ? void 0 : _d.length) !== null && _e !== void 0 ? _e : 0;
                    hOrGrid = hOrGrid.length;
                }
                if (w == null) {
                    throw new Error('missing w');
                }
                _i = 0, _a = range(hOrGrid);
                _f.label = 1;
            case 1:
                if (!(_i < _a.length)) return [3 /*break*/, 6];
                i = _a[_i];
                _b = 0, _c = range(w);
                _f.label = 2;
            case 2:
                if (!(_b < _c.length)) return [3 /*break*/, 5];
                j = _c[_b];
                return [4 /*yield*/, [i, j]];
            case 3:
                _f.sent();
                _f.label = 4;
            case 4:
                _b++;
                return [3 /*break*/, 2];
            case 5:
                _i++;
                return [3 /*break*/, 1];
            case 6: return [2 /*return*/];
        }
    });
}
function addVec(_a, _b) {
    var a = _a[0], b = _a[1];
    var c = _b[0], d = _b[1];
    return [a + c, b + d];
}
function mulVec(_a, x) {
    var a = _a[0], b = _a[1];
    return [a * x, b * x];
}
function gridGet(grid, _a) {
    var _b;
    var x = _a[0], y = _a[1];
    return ((_b = grid[y]) === null || _b === void 0 ? void 0 : _b[x]) || '.';
}
function gridSet(grid, _a, value) {
    var x = _a[0], y = _a[1];
    grid[y][x] = value;
}
function gridIsWithin(_a, grid) {
    var y = _a[0], x = _a[1];
    return y >= 0 && y < grid.length && x >= 0 && x < grid[0].length;
}
