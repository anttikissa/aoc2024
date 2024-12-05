//
// Spec:
//
// 64 kB memory
// A few 16-bit registers (should be enough for most AoC problems?)
// Simple instruction layout (8-bit opcode, 8-bit target, 8-bit source, or similar)
// Start small, add instructions as needed
// Super simple IO (opcode to read stdin to memory location, opcode to print a number)
//

//
// How would a simple program look like:
// (Read input and print it out as numbers)
//
//   READ 0x1000    ; Read stdin to 0x1000, input length to A
//   MOV P, 0x1000  ; P points to start
//   MOV Q, 0x1000  ;
//   ADD Q, A       ; Add length (A) to Q; Q now points to end
// loop:            ;
//   MOV B, [P]     ; Read [P] to B (needs a different addressing mode)
//   PRN B          ; print B
//   INC P		    ; P++
//   CMP P, Q       ; Set "is equal" bit if P == Q
//   BNE loop       ; Go to 'loop' if not equal
//   HLT			; Stop
//

//
// Required instructions for now:
//
// NOP because why not
// READ <number 16> - read stdin to memory, writes length to A
// MOV <reg 8>, <number 16> - move value to register
// MOV <reg 8>, <reg 8> - move register (or some other value?)
// MOV <reg 8>, [number 16] - read memory to register
// ADD <reg 8>, <reg 8> - add two registers
// PRN <reg 8> - print register
// INC <reg 8> - increment register
// CMP <reg 8>, <reg 8> - compare two registers, set Z flag if equal, etc
// BNE <number 16> - branch if not equal
// HLT - stop
//
// Lots of addressing modes for MOV, should they have own names?
//

let instructions = {
	NOP: 0,
	READ: 1,
	MOV: 2,
	ADD: 3,
	PRN: 4,
	INC: 5,
	CMP: 6,
	BNE: 7,
	HLT: 8,
}

// TODO work on these
let addrModes = {
	imm16: 0 << 4,   // Immediate 16-bit value
	r8imm16: 1 << 4, // 8-bit register + 16 bit immediate
	r8r8: 2 << 4,    // 8-bit register + 8 bit register
	r8ind16: 3 << 4, // 8-bit register + content of 16-bit memory address
}

let registers = {
	A: 0,
	B: 1,
	C: 2,
	D: 3,
	// Leave some room for more data registers?

	SR: 7, // Status register (to be specified)
	// Registers from 8 onwards are used for relative memory addressing
	// If we have need for that later
	P: 8,
	Q: 9,
	PC: 10,
	SP: 11,
}

let mem = new Uint8Array(65536)

function asm(program: string) {
	// Hihii
}

function runVm() {
	function step() {
		// read instruction from pc
		// pc += 2
		// execute
		// ...
	}

	while (true) {
		step()
	}
}
