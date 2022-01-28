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
import AddFilm from './blocks/Admin/Add/Film';
import AddSession from './blocks/Admin/Add/Session';
import AddEmployee from './blocks/Admin/Add/Employee';
import { Space, Button, Modal } from 'antd';
import EditFilms from './blocks/Admin/Edit/Films';
import EditSessions from './blocks/Admin/Edit/Sessions';
import EditEmpolyees from './blocks/Admin/Edit/Empolyees';
import './App.css';
import HistoryTickets from './blocks/Admin/History/Tickets';
import HistoryFilms from './blocks/Admin/History/Films';
import HistorySessions from './blocks/Admin/History/Sessions';
import HistoryEmployees from './blocks/Admin/History/Employees';
import HistoryBackups from './blocks/Admin/History/Backups';

export default function App() {
    const dispatch = useAppDispatch();
    const user = useAppSelector(state => state.user.val);
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
                            <Route path="add/film" element={<AddFilm />} />
                            <Route path="add/session" element={<AddSession />} />
                            <Route path="history/tickets" element={<HistoryTickets />} />
                            <Route path="add/employee" element={<AddEmployee />} />
                            <Route path="edit/films" element={<EditFilms />} />
                            <Route path="edit/sessions" element={<EditSessions />} />
                            <Route path="edit/employees" element={<EditEmpolyees />} />
                            <Route path="history/films" element={<HistoryFilms />} />
                            <Route path="history/sessions" element={<HistorySessions />} />
                            <Route path="history/employees" element={<HistoryEmployees />} />
                            <Route path="history/backups" element={<HistoryBackups />} />
                        </Route>
                        <Route path="*" element={<WrongPage />} />
                    </Routes>
                </Space>
            </>

        </div>
    );
};

