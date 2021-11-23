import React, { useState } from "react";
import { Input, Button, notification, Modal, Typography, Space } from "antd";
const { Text, Title } = Typography;

export default function AddFilm() {
    const [nameFilm, setNameFilm] = useState("");
    const [imgUrlFilm, setImgUrlFilm] = useState("");
    const [ageLimitFilm, setAgeLimitFilm] = useState("");
    const [descriptionFilm, setDescriptionFilm] = useState("");

    async function addFilm() {
        if (
            nameFilm === "" ||
            imgUrlFilm === "" ||
            ageLimitFilm === "" ||
            descriptionFilm === ""
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
                name: nameFilm,
                img_url: imgUrlFilm,
                age_limit: ageLimitFilm,
                description: descriptionFilm
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
            <Title>Добавить фильм</Title>
            {/* <Space direction="horizontal"> */}
                <Text>Имя фильма:</Text>
                <Input
                    type="text"
                    onChange={(event) => {
                        setNameFilm(event.target.value);
                    }}
                ></Input>
            {/* </Space>
            <Space direction="horizontal"> */}
                <Text>Картинка:</Text>
                <Input
                    type="text"
                    onChange={(event) => {
                        setImgUrlFilm(event.target.value);
                    }}
                ></Input>
            {/* </Space>
            <Space direction="horizontal"> */}
                <Text>Возрастное ограничение:</Text>
                <Input
                    type="text"
                    onChange={(event) => {
                        setAgeLimitFilm(event.target.value);
                    }}
                ></Input>
            {/* </Space>
            <Space direction="horizontal"> */}
                <Text>Описание:</Text>
                <Input
                    type="text"
                    onChange={(event) => {
                        setDescriptionFilm(event.target.value);
                    }}
                ></Input>
            {/* </Space> */}
            <Button
                type="primary"
                htmlType="submit"
                onClick={() => {
                    addFilm();
                }}
            >добавить</Button>
        </Space>
    );
}