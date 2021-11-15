import { useState } from 'react';
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
            const response = await fetch(`http://localhost:8000/api/auth/employee/login`, params);
            if (response.ok) {
                const data = await response.json();
                if (data.position !== undefined) {
                    // dispatch(setUser(new Employee(
                    //     data.login,
                    //     data.password,
                    //     data.fio,
                    //     data.position
                    // )));
                } else {
                    // dispatch(setUser(new User(
                    //     data.login,
                    //     data.password
                    // )));
                }
                
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

    )
}