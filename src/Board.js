import React, {Component, useEffect, useState} from "react";

function Board() {
    const [boards, setBoard] = useState([]);

    useEffect(() => {
        fetch('/api/board')
            .then((response) => response.json())
            .then((data) => {
                console.log(data);
                setBoard(data);
            })
            .catch((err) => {
                console.log(err.message);
            });
    },[]);

    return (
        <div className="board-container">
            {boards.map((board) => {
                return (
                    <div className="board-no" key={board.boardNo}>
                        <h2 className="board-title">{board.boardTitle}</h2>
                        <p className="board-views">{board.boardViews}</p>
                        <p className="board-insert-time">{board.insertTimestamp}</p>
                        <div className="button">
                            <div className="delete-btn">Delete</div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}

export default Board;