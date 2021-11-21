import React, { useEffect, useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from './reducers/store';
import User from './classes/User';
import Employee from './classes/Employee';
import WrongPage from './blocks/WrongPage';
import Admin from './blocks/Admin';
import Login from './blocks/Auth/Login';
import Sessions from './blocks/Sessions';
import AddFilm from './blocks/Admin/AddFilm';
import { Space } from 'antd';
import './App.css';

export default function App() {
    const dispatch = useAppDispatch();
    //const [user, setUser] = useState<User>(useAppSelector(state => state.user)); 
    const user = useAppSelector(state => state.user.val);
    //console.log("user", user );//!== undefined ? user.getLogin() : "нет"
    const qwe = <div>123</div>;

    return (
        <div className="App">
            {user.getLogin() === "" ?
                <Login />
                :
                <>
                    <Space className="navigation" align="end" direction="horizontal">
                        {user.getNavigation()}
                    </Space>
                    <Space className="container" align="center" direction="vertical">
                        <Routes>
                            <Route path="/" element={<Sessions />} />
                            <Route path="/admin" element={<Admin />} >
                                <Route path="addfilm" element={<AddFilm />} />
                            </Route>
                            <Route path="*" element={<WrongPage />} />
                        </Routes>
                    </Space>
                </>
            }

        </div>
    );
};

