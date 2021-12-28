import { Button, Input, Modal, notification, Select, Space, Typography } from "antd";
import { useState } from "react";
const { Option } = Select;
const { Text, Title } = Typography;

export default function AddEmployee() {
    const [isDisableButton, setIsDisableButton] = useState(false);
    const [login, setLogin] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [position, setPosition] = useState<string>("");
    const [name, setName] = useState<string>("");
    const [surname, setSurname] = useState<string>("");
    const [patronymic, setPatronymic] = useState<string>("");

    async function addEmployee() {
        if (
            login === "" ||
            password === "" ||
            position === "" ||
            name === "" ||
            surname === ""
        ) {
            setIsDisableButton(false);
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
                position,
                name,
                surname,
                patronymic
            }),
        };
        try {
            const response = await fetch(`http://localhost:8000/api/auth/register/employee`, params);
            if (response.ok) {
                const data = await response.json();
                Modal.success({
                    title: "Работник добавлен",
                });
            } else {
                setIsDisableButton(false);
                Modal.warning({
                    title: "Отказано",
                    content: "Вы не правильно ввели данные",
                });
            }
        } catch (err) {
            setIsDisableButton(false);
            Modal.error({
                title: 'Ошибка',
                content: 'У нас проблемы. Подождите немного.',
            });
        }
    }

    return (
        <Space
            direction="vertical"
        >
            <Title>Добавить работника</Title>
            <Text>Логин:</Text>
            <Input
                onChange={(event) => {
                    setLogin(event.target.value);
                }}
            ></Input>
            <Text>Пароль:</Text>
            <Input
            type="password"
                onChange={(event) => {
                    setPassword(event.target.value);
                }}
            ></Input>
            <Text>Должность:</Text>
            <Select
                defaultValue={"Выберете должность"}
                onChange={(value) => {
                    if (value !== "Выберете должность") {
                        setPosition(value)
                    }
                }}
            >
                <Option value={"seller"}>
                    Продавец
                </Option>
                <Option value={"admin"}>
                    Администратор
                </Option>
            </Select>
            <Text>Имя:</Text>
            <Input
                onChange={(event) => {
                    setName(event.target.value);
                }}
            ></Input>
            <Text>Фамилия:</Text>
            <Input
                onChange={(event) => {
                    setSurname(event.target.value);
                }}
            ></Input>
            <Text>Отчество:</Text>
            <Input
                onChange={(event) => {
                    setPatronymic(event.target.value);
                }}
            ></Input>
            <Button
                type="primary"
                htmlType="submit"
                disabled={isDisableButton}
                onClick={() => {
                    setIsDisableButton(true);
                    addEmployee();
                }}
            >добавить</Button>
        </Space>
    )
}