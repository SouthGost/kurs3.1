import React, { useEffect } from 'react';
import { useAppSelector } from '../../reducers/store';
import { Routes, Route, Link } from 'react-router-dom';
import AddFilm from './AddFilm'


export default function Admin() {
    const user = useAppSelector(state => state.user.val);

    useEffect(() => {
        if (user.getPosition() === "User") {
            window.location.replace("http://localhost:3000/");
        }
    }, [user])

    return (
        <div>
            <Link to="addFilm">
                add
            </Link>
            {/* <Routes>
                <Route path="addfilm" element={<AddFilm />} />
            </Routes> */}
            <AddFilm />
        </div>
    );
}