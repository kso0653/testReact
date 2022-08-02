import React, { useRef, useState, useMemo, useCallback } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Board from "./Board";
import BoardDetail from "./BoardDetail";

function App() {
    return (
        <BrowserRouter>
            <Board />
            <Route>
                <Route path="/" element={<Board />}></Route>
                {/*<Route path="/board/*" element={<BoardDetail />}></Route>*/}
                {/*<Route path="*" element={<NotFound />}></Route>*/}
            </Route>
        </BrowserRouter>
        )
}

export default App;