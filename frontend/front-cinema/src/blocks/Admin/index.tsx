import React, { useEffect, useState } from 'react';
import { useAppSelector } from '../../reducers/store';
import { Routes, Route, Link, Outlet } from 'react-router-dom';
import { Form, Space, Button, Card, notification, Typography } from 'antd';
import './style.css';
import Employee from '../../classes/Employee';
import Cookies from 'js-cookie';


export default function Admin() {
    const user = useAppSelector(state => state.user.val)! as Employee;
    const token = Cookies.get("token");
    
    useEffect(() => {
        const position = user.getPosition();
        const login = user.getLogin();

        if ((position === "User" && login !== "") || token === undefined) {
            window.location.replace("http://localhost:3000/");
        }
    }, [user])

    return (
        <Space align="start" direction="horizontal">
            <Space className="admin_navigation" direction="vertical">
                <Link to="add/film">
                    <Button className="admin_link">
                        Добавить фильм
                    </Button>
                </Link>
                <Link to="add/session">
                    <Button className="admin_link">
                        Добавить сеанс
                    </Button>
                </Link>
                {user.getPosition() === "admin" ?
                    <>
                        <Link to="add/employee">
                            <Button className="admin_link">
                                Добавить работника
                            </Button>
                        </Link>
                        <Link to="edit/films">
                            <Button className="admin_link">
                                Изменить фильмы
                            </Button>
                        </Link>
                        <Link to="edit/sessions">
                            <Button className="admin_link">
                                Изменить сеансы
                            </Button>
                        </Link>
                        <Link to="edit/employees">
                            <Button className="admin_link">
                                Изменить работников
                            </Button>
                        </Link>
                        <Link to="history/films">
                            <Button className="admin_link">
                                История фильмов
                            </Button>
                        </Link>
                        <Link to="history/sessions">
                            <Button className="admin_link">
                                История сеансов
                            </Button>
                        </Link>
                        <Link to="history/employees">
                            <Button className="admin_link">
                                История работников
                            </Button>
                        </Link>
                    </>
                    :
                    <></>
                }
            </Space>
            <Space className="admin_container" align="center" direction="vertical">
                <Outlet />
            </Space>
        </Space>
    );
}