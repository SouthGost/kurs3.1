import TempResSession from "../../../../interfaces/IResTempSession";
import { Modal, Space, Typography, Table, Button, notification } from "antd";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import FetchRequest from "../../../../classes/FetchRequest";
import ResFilm from "../../../../interfaces/IResFilm";
import ResViewType from "../../../../interfaces/IResViewType";
import ResHall from "../../../../interfaces/IResHall";
import moment from "moment";
import ResSession from "../../../../interfaces/IResSession";
import { useAppSelector } from "../../../../reducers/store";
const { Text, Title } = Typography;
type TempSession = {
    id: number,
    date: string,
    action: string,
    session_id: number,
    film_id: number,
    hall_id: number,
    cost: number,
    view_type_id: number,
    session_date: number,
    used: boolean,
    choosed: boolean,
}

export default function HistorySessions() {
    const [tempSessions, setTempSessions] = useState<TempSession[]>();
    const [films, setFilms] = useState<ResFilm[]>();
    const [halls, setHalls] = useState<ResHall[]>();
    const [viewTypes, setViewTypes] = useState<ResViewType[]>();
    const token = Cookies.get("token");
    const user = useAppSelector(state => state.user.val);

    useEffect(() => {
        const position = user.getPosition();
        const login = user.getLogin();

        if ((position !== "admin" && login !== "") || token === undefined) {
            window.location.replace("http://localhost:3000/admin");
        }
    }, [user]);

    async function loadTempSessions() {
        try {
            const resTempSessions: TempResSession[] = await FetchRequest.getTempSessions();
            const tempSessions_: TempSession[] = [];
            resTempSessions.forEach(elem => {
                tempSessions_.push({ ...elem, choosed: false })
            })
            setTempSessions(tempSessions_);
        } catch (error) {
            Modal.error({
                title: 'Ошибка',
                content: 'У нас проблемы. Подождите немного.',
            });
        }
    }

    useEffect(() => {
        async function getInfoForSessions() {
            try {
                setFilms(await FetchRequest.getFilms());
                setHalls(await FetchRequest.getHalls());
                setViewTypes(await FetchRequest.getViewTypes());
            } catch (err) {
                Modal.error({
                    title: 'Ошибка',
                    content: 'У нас проблемы. Подождите немного.',
                });
            }
        }

        getInfoForSessions();
        loadTempSessions();
    }, []);

    const columns = [
        {
            title: "",
            dataIndex: "choosed",
            key: "id",
            render: (choosed: string, tempSession: TempSession) =>
                <Button
                    type={choosed ? "primary" : "default"}
                    onClick={() => {
                        setTempSessions(tempSessions!.filter(elem => {
                            if (choosed) {
                                if (elem.id === tempSession.id) {
                                    elem.choosed = false;
                                }
                            } else {
                                if (elem.session_id === tempSession.session_id) {
                                    if (elem.id === tempSession.id) {
                                        elem.choosed = true;
                                    } else {
                                        elem.choosed = false;
                                    }
                                }
                            }

                            return elem;
                        }))
                    }}
                >
                    Откат
                </Button>
        },
        {
            title: "Действие",
            dataIndex: "action",
            key: "id",
            render: (action: string, tempSession: TempSession) =>
                <Title level={5}>
                    {action}
                </Title>
        },
        {
            title: "Дата",
            dataIndex: "date",
            key: "id",
        },
        {
            title: "Зал",
            dataIndex: "hall_id",
            key: "id",
            render: (hall_id: number, tempSession: TempSession) => {
                const hall = halls!.find(elem => elem.id === hall_id)
                return (
                    hall !== undefined ?
                        <Title level={5}>{hall.name}</Title>
                        :
                        <Title level={5} type="danger">Ошибка</Title>
                )
            }
        },
        {
            title: "Дата сеанса",
            dataIndex: "session_date",
            key: "id",
            render: (session_date: number, tempSession: TempSession) =>
                <Title level={5}>{moment(session_date, 'x').format('DD.MM.YYYY HH:mm')}</Title>
        },
        {
            title: "Фильм",
            dataIndex: "film_id",
            key: "id",
            render: (film_id: number, tempSession: TempSession) => {
                const film = films!.find(elem => elem.id === film_id);
                return (
                    film !== undefined ?
                        <Text>{film.name}</Text>
                        :
                        <Text type="danger">Ошибка</Text>
                )
            }
        },
        {
            title: "Тип показа",
            dataIndex: "view_type_id",
            key: "id",
            render: (view_type_id: number, tempSession: TempSession) => {
                const view_type = viewTypes!.find(elem => elem.id === view_type_id)
                return (
                    view_type !== undefined ?
                        <Text>{view_type.d}D {view_type.palette !== "default" ? view_type.palette : ""} {view_type.audio !== "default" ? view_type.audio : ""}</Text>
                        :
                        <Text type="danger">Ошибка</Text>
                )
            }
        },
        {
            title: "Стоимость",
            dataIndex: "cost",
            key: "id",
        },
    ];

    async function sendBackUpSessions() {
        const changedSessions: ResSession[] = []
        tempSessions!.forEach(elem => {
            if (elem.choosed) {
                changedSessions.push({
                    id: elem.session_id,
                    film_id: elem.film_id,
                    hall_id: elem.hall_id,
                    cost: elem.cost,
                    view_type_id: elem.view_type_id,
                    date: elem.session_date,
                    used: elem.used,
                });
            }
        })

        if (changedSessions.length === 0) {
            notification.warning({
                message: "Ошибка",
                description: "Вы ничего не поменяли",
            });

            return;
        }

        const params = {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            }, body: JSON.stringify({
                changedSessions,
                token
            }),
        };

        try {
            const response = await fetch(`http://localhost:8000/api/change/sessions`, params);
            if (response.ok) {
                Modal.success({
                    title: "Данные успешно изменены",
                });
                await loadTempSessions();
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

    return (
        <Space direction="vertical">
            <Title>История сеансов</Title>
            {tempSessions === undefined ||
                halls === undefined ||
                films === undefined ||
                viewTypes === undefined ?
                <Text>Загрузка</Text>
                :
                <>
                    <Table pagination={false} columns={columns} dataSource={tempSessions} />
                    <Button
                        type="primary"
                        onClick={sendBackUpSessions}
                    >
                        Отправить
                    </Button>
                </>
            }
        </Space>
    )
}