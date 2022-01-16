import { Button, Input, Modal, notification, Select, Space, Typography } from "antd";
import { useState } from "react";
const { Option } = Select;
const { Text, Title } = Typography;

export default function AddEmployee() {
    const [isDisableSubmitButton, setIsDisableSubmitButton] = useState(false);
    const [isVisibleRefreshButton, setIsVisibleRefreshButton] = useState(false);
    const [login, setLogin] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [position, setPosition] = useState<string>();
    const [name, setName] = useState<string>("");
    const [surname, setSurname] = useState<string>("");
    const [patronymic, setPatronymic] = useState<string>("");

    async function addEmployee() {
        if (
            login === "" ||
            password === "" ||
            position ===  undefined ||
            name === "" ||
            surname === ""
        ) {
            setIsDisableSubmitButton(false);
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
                setIsVisibleRefreshButton(true);
                Modal.success({
                    title: "Работник добавлен",
                });
            } else {
                setIsDisableSubmitButton(false);
                Modal.warning({
                    title: "Отказано",
                    content: "Ошибка в данных. Возможно такой логин занят",
                });
            }
        } catch (err) {
            setIsDisableSubmitButton(false);
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
                value={login}
                disabled={isDisableSubmitButton}
                onChange={(event) => {
                    setLogin(event.target.value);
                }}
            ></Input>
            <Text>Пароль:</Text>
            <Input
                type="password"
                value={password}
                disabled={isDisableSubmitButton}
                onChange={(event) => {
                    setPassword(event.target.value);
                }}
            ></Input>
            <Text>Должность:</Text>
            <Select
                value={position}
                placeholder={"Выберете должность"}
                disabled={isDisableSubmitButton}
                onChange={(value) => {
                    if (value !== undefined) {
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
                value={name}
                disabled={isDisableSubmitButton}
                onChange={(event) => {
                    setName(event.target.value);
                }}
            ></Input>
            <Text>Фамилия:</Text>
            <Input
                value={surname}
                disabled={isDisableSubmitButton}
                onChange={(event) => {
                    setSurname(event.target.value);
                }}
            ></Input>
            <Text>Отчество:</Text>
            <Input
                value={patronymic}
                disabled={isDisableSubmitButton}
                onChange={(event) => {
                    setPatronymic(event.target.value);
                }}
            ></Input>
             <Space direction="horizontal">
            <Button
                type="primary"
                htmlType="submit"
                disabled={isDisableSubmitButton}
                onClick={() => {
                    setIsDisableSubmitButton(true);
                    addEmployee();
                }}
            >добавить</Button>
            {isVisibleRefreshButton ?
            <Button onClick={() => {
                setLogin("");
                setPassword("");
                setPosition(undefined);
                setName("");
                setSurname("");
                setPatronymic("");
                setIsVisibleRefreshButton(false);
                setIsDisableSubmitButton(false);
            }}>
                Добавить ещё
            </Button>
            :
            <></>
        }
            </Space>
        </Space>
    )
}