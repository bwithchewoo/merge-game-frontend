import React from 'react';
import Gameboard from './components/Gameboard';
import './App.css';


function App() {
/*   const container = document.getElementById("container");

function makeRows(rows, cols) {
  container.style.setProperty('--grid-rows', rows);
  container.style.setProperty('--grid-cols', cols);
  for(var i = 0; i < (rows * cols); i++) {
    let cell = document.createElement("div");
    cell.innerText = (i + 1);
    container.appendChild(cell).className = "grid-item";
  };
}; 

makeRows(16, 16); */
return (
  <div id="app">
    <Gameboard/>
  </div>
)
}

export default App;
