import React, {Component, useEffect, useState } from "react";
// import "/Users/kso0654/ReactProject/boarduk/src/css/board.css";
import "C:/Users/study/testReact/src/css/board.css";
import {Route, Router, Routes} from "react-router";
import { Link } from 'react-router-dom';

function BoardDetail() {
    const [board, setBoard] = useState([
        {
            "boardNo": 4,
            "boardTitle": "둘 게시글",
            "boardContents": "",
            "boardViews": 0,
            "boardWriter": "admin",
            "insertTimestamp": "2022.06.27 23:06",
            "boardEditor": null,
            "updatedTimestamp": null,
            "fileList": []
        }
    ]);

    return (
      <React.Fragment>
          <section className="notice">
              <div className="page-title">
                  <div className="container">
                      <h3>게시글 상세</h3>
                  </div>
                  <div className="board-detail">
                      <div className="container">
                          <div className="board-title">제목 : {board.boardTitle}</div>
                          <div className="board-contents">내용 : {board.boardContents}</div>
                          <div className="board-views">조회수 : {board.boardViews}</div>
                          <div className="board-writer">작성자 : {board.boardWriter}</div>
                          <div className="board-insert-timestamp">등록일 : {board.insertTimestamp}</div>
                          <div className="board-board-editor">편집자 : {board.boardEditor}</div>
                          <div className="board-updated-timestamp">수정일 : {board.updatedTimestamp}</div>
                          <div className="board-file-list">첨부파일 : {board.fileList}</div>
                      </div>
                  </div>
              </div>
          </section>
      </React.Fragment>
    );
}

export default React.memo(BoardDetail);