import React, { useEffect, useState } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from './reducers/store';
import { setUser } from './reducers/userSlice';
import Cookies from 'js-cookie';
import User from './classes/User';
import Employee from './classes/Employee';
import WrongPage from './blocks/WrongPage';
import Admin from './blocks/Admin';
import Login from './blocks/Auth/Login';
import Register from './blocks/Auth/Register';
import Sessions from './blocks/Sessions';
import AddFilm from './blocks/Admin/AddFilm';
import AddSession from './blocks/Admin/AddSession';
import EditFilms from './blocks/Admin/EditFilms';
import { Space, Button, Modal } from 'antd';
import './App.css';
import AddEmployee from './blocks/Admin/AddEmployee';

export default function App() {
    const dispatch = useAppDispatch();
    //const [user, setUser] = useState<User>(useAppSelector(state => state.user)); 
    const user = useAppSelector(state => state.user.val);
    //console.log("user", user );//!== undefined ? user.getLogin() : "нет"
    const [token, setToken] = useState(Cookies.get("token"));

    useEffect(() => {
        async function refresh() {
            const params = {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    token,
                }),

            };

            try {
                const response = await fetch(`http://localhost:8000/api/auth/refresh`, params);
                if (response.ok) {
                    const data = await response.json();
                    if (data.user.position !== undefined) {
                        dispatch(setUser(new Employee(data.user)));
                    } else {
                        dispatch(setUser(new User(data.user)));
                    }
                } else {
                    Cookies.remove("token");
                    setToken(undefined)
                }
            } catch (err) {
                Modal.error({
                    title: 'Ошибка',
                    content: 'У нас проблемы. Подождите немного.',
                });
            }
        }

        if (token !== undefined) {
            refresh();
        }
    }, []);

    return (
        <div className="App">
            {/* {user.getLogin() === "" ?
                <Login />
                : */}
            <>
                <Space className="navigation" direction="horizontal">
                    <Link to="/">
                        <Button>
                            Главная
                        </Button>
                    </Link>
                    {user.getLogin() === "" ?
                        <Link to="/login">
                            <Button>
                                Вход
                            </Button>
                        </Link>
                        :
                        <>
                            {user.getNavigation()}
                            <Button
                                onClick={() => {
                                    Cookies.remove("token");
                                    dispatch(setUser(new User({ login: "", password: "" })));
                                }}
                            >
                                Выход
                            </Button>
                        </>
                    }
                </Space>
                <Space 
                    className="container" 
                    align="start" 
                    direction="vertical"
                >
                    <Routes>
                        <Route path="/" element={<Sessions />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="/admin" element={<Admin />} >
                            <Route path="addfilm" element={<AddFilm />} />
                            <Route path="addsession" element={<AddSession />} />
                            <Route path="addemployee" element={<AddEmployee />} />
                            <Route path="editfilms" element={<EditFilms />} />
                            
                        </Route>
                        <Route path="*" element={<WrongPage />} />
                    </Routes>
                </Space>
            </>
            {/* } */}

        </div>
    );
};

