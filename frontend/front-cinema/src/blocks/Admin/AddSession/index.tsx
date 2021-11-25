import React, { useEffect, useState } from "react";
import Cookies from 'js-cookie';
import moment from 'moment';
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
type time = "10:00"| "13:30"| "17:00"| "20:45"| "23:10";

export default function AddSession() {
    const [films, setFilms] = useState<films>();
    const [halls, setHalls] = useState<halls>();
    const [choosedFilm, setChoosedFilm] = useState<number>();
    const [choosedHall, setChoosedHall] = useState<number>();
    const [choosedDate, setChoosedDate] = useState<string|null>(null);
    const [choosedTime, setChoosedTime] = useState<time>();
    const [choosedD, setChoosedD] = useState(2);
    const [isIMAX, setIsIMAX] = useState(false);
    const [isDolbyAudio, setIsDolbyAudio] = useState(false);
    const [cost, setCost] = useState<number>();
    const token = Cookies.get("token");
    const times:time[] = ["10:00", "13:30", "17:00", "20:45", "23:10"];

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
            choosedFilm == undefined ||
            choosedHall == undefined ||
            cost == undefined ||
            choosedDate == null ||
            choosedTime == undefined ||
            choosedD == undefined
        ) {
            notification.warning({
                message: "Ошибка",
                description: "Вы не полностью ввели данные",
            });
            return;
        }
        const date = moment(choosedDate, "YYYY-MM-DD").add(choosedTime.split(":")[0], "hours").add(choosedTime.split(":")[1], "minute").format('x');
        const params = {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                film_id: choosedFilm,
                hall_id: choosedHall,
                cost,
                d: choosedD,
                date,
                token,
                palette: isIMAX ? "IMAX" : "default",
                audio: isDolbyAudio ? "Dolby Audio" : "default",
            }),
        };

        try {
            const response = await fetch(`http://localhost:8000/api/add/session`, params);
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
                    disabledDate={(current) => {
                        return current <= moment();
                    }}    
                    onChange={(date, dateString) => {
                        console.log(date, dateString);
                        setChoosedDate(dateString);
                    }}
                />
                <Select
                    defaultValue="Выберете время"
                    onChange={(value) => {
                        if (value !== "Выберете время") {
                            setChoosedTime(value)
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
                    onChange={(value) => {
                        setChoosedD(value)
                    }}
                >
                    <Option value={2} key={"2D"}>
                        2D
                    </Option>
                    <Option value={3} key={"3D"}>
                        3D
                    </Option>
                </Select>
                <Checkbox
                    checked={isIMAX}
                    onChange={() => {
                        setIsIMAX(!isIMAX)
                    }}
                >
                    IMAX
                </Checkbox>
                <Checkbox
                    checked={isDolbyAudio}
                    onChange={() => {
                        setIsDolbyAudio(!isDolbyAudio)
                    }}
                >
                    Dolby Audio
                </Checkbox>
            </Space>
            <Text>Стоимость:</Text>
            <Input
                type="number"
                placeholder="Введите цену"
                min={0}
                onChange={(event) => {
                    const val = +event.target.value;
                    if (val > 0) {
                        setCost(val);
                    } else {
                        setCost(undefined);
                    }
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