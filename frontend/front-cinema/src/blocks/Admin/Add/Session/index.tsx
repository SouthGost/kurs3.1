import React, { useEffect, useState } from "react";
import Cookies from 'js-cookie';
import moment from 'moment';
import { Input, Button, notification, Modal, Typography, Space, Select, DatePicker, Checkbox } from "antd";
import FetchRequest from "../../../../classes/FetchRequest";
import ResFilm from "../../../../interfaces/IResFilm";
import ResHall from "../../../../interfaces/IResHall";
const { Text, Title } = Typography;
const { Option } = Select;
type time = "10:00" | "13:30" | "17:00" | "20:45" | "23:10";
type busyDate = {
    date: string,
    times: time[],
}

export default function AddSession() {
    const [isDisableSubmitButton, setIsDisableSubmitButton] = useState(false);
    const [isVisibleRefreshButton, setIsVisibleRefreshButton] = useState(false);
    const [films, setFilms] = useState<ResFilm[]>();
    const [halls, setHalls] = useState<ResHall[]>();
    const [busyDates, setBusyDates] = useState<busyDate[]>();
    const [busyTimes, setBusyTimes] = useState<time[]>();
    const [choosedFilm, setChoosedFilm] = useState<number>();
    const [choosedHall, setChoosedHall] = useState<number>();
    const [choosedDate, setChoosedDate] = useState<string | null>(null);
    const [choosedTime, setChoosedTime] = useState<time>();
    const [choosedD, setChoosedD] = useState(2);
    const [isIMAX, setIsIMAX] = useState(false);
    const [isDolbyAudio, setIsDolbyAudio] = useState(false);
    const [cost, setCost] = useState<number>();
    const token = Cookies.get("token");
    const times: time[] = ["10:00", "13:30", "17:00", "20:45", "23:10"];

    useEffect(() => {
        async function getInfoForSession() {
            try {
                setFilms(await FetchRequest.getFilms());
                setHalls(await FetchRequest.getHalls());
            } catch (err) {
                Modal.error({
                    title: 'Ошибка',
                    content: 'У нас проблемы. Подождите немного.',
                });
            }
        }

        getInfoForSession();
    }, []);

    async function checkDates() {
        const params = {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                hall_id: choosedHall,
            })
        };

        try {
            const response = await fetch(`http://localhost:8000/api/info/checkdates`, params);
            if (response.ok) {
                const data = await response.json();
                await setBusyDates(data.dates);
            } else {
                Modal.error({
                    title: 'Ошибка',
                    content: 'У нас проблемы. Подождите немного.',
                });
            }
        } catch (err) {
            Modal.error({
                title: 'Ошибка',
                content: 'У нас проблемы. Подождите немного.',
            });
        }
    }

    useEffect(() => {
        if (choosedHall !== undefined) {
            checkDates();
        }

    }, [choosedHall]);

    async function addSession() {
        if (
            choosedFilm === undefined ||
            choosedHall === undefined ||
            cost === undefined ||
            choosedDate === null ||
            choosedTime === undefined ||
            choosedD === undefined
        ) {
            setIsDisableSubmitButton(false);
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
                setIsVisibleRefreshButton(true);
                setBusyDates(undefined);
                setBusyTimes(undefined);
                Modal.success({
                    title: "Сеанс добавлен",
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
            <Title>Добавить сеанс</Title>
            <Text>Фильм:</Text>
            {films === undefined ?
                <Select defaultValue="Выберете фильм" disabled></Select>
                :
                <Select
                    disabled={isDisableSubmitButton}
                    value={choosedFilm}
                    placeholder="Выберете фильм"
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
                    value={choosedHall}
                    placeholder="Выберете зал"
                    disabled={isDisableSubmitButton}
                    onChange={(value) => {
                        if (value !== undefined) {
                            setBusyTimes(undefined);
                            setChoosedDate(null);
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
                    allowClear={false}
                    disabled={busyDates === undefined || isDisableSubmitButton}
                    value={choosedDate === null ?
                        null
                        :
                        moment(choosedDate, "YYYY-MM-DD")
                    }
                    placeholder="Выберите дату"
                    disabledDate={(current) => {
                        if (current <= moment().add(-1, "days")) {
                            return true
                        }
                        if (busyDates !== undefined) {
                            const busyDate = busyDates!.find((elem) => {
                                return elem.date === current.format("YYYY-MM-DD")
                            })
                            if (busyDate !== undefined) {
                                if (busyDate.times.length === 5) {
                                    return true
                                }
                            }
                        }
                        return false
                    }}
                    onChange={(date, dateString) => {
                        const busyDate = busyDates!.find(elem => {
                            return elem.date === dateString
                        })
                        if (busyDate !== undefined) {
                            setBusyTimes(busyDate.times);
                        } else {
                            setBusyTimes([]);
                        }
                        setChoosedDate(dateString);
                    }}
                />
                <Select
                    disabled={busyTimes === undefined || isDisableSubmitButton}
                    value={choosedTime}
                    placeholder="Выберете время"
                    onChange={(value) => {
                        if (value !== undefined) {
                            setChoosedTime(value)
                        }
                    }}
                >
                    {times!.map((time) => {
                        let busy = false;

                        let busyTime = undefined;
                        if (busyTimes !== undefined) {
                            busyTime = busyTimes.find(bt => {
                                return bt === time
                            })
                        }
                        if (busyTime !== undefined) {
                            busy = true;
                        }

                        return (
                            <Option disabled={busy} value={time} key={time}>
                                {time}
                            </Option>
                        )
                    })}
                </Select>
            </Space>
            <Text>Тип показа:</Text>
            <Space direction="horizontal">
                <Select
                    disabled={isDisableSubmitButton}
                    value={choosedD}
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
                    disabled={isDisableSubmitButton}
                    checked={isIMAX}
                    onChange={() => {
                        setIsIMAX(!isIMAX)
                    }}
                >
                    IMAX
                </Checkbox>
                <Checkbox
                    disabled={isDisableSubmitButton}
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
                disabled={isDisableSubmitButton}
                type="number"
                placeholder="Введите цену"
                value={cost}
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
            <Space direction="horizontal">
                <Button
                    type="primary"
                    htmlType="submit"
                    disabled={isDisableSubmitButton}
                    onClick={() => {
                        setIsDisableSubmitButton(true);
                        addSession();
                    }}
                >добавить</Button>
                {isVisibleRefreshButton ?
                    <Button onClick={() => {
                        setChoosedFilm(undefined);
                        setChoosedHall(undefined);
                        setChoosedDate(null);
                        setChoosedTime(undefined);
                        setChoosedD(2);
                        setIsIMAX(false);
                        setIsDolbyAudio(false);
                        setCost(undefined);
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
    );
}