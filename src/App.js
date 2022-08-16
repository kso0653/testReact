import React, { useRef, useState, useMemo, useCallback } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import Board from "./Board";
import BoardDetail from "./BoardDetail";

function App() {
    return (
        <Router>
            <Route>
                <Route exact path="/" component={Board} />
                <Route path="/board/boardDetail/:boardNo" component={BoardDetail} />
                {/*<Route path="*" element={<NotFound />}></Route>*/}
            </Route>
        </Router>
        )
}

export default App;