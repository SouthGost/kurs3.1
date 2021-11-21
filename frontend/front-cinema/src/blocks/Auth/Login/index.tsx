import { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { useAppDispatch } from '../../../reducers/store';
import { setUser } from '../../../reducers/userSlice';
import User from '../../../classes/User';
import Employee from '../../../classes/Employee';
import { Form, Input, Button, Card, notification, Modal, Typography } from 'antd';
const { Title } = Typography;

export default function Login() {
    const dispatch = useAppDispatch();
    const [login, setLogin] = useState("");
    const [password, setPassword] = useState("");
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
                    const login_ = data.user.login;
                    const password_ = data.user.password;
                    if (data.user.position !== undefined) {
                        const fio_ = data.user.fio;
                        const position_ = data.user.position;
                        dispatch(setUser(new Employee(
                            login_,
                            password_,
                            fio_,
                            position_,
                        )));
                    } else {
                        dispatch(setUser(new User(
                            login_,
                            password_,
                        )));
                    }

                    console.log(data);
                } else {
                    Cookies.remove("token");
                    setToken(undefined)
                }
            } catch (err) {
                Modal.error({
                    title: 'Ошибка',
                    content: 'У нас что-то происходит не так. Подождите немного.',
                });
            }
        }

        if (token !== undefined) {
            refresh();
        }
    }, []);

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
                const login_ = data.user.login;
                const password_ = data.user.password;
                if (data.user.position !== undefined) {
                    const fio_ = data.user.fio;
                    const position_ = data.user.position;
                    dispatch(setUser(new Employee(
                        login_,
                        password_,
                        fio_,
                        position_,
                    )));
                } else {
                    dispatch(setUser(new User(
                        login_,
                        password_,
                    )));
                }
                Cookies.set("token", data.token, { expires: 7 });
                // Cookies.set("userPassword", data.password, {expexpires: 7});

                console.log(data);
            } else {
                notification.warning({
                    message: "Ошибка",
                    description: "Не верный логин или пароль",
                });
            }
        } catch (err) {
            Modal.error({
                title: 'Ошибка',
                content: 'У нас что-то происходит не так. Подождите немного.',
            });
        }
    }

    return (
        <>
            {token === undefined ?
                <Card style={{
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
                    </Form>
                </Card>
                :
                <></>
            }
        </>
    )
}