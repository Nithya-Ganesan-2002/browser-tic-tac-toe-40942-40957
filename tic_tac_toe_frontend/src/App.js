import React, { useState, useEffect } from 'react';
import './App.css';

/**
 * Minimalistic two-player Tic Tac Toe Game using React
 * Features: 3x3 grid, two player support, game state, winner/draw display, reset
 * Theme: Light, minimalistic. Colors: primary: #1976d2, secondary: #2196f3, accent: #ffeb3b
 */

// Color palette as per requirement:
const PRIMARY = '#1976d2';
const SECONDARY = '#2196f3';
const ACCENT = '#ffeb3b';

// Utility function to check for a winner in the current board
// PUBLIC_INTERFACE
function calculateWinner(squares) {
  /**
   * Calculates if there is a winner.
   * Returns an object: { winner: 'X'|'O', line: [idx, idx, idx] } or null if no winner yet.
   */
  const lines = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
    [0, 4, 8], [2, 4, 6],            // diagonals
  ];
  for (let i = 0; i < lines.length; i += 1) {
    const [a, b, c] = lines[i];
    if (
      squares[a] &&
      squares[a] === squares[b] &&
      squares[a] === squares[c]
    ) {
      return { winner: squares[a], line: [a, b, c] };
    }
  }
  return null;
}

// PUBLIC_INTERFACE
function App() {
  // Board is array of 9 slots: null, 'X', or 'O'
  const [board, setBoard] = useState(Array(9).fill(null));
  // Player turn: true = X, false = O
  const [xIsNext, setXIsNext] = useState(true);
  // Winner/draw
  const [winnerInfo, setWinnerInfo] = useState(null);
  const [isDraw, setIsDraw] = useState(false);

  // Set light theme CSS var on mount (per requirements)
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', 'light');
  }, []);

  // Check for winner/draw after each move
  useEffect(() => {
    const win = calculateWinner(board);
    setWinnerInfo(win);
    // Draw: all filled & no winner
    setIsDraw(!win && board.every(Boolean));
  }, [board]);

  // PUBLIC_INTERFACE
  function handleSquareClick(idx) {
    /**
     * Handles a board square being clicked.
     * Applies move if game ongoing (no winner/draw, and square empty).
     */
    if (board[idx] || winnerInfo || isDraw) return;
    const nextBoard = board.slice();
    nextBoard[idx] = xIsNext ? 'X' : 'O';
    setBoard(nextBoard);
    setXIsNext(!xIsNext);
  }

  // PUBLIC_INTERFACE
  function handleReset() {
    /**
     * Resets the game state to initial values.
     */
    setBoard(Array(9).fill(null));
    setXIsNext(true);
    setWinnerInfo(null);
    setIsDraw(false);
  }

  // Get game status message
  let statusMsg;
  if (winnerInfo) {
    statusMsg = `Winner: ${winnerInfo.winner}`;
  } else if (isDraw) {
    statusMsg = "Draw! Nobody wins.";
  } else {
    statusMsg = `Next turn: ${xIsNext ? "X" : "O"}`;
  }

  // Helper: get CSS for board cell
  function getCellStyle(idx) {
    let style = {
      border: `2px solid ${SECONDARY}`,
      width: "68px",
      height: "68px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: "2.2rem",
      fontWeight: 500,
      color: board[idx] === 'X' ? PRIMARY : board[idx] === 'O' ? SECONDARY : "#222",
      background: "#fff",
      cursor: board[idx] || winnerInfo || isDraw ? "not-allowed" : "pointer",
      transition: "background .15s, color .15s"
    };
    if (winnerInfo && winnerInfo.line.includes(idx)) {
      style.background = ACCENT;
      style.color = "#1a1a1a";
    }
    return style;
  }

  // Inline minimal styles for layout, theme, and accenting per requirements
  return (
    <div
      className="App"
      style={{
        minHeight: "100vh",
        background: "#f6f8fb",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
      }}
    >
      {/* Header */}
      <header
        style={{
          marginTop: "56px",
          marginBottom: "24px",
          color: PRIMARY,
          fontWeight: 600,
          fontSize: "2.4rem",
          letterSpacing: ".01em",
        }}
      >
        Tic Tac Toe
      </header>

      {/* Center game + controls */}
      <main
        style={{
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {/* Game board */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 68px)",
            gridTemplateRows: "repeat(3, 68px)",
            gap: "0",
            background: "#fff",
            borderRadius: "16px",
            boxShadow: "0 3px 16px 0 rgba(30,40,100,0.08)",
            margin: "0 auto",
          }}
          aria-label="tic tac toe board"
          tabIndex={0}
        >
          {board.map((val, idx) => (
            <button
              key={idx}
              onClick={() => handleSquareClick(idx)}
              aria-label={`cell ${idx % 3 + 1},${Math.floor(idx / 3) + 1}`}
              style={getCellStyle(idx)}
              disabled={!!board[idx] || !!winnerInfo || isDraw}
              tabIndex={0}
            >
              {val}
            </button>
          ))}
        </div>
        {/* Game status and controls */}
        <div style={{ marginTop: "28px" }}>
          <div
            style={{
              fontSize: "1.25rem",
              fontWeight: 500,
              color: winnerInfo ? PRIMARY : isDraw ? SECONDARY : "#212121",
              minHeight: "2.2em",
              letterSpacing: "0.01em"
            }}
            aria-live="polite"
          >
            {statusMsg}
          </div>
          <button
            onClick={handleReset}
            style={{
              marginTop: "18px",
              background: PRIMARY,
              color: "#fff",
              border: 0,
              borderRadius: "9px",
              padding: "10px 30px",
              fontSize: "1rem",
              fontWeight: 500,
              cursor: "pointer",
              letterSpacing: "0.01em",
              boxShadow: "0 1px 6px rgba(25, 118, 210, 0.1)",
              outline: "none",
              transition: "background .16s",
            }}
            aria-label="Reset Game"
            tabIndex={0}
          >
            Reset
          </button>
        </div>
      </main>

      {/* Footer */}
      <footer
        style={{
          marginTop: "3.5rem",
          marginBottom: "30px",
          fontSize: "1rem",
          fontWeight: 400,
          color: "#9e9e9e",
          letterSpacing: "0.01em",
          textAlign: "center"
        }}
      >
        <span style={{ color: PRIMARY, fontWeight: 600 }}>Tic Tac Toe </span>
        — Minimalistic React | <span style={{ color: ACCENT }}>@kavia</span>
      </footer>
    </div>
  );
}

export default App;
