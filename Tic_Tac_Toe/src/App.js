import { useState } from "react";

// 判胜算法（查字典）
import { calculateWinner } from "./utils/calculateWinner"

// 棋子
function Square({ value, index, onSquareClick }) { 
  return (
    <button className={"square square" + index} onClick={onSquareClick}>
      {value}
    </button>
  );
}

// 棋盘
function Board({ xIsNext, squares, move, onPlay }) {
  // 游戏结果判断
  const { winner, result } = calculateWinner(squares);
  let status;
  if (winner) { // 胜利
    status = "Winner: " + winner;
    result.forEach((item) => {
      const el = document.getElementsByClassName("square" + item);
      el[0].classList.add("win");
    });
  } else if (!winner && move === 9) { // 平局
    status = "The game ended in a draw !!!";
  } else { // 进行中
    status = "Next player: " + (xIsNext ? "X" : "O");
  }

  // 点击棋子
  function handleClick(i) {
    const { winner } = calculateWinner(squares);
    if (squares[i] || winner) {
      return;
    }

    const nextSquares = squares.slice();

    if (xIsNext) {
      nextSquares[i] = "X";
    } else {
      nextSquares[i] = "O";
    }

    onPlay(nextSquares, i);
  }

  // 棋盘渲染
  const checkerboard = [];
  const checkerboard_num = 3;
  for (let i = 0; i < checkerboard_num; i++) {
    let temp = [];
    for (let j = 0; j < checkerboard_num; j++) {
      temp.push(
        <Square
          key={j}
          value={squares[i * 3 + j]}
          index={i * 3 + j}
          onSquareClick={() => handleClick(i * 3 + j)}
        />
      );
    }
    checkerboard.push(
      <div className="board-row" key={i}>
        {temp}
      </div>
    );
  }

  return (
    <>
      <div className="status">{status}</div>
      {checkerboard}
    </>
  );
}

// 游戏主程
export default function Game() {
  const [history, setHistory] = useState([Array(9).fill(null)]); // 历史记录
  const [currentMove, setCurrentMove] = useState(0); // 当前所在步数
  const [location, setLocation] = useState([]); // 当前下棋的位置
  const [isRev, setIsRev] = useState(false); // 升序/倒序步骤的展示列表
  const xIsNext = currentMove % 2 === 0; // X or O
  const currentSquares = history[currentMove]; // 当前记录

  // 处理游玩相关
  function handlePlay(nextSquares, index) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    const nextLocation = [...location.slice(0, currentMove), "(" + parseInt(index / 3, 10) + "," + (index % 3) + ")"]

    setHistory(nextHistory);
    setLocation(nextLocation);
    setCurrentMove(nextHistory.length - 1);
  }

  // 回退至某一步
  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }

  // 渲染：历史列表
  const moves = history.map((squares, move) => {
    let description;
    console.log(location);
    if (move > 0) {
      description = "Go to move #" + move + " " + location[move - 1];
    } else {
      description = "Go to game start";
    }

    return (
      <li key={move}>
        <button onClick={() => jumpTo(move)}>{description}</button>
      </li>
    );
  });

  return (
    <div className="game">
      <div className="game-board">
        <Board
          xIsNext={xIsNext}
          squares={currentSquares}
          move={currentMove}
          onPlay={handlePlay}
        />
      </div>
      <div className="game-info">
        <button onClick={() => setIsRev(false)}>升序</button>
        <button onClick={() => setIsRev(true)}>倒序</button>
        <ol>{isRev ? moves.reverse() : moves}</ol>
      </div>
    </div>
  );
}


// 重写 Board 以使用两个循环来制作方块而不是对它们进行硬编码。
// 添加一个切换按钮，使可以按升序或降序对落子的步数进行排序。
// 当有人获胜时，突出显示致使获胜的三个方块（当没有人获胜时，显示一条关于结果为平局的消息）。
// 在“落子”的历史列表中以 (row, col) 格式显示每步的位置。