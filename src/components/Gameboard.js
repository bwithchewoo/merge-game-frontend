import React, { useState, useRef, useEffect } from 'react';
import './Gameboard.css';
import Button from './Button';
const horizontalAxis = [0, 1, 2, 3, 4, 5, 6, 7]
const verticalAxis = [0, 1, 2, 3, 4, 5, 6, 7]
export default function Gameboard() {
    const [tokens, setTokens] = useState([]);
    const [gridX, setGridX] = useState(0);
    const [gridY, setGridY] = useState(0);
    const [activePiece, setActivePiece] = useState(null);
    const [boardId, setBoardId] = useState(1);
    const initialBoardState = [];
    
    useEffect(() => {
        fetch(`http://localhost:9292/tokens/${boardId}`)
        .then((response) => response.json())
        .then((data) => {
            setTokens(data)
        })
    }, [boardId]);

    const changeBoardId = (e) => {
        if (e.target.id === "board 1"){
            setBoardId(1)}
        else if (e.target.id === "board 2"){
            setBoardId(2)
        }
    }

    const findMatchingTokenIndex = (horizontalPos, verticalPos) => { 
        for (let k = 0; k < tokens.length; k++) {
            if (tokens[k].horizontal === horizontalPos && tokens[k].vertical === verticalPos) {
                return k;
            }
        }
        return -1;
    }
    for (let j = verticalAxis.length - 1; j >= 0; j--) {
        for (let i = 0; i < horizontalAxis.length; i++) {
            if (findMatchingTokenIndex(horizontalAxis[i], verticalAxis[j]) !== -1) {
                initialBoardState.push(<div className='tile' key={`${j}, ${i}`}><div className='token'>{tokens[findMatchingTokenIndex(horizontalAxis[i], verticalAxis[j])].token_value}</div></div>)
            }
            else {
                initialBoardState.push(<div className='tile' key={`${j}, ${i}`}></div>)
            }
        }
    }
    
    const chessboardRef = useRef(null)
    function grabPiece(e){
        const chessboard = chessboardRef.current;
        if(e.target.className === "token" && chessboard){
            setGridX(Math.floor((e.clientX - chessboard.offsetLeft) / 100));
            setGridY(Math.abs(Math.floor((e.clientY - chessboard.offsetTop) / 100 - 7)));
            const x = e.clientX - 5
            const y = e.clientY - 60
            e.target.style.position = "absolute";
            e.target.style.left = `${x}px`
            e.target.style.top = `${y}px`
            setActivePiece(e.target);
        }
    }

    function movePiece(e){
        const chessboard = chessboardRef.current;
        if(activePiece && chessboard){
            const minX = chessboard.offsetLeft + 5;
            const minY = chessboard.offsetTop - 40;
            const maxX = chessboard.offsetLeft + chessboard.clientWidth - 10;
            const maxY = chessboard.offsetTop + chessboard.clientHeight - 65;
            const x = e.clientX - 5
            const y = e.clientY - 60
        activePiece.style.position = "absolute";
        if(x < minX){
            activePiece.style.left = `${minX}px`
        }
        else if(x > maxX) {
            activePiece.style.left = `${maxX}px`
        } else {
            activePiece.style.left = `${x}px`
        }
        if (y < minY) {
            activePiece.style.top = `${minY}px`
        } 
        else if (y > maxY){
            activePiece.style.top = `${maxY}px`
        }
        else {
            activePiece.style.top = `${y}px`
        }
        }
    }

    function dropPiece(e) {
        const chessboard = chessboardRef.current;
        if (activePiece && chessboard) {
            const x = Math.floor((e.clientX - chessboard.offsetLeft) / 100);
            const y = Math.abs(Math.floor((e.clientY - chessboard.offsetTop) / 100 - 7));
            const indexOfActivePiece = findMatchingTokenIndex(horizontalAxis[gridX], verticalAxis[gridY])
            const indexOfMatchTarget = findMatchingTokenIndex(horizontalAxis[x], verticalAxis[y])
            const activePieceToken = tokens[indexOfActivePiece]
            const matchTargetToken = indexOfMatchTarget !== -1 ? tokens[indexOfMatchTarget] : null;
            const resetActivePiece = () => {
                activePiece.style.position = '';
                activePiece.style.left = '';
                activePiece.style.top = '';
                setActivePiece(null);
            }
            if (x === gridX && y === gridY) {
                resetActivePiece();
                return;
            }
            else if (matchTargetToken && activePieceToken.token_value !== matchTargetToken.token_value)
            {
                resetActivePiece();
                return;
            }
            // Dropping piece into empty tile
            if (!matchTargetToken) {
                setTokens(value => {
                    const pieces = value.map(p => {
                        if (p.horizontal === gridX && p.vertical === gridY) {
                            p.horizontal = x;
                            p.vertical = y;
                        }
                        return p;
                    })
                    return pieces;
                })
                fetch(`http://localhost:9292/tokens/${activePieceToken.id}`, {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        horizontal: x,
                        vertical: y,
                        token_value: activePieceToken.token_value,
                    }),
                })
                setActivePiece(null);
            }
           else {
                const newTokens = tokens.filter(token => {
                    if (token.horizontal === gridX && token.vertical === gridY) {
                        return false;
                    } 
                    return true;
                })
                fetch(`http://localhost:9292/tokens/${activePieceToken.id}`, {
                    method: "DELETE",
                })
                setTokens(newTokens.map(p => {
                    if (p.horizontal === x && p.vertical === y) {
                        p.token_value += 1;
                    }
                    return p;
                }));
                fetch(`http://localhost:9292/tokens/${matchTargetToken.id}`, {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        horizontal: x,
                        vertical: y,
                        token_value: (matchTargetToken.token_value),
                    }),
                })
                setActivePiece(null);
            }
        }
    }
  
    function generateToken(){
        for (let j = verticalAxis.length - 1; j >= 0; j--) {
            for (let i = 0; i < horizontalAxis.length; i++) {
                if(findMatchingTokenIndex(horizontalAxis[i], verticalAxis[j]) === -1){
                    fetch(`http://localhost:9292/tokens`, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({token_value: 1, horizontal: horizontalAxis[i], vertical: verticalAxis[j], board_id: boardId}),
                    })
                        .then((r) => r.json())
                        .then((actualResult) => 
                        setTokens([...tokens, actualResult]))
                    return
                }
            }
        }
        return alert("There are no empty tiles.")
    }
    return (
    <div>
        <button id="board 1" onClick={changeBoardId}> Board 1</button>
        <button id="board 2" onClick={changeBoardId}>Board 2</button>
        <div onMouseUp={(e) => dropPiece(e)}onMouseMove={(e) => movePiece(e)}onMouseDown={e => grabPiece(e)} id="chessboard" ref={chessboardRef}>{initialBoardState}</div>
        <Button generateToken={generateToken}/>
    </div>
    )
}