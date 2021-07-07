const COLS = 10
const ROWS = 20
const CANVAS_WIDTH = 100
const CANVAS_HEIGHT = 200
const SQUARE_WIDTH = parseInt(CANVAS_WIDTH / COLS)
const SQUARE_HEIGHT = parseInt(CANVAS_HEIGHT / ROWS)
const COLORS = {
	cyan: "#00ffff",
	blue: "#0000ff",
	orange: "#ff7f00",
	yellow: "#ffff00",
	green: "#00ff00",
	purple: "#800080",
	red: "#ff0000"
}
const PIECES = [
	{
		shape: [	
			[0, 0, 0, 0],
			[1, 1, 1, 1],
			[0, 0, 0, 0],
			[0, 0, 0, 0]		
		],
		color: COLORS.cyan
	},
	{
		shape: [	
			[1, 0, 0],
			[1, 1, 1],
			[0, 0, 0]
		],
		color: COLORS.blue
	},
	{
		shape: [	
			[0, 0, 1],
			[1, 1, 1],
			[0, 0, 0]
		],
		color: COLORS.orange
	},
	{
		shape: [	
			[1, 1],
			[1, 1]		
		],
		color: COLORS.yellow
	},
	{
		shape: [	
			[0, 1, 1],
			[1, 1, 0],
			[0, 0, 0]
		],
		color: COLORS.green
	},
	{
		shape: [	
			[0, 1, 0],
			[1, 1, 1],
			[0, 0, 0]
		],
		color: COLORS.purple
	},
	{
		shape: [	
			[1, 1, 0],
			[0, 1, 1],
			[0, 0, 0]
		],
		color: COLORS.red
	}
]

let gameIsOver = false
let score = 0
let scoreP = document.getElementById("score")
let levelP = document.getElementById("level")
let delayP = document.getElementById("delay")
let totalLinesCompleted = 0
let level = 1
let dropDelay = 500

let currentPiece = {
	piece: null,
	pos: {
		row: null,
		col: null
	}
}

let board = []
for(let r = 0; r < ROWS; ++r) {
	board[r] = []
	for(let c = 0; c < COLS; ++c) {
		board[r][c] = 0
	}
}

createNewPiece()

function timer() {
	drop()
	setTimeout(timer, dropDelay)
}
setTimeout(timer, dropDelay)

document.addEventListener('keydown', keyPressed)
function keyPressed(e) {
	switch(e.code) {
		case "KeyA":
			moveLeft()
			break
		case "KeyD":
			moveRight()
			break
		case "KeyS":
			drop()
			break
		case "KeyQ":
			rotateCCW()
			break
		case "KeyE":
			rotateCW()
			break
		case "Space":
			fastDrop()
			break
	}
}


const mtranspose = m => m[0].map((val, colIndex) => m.map(row => row[colIndex]))
const mrotateCCW = m => mtranspose(m).reverse()
const mrotateCW = m => mtranspose(m.reverse())

function getRandRange(min, max) { return Math.floor(Math.random() * (max - min + 1) + min) }

function isInBoard(col, row) {
	if(col >= 0 && col < COLS && row >= 0 && row < ROWS) {
		return true
	} else {
		return false
	}
}

function addSquareWithBoundaryCheck(col, row) {
	if(isInBoard(col, row)) {
			board[row][col] = currentPiece.piece.color
	}
}


function addPieceToBoard() {
	for(let r = 0; r < currentPiece.piece.shape.length; ++r) {
		for(let c = 0; c < currentPiece.piece.shape[0].length; ++c) {
			if(currentPiece.piece.shape[r][c]) {
				addSquareWithBoundaryCheck(currentPiece.pos.col + c, currentPiece.pos.row + r)
			}
		}
	}
}

function computeScore() {
	if((totalLinesCompleted > 0) && (totalLinesCompleted <= 90)) {
		level = Math.floor(1 + ((totalLinesCompleted - 1) / 10))
	} else if( totalLinesCompleted > 90) {
		level = 10
	}
	
	dropDelay = ((11 - level) * 50)
}

function gameOver() {
	document.removeEventListener('keydown', keyPressed)
	gameIsOver = true
}

function createNewPiece() {
	let pieceIndex = getRandRange(0,PIECES.length - 1)
	
	currentPiece.piece = JSON.parse(JSON.stringify(PIECES[pieceIndex]))
	currentPiece.pos.col = Math.floor(COLS/2) - 1
	currentPiece.pos.row = 0
	
	if(pieceIndex === 0) {
		currentPiece.pos.col = Math.floor(COLS/2) - 2
		currentPiece.pos.row = -1
	}
	
	for(let r = 0; r < currentPiece.piece.shape.length; ++r) {
		for(let c = 0; c < currentPiece.piece.shape[0].length; ++c) {
			if(currentPiece.piece.shape[r][c]) {
				if(board[currentPiece.pos.row + r][currentPiece.pos.col + c]) {
					gameOver()
				}
			}
		}
	}
}

function moveLeft() {
	for(let r = 0; r < currentPiece.piece.shape.length; ++r) {
		for(let c = 0; c < currentPiece.piece.shape[0].length; ++c) {
			if(currentPiece.piece.shape[r][c]) {
				if(((currentPiece.pos.col + c) === 0) || board[currentPiece.pos.row + r][currentPiece.pos.col + c - 1]) {
					return false
				}
			}
		}
	}
	--currentPiece.pos.col
	return true
}

function moveRight() {
	for(let r = 0; r < currentPiece.piece.shape.length; ++r) {
		for(let c = 0; c < currentPiece.piece.shape[0].length; ++c) {
			if(currentPiece.piece.shape[r][c]) {
				if(((currentPiece.pos.col + c) === COLS - 1) || board[currentPiece.pos.row + r][currentPiece.pos.col + c + 1]) {
					return false
				}
			}
		}
	}
	++currentPiece.pos.col
	return true
}

function rotateCW() {
	currentPiece.piece.shape = mrotateCW(currentPiece.piece.shape)
	for(let r = 0; r < currentPiece.piece.shape.length; ++r) {
		for(let c = 0; c < currentPiece.piece.shape[0].length; ++c) {
			if(currentPiece.piece.shape[r][c]) {
				if(!isInBoard(currentPiece.pos.col + c, currentPiece.pos.row + r) || board[currentPiece.pos.row + r][currentPiece.pos.col + c]) {
					currentPiece.piece.shape = mrotateCCW(currentPiece.piece.shape)
					return false
				}
			}
		}
	}
	return true
}

function rotateCCW() {
	currentPiece.piece.shape = mrotateCCW(currentPiece.piece.shape)
	for(let r = 0; r < currentPiece.piece.shape.length; ++r) {
		for(let c = 0; c < currentPiece.piece.shape[0].length; ++c) {
			if(currentPiece.piece.shape[r][c]) {
				if(!isInBoard(currentPiece.pos.col + c, currentPiece.pos.row + r) || board[currentPiece.pos.row + r][currentPiece.pos.col + c]) {
					currentPiece.piece.shape = mrotateCW(currentPiece.piece.shape)
					return false
				}
			}
		}
	}
	return true
}

function fastDrop() {
	while(drop()) {}
}

function drop() {
	for(let r = 0; r < currentPiece.piece.shape.length; ++r) {
		for(let c = 0; c < currentPiece.piece.shape[0].length; ++c) {
			if(currentPiece.piece.shape[r][c]) {
				if(((currentPiece.pos.row + r) === ROWS - 1) || board[currentPiece.pos.row + r + 1][currentPiece.pos.col + c]) {
					addPieceToBoard()
					clearRows()
					createNewPiece()
					return false
				}
			}
		}
	}
	++currentPiece.pos.row
	return true
}

// recursive, less efficient
/*
function clearRows(start = (ROWS-1)) {
	for(let r = start; r >= 0; --r) {
		if(!board[r].includes(0)) {
			for(let i = r; i > 0; --i) {
				board[i] = board[i-1]
			}
			board[0].fill(0)
			clearRows(r)
			break;
		}
	}
}
*/

function clearRows() {
	let rowsToClear = []
	for(let r = ROWS - 1; r >= 0; --r) {
		if(!board[r].includes(0)) {
			rowsToClear.push(r)
			if(rowsToClear.length === 4) break
		}
	}
	
	if(rowsToClear) {
		for(let r = rowsToClear[0]; r > rowsToClear.length - 1; --r) {
			board[r] = board[r - rowsToClear.length]
		}
		for(let r = 0; r < rowsToClear.length; ++r) {
			board[r].fill(0)
		}
	}
	
	switch(rowsToClear.length) {
		case 1: 
			score += 40 
			break
		case 2: 
			score += 100
			break
		case 3:
			score += 300
			break
		case 4:
			score += 1200
			break
	}
	
	totalLinesCompleted += rowsToClear.length
}


function init() {
	window.requestAnimationFrame(draw)
}

const draw = () => {
	var cv = document.getElementById('cv');
	
	if (cv.getContext) {
		var ctx = cv.getContext('2d');
				
		const drawBoard = () => {
			for(let r = 0; r < ROWS; ++r) {
				for(let c = 0; c < COLS; ++c) {
					if(board[r][c]) {
						ctx.fillStyle = board[r][c]
					} else {
						ctx.fillStyle = "black"
					}
					ctx.fillRect(c * SQUARE_WIDTH, r * SQUARE_HEIGHT, SQUARE_WIDTH, SQUARE_HEIGHT)
					ctx.strokeStyle = "rgba(0,0,0,0.5)"
					ctx.strokeRect(c * SQUARE_WIDTH, r * SQUARE_HEIGHT, SQUARE_WIDTH, SQUARE_HEIGHT)
				}
			}
		}
		
		const drawCurrentPiece = () => {
			ctx.fillStyle = currentPiece.piece.color
			for(let r = 0; r < currentPiece.piece.shape.length; ++r) {
				for(let c = 0; c < currentPiece.piece.shape[0].length; ++c) {
					if(currentPiece.piece.shape[r][c] && isInBoard(c + currentPiece.pos.col, r + currentPiece.pos.row)) {
						ctx.fillRect((c+currentPiece.pos.col) * SQUARE_WIDTH, (r + currentPiece.pos.row) * SQUARE_HEIGHT, SQUARE_WIDTH, SQUARE_HEIGHT)
						ctx.strokeStyle = "rgba(0,0,0,0.5)"
						ctx.strokeRect((c+currentPiece.pos.col) * SQUARE_WIDTH, (r + currentPiece.pos.row) * SQUARE_HEIGHT, SQUARE_WIDTH, SQUARE_HEIGHT)
					}
				}
			}				
		}
		
		ctx.fillStyle = "black"
		ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)
			
		drawBoard()
		drawCurrentPiece()
		computeScore()
		
		if(gameIsOver) {
			scoreP.innerHTML = "Game over! Score: " + score
		} else {
			scoreP.innerHTML = "Score: " + score
			levelP.innerHTML = "Level: " + level
			delayP.innerHTML = "Delay: " + dropDelay + " ms"
		}
		
		if(!gameIsOver) window.requestAnimationFrame(draw)
	}
}