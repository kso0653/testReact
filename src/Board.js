import React, {Component, useEffect, useState } from "react";
import "/Users/kso0654/ReactProject/boarduk/src/css/board.css";
import {Route, Router, Routes} from "react-router";
import { Link } from 'react-router-dom';

function Board() {
    const [boards, setBoard] = useState([]);
    const [hold, setHold] = useState([]);
    const [search, setSearch] = useState({
        title : ""
    });

    const onChange = (event) => {
        console.log("event ===>", event.target);
        const { name, value } = event.target;

        setSearch({
            ...search,
            [name]: value,
        });
    };

    const onSearch = () => {
        console.log("검색어 :", search.title);
        fetch(`/api/board/search/${search.title}`)
            .then((response) => response.json())
            .then((data) => {
                console.log(data);
                setBoard(data);
                console.log(boards);
                console.log('onSearch fetch 성공!');
            })
            .catch((err) => {
                console.log(err.message);
            });
    }

    const onDelete = () => {
        console.log("<=== 삭제");
        fetch(`/api/board/${boards.boardNo}`)
            .then((response) => response.json())
            .then((data) => {
                console.log(data);
                // setBoard(data);
                console.log(boards);
                console.log('onDelete fetch 성공!');
            })
            .catch((err) => {
                console.log(err.message);
            });
    }

    useEffect(() => {
        fetch('/api/board')
            .then((response) => response.json())
            .then((data) => {
                console.log(data);
                setBoard(data);
                console.log(boards);
            })
            .catch((err) => {
                console.log(err.message);
            });
    },[]);

    return (
        <React.Fragment>
            <section className="notice">
                <div className="page-title">
                    <div className="container">
                        <h3>공지사항</h3>
                    </div>
                </div>
                <div id="board-search">
                    <div className="container">
                        <div className="search-window">
                            <div className="search-wrap">
                                <label htmlFor="search" className="blind">공지사항 내용 검색</label>
                                <input
                                    id="search"
                                    type="text"
                                    name="title"
                                    placeholder="제목을 입력해주세요."
                                    value={search.title}
                                    onChange={onChange}
                                />
                                <button onClick={onSearch} className="btn btn-dark">검색</button>
                            </div>
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
                                <th scope="col" className="th-hit">조회수</th>
                                <th scope="col" className="th-date">등록일</th>
                                <th scope="col" className="th-delete">삭제</th>
                            </tr>
                            </thead>
                            <tbody>
                            {boards.map((board) => {
                                return (
                                    <tr key={board.boardNo}>
                                        <td className="board-no" key={board.boardNo}>{board.boardNo}</td>
                                        <td className="board-title" key={board.boardTitle}>
                                            <Link to={{
                                                pathname: `/board/${board.boardNo}`
                                                }}>
                                            {board.boardTitle}
                                            </Link>
                                        </td>
                                        <td className="board-views" key={board.boardViews}>{board.boardViews}</td>
                                        <td className="board-insert-time" key={board.insertTimestamp}>{board.insertTimestamp}</td>
                                        <td className="board-delete">
                                            <button onClick={onDelete}>삭제</button>
                                        </td>
                                    </tr>
                                );
                            })}
                            </tbody>
                        </table>
                        <div className="button">
                            <button className="btn btn-dark">등록</button>
                        </div>
                    </div>
                </div>
            </section>
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

export default React.memo(Board);