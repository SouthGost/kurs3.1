import React, { useEffect, useState } from "react";
import FetchRequest from "../../../../classes/FetchRequest";
import { Input, Button, notification, Modal, Typography, Space, Select, Tag } from "antd";
import Cookies from "js-cookie";
import TextArea from "antd/lib/input/TextArea";
const { Text, Title } = Typography;
const { Option } = Select;
type genre = {
    id: number,
    name: string
}

export default function AddFilm() {
    const [isDisableSubmitButton, setIsDisableSubmitButton] = useState(false);
    const [isVisibleRefreshButton, setIsVisibleRefreshButton] = useState(false);
    const [nameFilm, setNameFilm] = useState("");
    const [genres, setGenres] = useState<genre[]>();
    const [choosedGenres, setChoosedGenres] = useState<number[]>([]);
    const [ageLimitFilm, setAgeLimitFilm] = useState<number>(0);
    const [descriptionFilm, setDescriptionFilm] = useState("");
    const token = Cookies.get("token");

    useEffect(() => {


        async function getGenres() {
            try {
                setGenres(await FetchRequest.getGenres());
            } catch (err) {
                Modal.error({
                    title: 'Ошибка',
                    content: 'У нас проблемы. Подождите немного.',
                });
            }
            
        }

        getGenres();
    }, []);

    async function addFilm() {
        if (
            nameFilm === "" ||
            choosedGenres.length === 0 ||
            ageLimitFilm === undefined ||
            descriptionFilm === ""
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
                name: nameFilm,
                choosedGenres,
                age_limit: ageLimitFilm,
                description: descriptionFilm,
                token
            }),
        };

        try {
            const response = await fetch(`http://localhost:8000/api/add/film`, params);
            if (response.ok) {
                const data = await response.json();
                setIsVisibleRefreshButton(true);
                Modal.success({
                    title: "Фильм добавлен",
                });
            } else {
                setIsDisableSubmitButton(false);
                Modal.warning({
                    title: "Отказано",
                    content: "Вы не правильно ввели данные",
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
        <Space direction="vertical">
            <Title>Добавить фильм</Title>
            <Text>Название фильма:</Text>
            <Input
                type="text"
                value={nameFilm}
                disabled={isDisableSubmitButton}
                onChange={(event) => {
                    setNameFilm(event.target.value);
                }}
            ></Input>
            <Text>Добавьте жанр:</Text>
            <Space
                direction="horizontal"
                style={{
                    width: "400px",
                }}
                wrap
            >

                {genres === undefined ?
                    <Select
                        value="Выберете жанр"
                        disabled
                    ></Select>
                    :
                    <Select
                        value="Выберете жанр"
                        disabled={isDisableSubmitButton}
                        onChange={(value) => {
                            if (value !== "Выберете жанр") {
                                setChoosedGenres([...choosedGenres, value]);
                            }
                        }}
                    >
                        {genres!.map((elem) => {
                            let disabled = false;
                            const genre_ = choosedGenres.find(id => id === elem.id)
                            if (genre_ !== undefined) {
                                disabled = true;
                            }
                            return (
                                <Option disabled={disabled} value={elem.id} key={elem.id}>
                                    {elem.name}
                                </Option>
                            )
                        })}
                    </Select>
                }
                {genres !== undefined ?
                    choosedGenres.map(elem => {
                        const genre = genres.find(genre_ => elem === genre_.id)
                        return (
                            <Button
                                danger
                                disabled={isDisableSubmitButton}
                                onClick={() => {
                                    setChoosedGenres(
                                        choosedGenres.filter((filterElem) => {
                                            if (filterElem !== elem) {
                                                return elem;
                                            };
                                        })
                                    )

                                }}
                            >
                                {genre!.name}
                            </Button>
                        )
                    })
                    :
                    <></>
                }
            </Space>
            <Text>Возрастное ограничение:</Text>
            <Select
                value={ageLimitFilm}
                disabled={isDisableSubmitButton}
                onChange={(value) => {
                    setAgeLimitFilm(value)
                }}
            >
                <Option value={0} key={"+0"}>
                    +0
                </Option>
                <Option value={6} key={"+6"}>
                    +6
                </Option>
                <Option value={12} key={"+12"}>
                    +12
                </Option>
                <Option value={16} key={"+16"}>
                    +16
                </Option>
                <Option value={18} key={"+18"}>
                    +18
                </Option>
            </Select>
            <Text>Описание:</Text>
            <TextArea
                autoSize
                disabled={isDisableSubmitButton}
                value={descriptionFilm}
                onChange={(event) => {
                    setDescriptionFilm(event.target.value);
                }}
            ></TextArea >
            <Space direction="horizontal">
                <Button
                    type="primary"
                    htmlType="submit"
                    disabled={isDisableSubmitButton}
                    onClick={() => {
                        setIsDisableSubmitButton(true);
                        addFilm();
                    }}
                >добавить</Button>
                {isVisibleRefreshButton ?
                    <Button onClick={() => {
                        setNameFilm("");
                        setChoosedGenres([]);
                        setAgeLimitFilm(0);
                        setDescriptionFilm("");
                        setIsVisibleRefreshButton(false);
                        setIsDisableSubmitButton(false);
                    }}>
                        Добавить ещё
                    </Button>
                    :
                    <></>
                }
            </Space>
        </Space >
    );
}