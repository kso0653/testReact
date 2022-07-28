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
        <React.Fragment>
            <head>
                <meta charSet="UTF-8" />
                    <meta name="viewport"
                          content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0" />
                        <meta http-equiv="X-UA-Compatible" content="ie=edge" />
                            <title>게시판 메인</title>
                            <link rel="stylesheet" href="/Users/kso0654/ReactProject/boarduk/src/css/board.css" />
            </head>
            <body>
            <section className="notice">
                <div className="page-title">
                    <div className="container">
                        <h3>공지사항</h3>
                    </div>
                </div>
                <div id="board-search">
                    <div className="container">
                        <div className="search-window">
                            <form action="">
                                <div className="search-wrap">
                                    <label htmlFor="search" className="blind">공지사항 내용 검색</label>
                                    <input id="search" type="search" name="" placeholder="검색어를 입력해주세요." value="" />
                                        <button type="submit" className="btn btn-dark">검색</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
                <div id="board-list">
                    <div className="container">
                        <table className="board-table">
                            <thead>
                            <tr>
                                <th scope="col" className="th-num">번호</th>
                                <th scope="col" className="th-title">제목</th>
                                <th scope="col" className="th-date">등록일</th>
                            </tr>
                            </thead>
                            <tbody>
                            <tr>
                                <td>3</td>
                                <th>
                                    <a href="#!">[공지사항] 개인정보 처리방침 변경안내처리방침</a>
                                    <p>테스트</p>
                                </th>
                                <td>2017.07.13</td>
                            </tr>

                            <tr>
                                <td>2</td>
                                <th><a href="#!">공지사항 안내입니다. 이용해주셔서 감사합니다</a></th>
                                <td>2017.06.15</td>
                            </tr>

                            <tr>
                                <td>1</td>
                                <th><a href="#!">공지사항 안내입니다. 이용해주셔서 감사합니다</a></th>
                                <td>2017.06.15</td>
                            </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </section>
            </body>
        </React.Fragment>
        // <div className="board-container">
        //     {boards.map((board) => {
        //         return (
        //             <div className="board-no" key={board.boardNo}>
        //                 <h2 className="board-title">{board.boardTitle}</h2>
        //                 <p className="board-views">{board.boardViews}</p>
        //                 <p className="board-insert-time">{board.insertTimestamp}</p>
        //                 <div className="button">
        //                     <div className="delete-btn">Delete</div>
        //                 </div>
        //             </div>
        //         );
        //     })}
        // </div>
    );
}

export default Board;