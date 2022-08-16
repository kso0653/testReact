import React, {Component, useEffect, useState } from "react";
import "/Users/kso0654/ReactProject/boarduk/src/css/board.css";
// import "C:/Users/study/testReact/src/css/board.css";
import {Route, Router, Routes} from "react-router";
import { Link } from 'react-router-dom';
import board from "./Board";

function BoardDetail({match}) {
    const [board, setBoard] = useState({});

    useEffect(() => {
        // fetch(`/api/board/${boards.boardNo}`)
        fetch(`/api/board/${match.params.boardNo}`)
            .then((response) => response.json())
            .then((data) => {
                console.log(data);
                setBoard(data);
                console.log(board);
                console.log('불러오기 성공')
            })
            .catch((err) => {
                console.log(err.message);
            })
    }, []);

    return (
      <React.Fragment>
          <section className="notice">
              <div className="page-title">
                  <div className="container">
                      <h3>게시글 상세</h3>
                  </div>
                  <div className="board-detail">
                      <div className="container">
                          {board &&
                              <div key={board.boardNo}>
                                  <div className="board-title" key={board.boardTitle}>제목 : {board.boardTitle} </div>
                                  <div className="board-contents" key={board.boardContents}>내용
                                      : {board.boardContents}</div>
                                  <div className="board-views" key={board.boardViews}>조회수 : {board.boardViews}</div>
                                  <div className="board-writer" key={board.boardWriter}>작성자 : {board.boardWriter}</div>
                                  <div className="board-insert-timestamp" key={board.insertTimestamp}>등록일
                                      : {board.insertTimestamp}</div>
                                  <div className="board-board-editor" key={board.boardEditor}>편집자
                                      : {board.boardEditor}</div>
                                  <div className="board-updated-timestamp" key={board.updatedTimestamp}>수정일
                                      : {board.updatedTimestamp}</div>
                              </div>
                          }
                      </div>
                  </div>
              </div>
          </section>
      </React.Fragment>
    );
}

export default React.memo(BoardDetail);