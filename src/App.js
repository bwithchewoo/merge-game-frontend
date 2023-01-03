import React, {useState, useEffect} from 'react';
import Gameboard from './components/Gameboard';
import './App.css';


function App() {
  const [boards, setBoards] = useState([]);
  const [boardId, setBoardId] = useState(1);

  // runs when
  //  component loads
  //  'boards' changes

  // fetch data
  // setBoards (changes boards)
  useEffect(() => {
    fetch(`http://localhost:9292/boards`)
    .then((response) => response.json())
    .then((boardsData) => {
        setBoards(boardsData)
    })
  }, []);

  const changeBoardId = (newBoardId) => {
    setBoardId(newBoardId)
  }

  const boardsButtons = boards.map(
    (board) => { 
      if (boardId === board.id) {
        console.log("hi");
        return <button disabled={true} key={board.id} onClick={()=>{changeBoardId(board.id)}}>Board {board.id}</button>
      }
      else {
        return <button key={board.id} onClick={()=>{changeBoardId(board.id)}}>Board {board.id}</button>
      }
    }
  )

  const createNewBoard = () => {
    // create board in backend using post
    // setBoards with new board (...boards, newboard)
    fetch(`http://localhost:9292/boards`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({}),
    })
      .then((r) => r.json())
      .then((newBoard) => {
        setBoards([...boards, newBoard])
      })
  }
console.log(boardsButtons)
return (
  <div id="app">
    <div id="boards">
      {boardsButtons}
      <button onClick={() => createNewBoard()}>+</button>
    </div>
    Board {boardId}
    <Gameboard boardId={boardId}/>
  </div>
)
}

export default App;
