import React, { useEffect, useState } from "react";
import { Input, Button, notification, Modal, Typography, Space, Select, DatePicker, Checkbox } from "antd";
const { Text, Title } = Typography;
const { Option } = Select;

type films = {
    id: number,
    name: string
}[];
type halls = {
    id: number,
    name: string
}[];

export default function AddSession() {
    const [films, setFilms] = useState<films>();
    const [halls, setHalls] = useState<halls>();
    const times = ["10:00", "13:30", "17:00", "20:45", "23:10"];
    const [choosedFilm, setChoosedFilm] = useState<number>();
    const [choosedHall, setChoosedHall] = useState<number>();
    const [choosedDate, setChoosedDate] = useState(1);
    const [choosedTime, setChoosedTime] = useState(1);
    const [choosedD, setChoosedD] = useState(2);
    const [isIMAX, setIsIMAX] = useState(false);
    const [isDolbyAudio, setIsDolbyAudio] = useState(false);
    const [cost, setCost] = useState<number>();

    useEffect(() => {
        async function getInfoForSession() {
            const params = {
                method: "GET",
                headers: {
                    'Content-Type': 'application/json'
                },
            };

            try {
                const response = await fetch(`http://localhost:8000/api/info/session`, params);
                if (response.ok) {
                    const data = await response.json();
                    setFilms(data.films);
                    setHalls(data.halls);

                } else {
                    Modal.error({
                        title: 'Ошибка',
                        content: 'У нас что-то происходит не так. Подождите немного.',
                    });
                }
            } catch (err) {
                Modal.error({
                    title: 'Ошибка',
                    content: 'У нас что-то происходит не так. Подождите немного.',
                });
            }
        }

        getInfoForSession();
    }, []);

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
            <Title>Добавить сеанс</Title>
            {/* <Space direction="horizontal"> */}
            <Text>Фильм:</Text>
            {films === undefined ?
                <Select defaultValue="Выберете фильм" disabled></Select>
                :
                <Select
                    defaultValue="Выберете фильм"
                    onChange={(value) => {
                        if (typeof value == "number") {
                            setChoosedFilm(value);
                        }
                    }}
                >
                    {films!.map((elem) => (
                        <Option value={elem.id} key={elem.id}>
                            {elem.name}
                        </Option>
                    ))}
                </Select>
            }
            <Text>Зал:</Text>
            {halls === undefined ?
                <Select defaultValue="Выберете зал" disabled></Select>
                :
                <Select
                    defaultValue="Выберете зал"
                    onChange={(value) => {
                        if (typeof value == "number") {
                            setChoosedHall(value);
                        }
                    }}
                >
                    {halls!.map((elem) => (
                        <Option value={elem.id} key={elem.id}>
                            {elem.name}
                        </Option>
                    ))}
                </Select>
            }
            <Text>Дата:</Text>
            <Space direction="horizontal">
                <DatePicker
                    placeholder="Выберите дату"
                    onChange={(date, dateString) => {
                        console.log(date, dateString);
                    }}
                />
                <Select
                    defaultValue="Выберете время"
                    onChange={(value) => {
                        if (value !== "Выберете время") {
                            // setChoosedHall(value);
                        }
                    }}
                >
                    {times!.map((elem) => (
                        <Option value={elem} key={elem}>
                            {elem}
                        </Option>
                    ))}
                </Select>
            </Space>
            <Text>Тип показа:</Text>
            <Space direction="horizontal">
                <Select
                    defaultValue={2}
                >
                    <Option value={2} key={"2D"}>
                        2D
                    </Option>
                    <Option value={3} key={"3D"}>
                        3D
                    </Option>
                </Select>
                <Checkbox
                    // checked={this.state.checked}
                    // disabled={this.state.disabled}
                    // onChange={this.onChange}
                >
                    IMAX
                </Checkbox>
                <Checkbox
                    // checked={this.state.checked}
                    // disabled={this.state.disabled}
                    // onChange={this.onChange}
                >
                    Dolby Audio
                </Checkbox>
            </Space>
            <Text>Стоимость:</Text>
            <Input
                type="number"
                placeholder="Введите цену"
                onChange={()=>{

                }}
            />

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