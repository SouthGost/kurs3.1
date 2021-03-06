import { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { Link } from 'react-router-dom';
import { useAppDispatch } from '../../../reducers/store';
import { setUser } from '../../../reducers/userSlice';
import User from '../../../classes/User';
import Employee from '../../../classes/Employee';
import { Form, Input, Button, Space, notification, Modal, Typography } from 'antd';
const { Title } = Typography;

export default function Login() {
    const dispatch = useAppDispatch();
    const [login, setLogin] = useState("");
    const [password, setPassword] = useState("");
    const [token, setToken] = useState(Cookies.get("token"));

    useEffect(() => {
        if (token !== undefined) {
            window.location.replace("http://localhost:3000/");
        }
    }, [token])

    async function authentication() {
        if (login === "" || password === "") {
            notification.warning({
                message: "Ошибка",
                description: "Вы не полностью ввели данные",
            });
            return;
        }

        const params = {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                login,
                password,
            }),
        };

        try {
            const response = await fetch(`http://localhost:8000/api/auth/login`, params);
            if (response.ok) {
                const data = await response.json();
                if (data.user.position !== undefined) {
                    dispatch(setUser(new Employee(data.user)));
                } else {
                    dispatch(setUser(new User(data.user)));

                }
                Cookies.set("token", data.token, { expires: 7 });
                window.location.replace("http://localhost:3000/");
            } else {
                notification.warning({
                    message: "Ошибка",
                    description: "Не верный логин или пароль",
                });
            }
        } catch (err) {
            Modal.error({
                title: 'Ошибка',
                content: 'У нас проблемы. Подождите немного.',
            });
        }
    }

    return (
        <>
            {token === undefined ?
                <Space style={{
                    display: "grid",
                    placeItems: "center",
                }}>
                    <Form layout="vertical">
                        <Title>Вход</Title>
                        <Form.Item label="Имя пользователя">
                            <Input
                                type="text"
                                onChange={(event) => {
                                    setLogin(event.target.value);
                                }}
                            />
                        </Form.Item>
                        <Form.Item label="Пароль">
                            <Input
                                type="password"
                                onChange={(event) => {
                                    setPassword(event.target.value);
                                }}
                            />
                        </Form.Item>
                        <Form.Item>
                            <Button
                                type="primary"
                                htmlType="submit"
                                onClick={() => {
                                    authentication();
                                }}
                            >Войти</Button>
                        </Form.Item>
                        <Link to="/register">
                            <Button>
                                Регистрация
                            </Button>
                        </Link>
                    </Form>
                </Space>
                :
                <></>
            }
        </>
    )
}