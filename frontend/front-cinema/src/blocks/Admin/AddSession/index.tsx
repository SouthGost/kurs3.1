import React, { useState } from "react";
import { Input, Button, notification, Modal, Typography, Space, Select } from "antd";
const { Text, Title } = Typography;
const { Option } = Select;

type films = {
    id: number,
    film: string
}[]
const fakefilms=[
    {
        id:1,
        film:"qwe"
    },
    {
        id:2,
        film:"qwe"
    },
    {
        id:3,
        film:"qwe"
    },
    {
        id:4,
        film:"qwe"
    },
]

export default function AddSession() {
    const [films, setFilms] = useState<films>();
    const [choosedFilm, setChoosedFilm] = useState<number>();

    async function addSession() {
        if (
            true
        ) {
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
                //сюда дату
            }),
        };

        try {
            const response = await fetch(`http://localhost:8000/api/film`, params);
            if (response.ok) {
                const data = await response.json();

                console.log(data);
            } else {
                notification.warning({
                    message: "Отказано",
                    description: "Вы не правильно",
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
        <Space direction="vertical">
            <Title>Добавить сеаес</Title>
            {/* <Space direction="horizontal"> */}
            <Text>Фильм:</Text>
            {films === undefined ?
            <Select defaultValue="Не нашел фильмы" disabled></Select>
            :
            <Select
                defaultValue="Выберете фильм"
                onChange={(value) => {
                    if(typeof value == "number"){
                        setChoosedFilm(value);
                    }
                }}
            >
                {films!.map((elem) => (
                    <Option value={elem.id} key={elem.id}>
                        {elem.film}
                    </Option>
                ))}
            </Select>
        }

            <Button
                type="primary"
                htmlType="submit"
                onClick={() => {
                    addSession();
                }}
            >добавить</Button>
        </Space>
    );
}