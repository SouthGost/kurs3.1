import React, { useEffect } from 'react';
import { useAppSelector } from '../../reducers/store';
import { Routes, Route, Link, Outlet } from 'react-router-dom';
import { Form, Space, Button, Card, notification, Typography } from 'antd';
import AddFilm from './AddFilm';
import './style.css';


export default function Admin() {
    const user = useAppSelector(state => state.user.val);

    useEffect(() => {
        if (user.getPosition() === "User") {
            window.location.replace("http://localhost:3000/");
        }
    }, [user])

    return (
        <Space align="start" direction="horizontal">
            <Space className="admin_navigation" direction="vertical">
                <Link to="addfilm">
                    <Button className="admin_link">
                        Добавить фильм
                    </Button>
                </Link>
                <Link to="addsession">
                    <Button className="admin_link">
                        Добавить сеанс
                    </Button>
                </Link>
            </Space>
            <Space className="admin_container" align="center" direction="vertical">
                <Outlet />
            </Space>
        </Space>
    );
}