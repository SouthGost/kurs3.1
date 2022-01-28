import TempResSession from "../../../../interfaces/IResTempSession";
import { Modal, Space, Typography, Table, Button, notification } from "antd";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import FetchRequest from "../../../../classes/FetchRequest";
import ResFilm from "../../../../interfaces/IResFilm";
import ResTicket from "../../../../interfaces/IResTicket";
import ResHall from "../../../../interfaces/IResHall";
import ResPlace from "../../../../interfaces/IResPlace";
import moment from "moment";
import ResSession from "../../../../interfaces/IResSession";
import { useAppSelector } from "../../../../reducers/store";
const { Text, Title } = Typography;
type TempTicket = {
    id: number,
    place_id: number,
    session_id: number,
    employee_login: string,
    user_login: string,
    used: boolean,
    choosed: boolean,
}

export default function HistorySessions() {
    const [tempTickets, setTempTickets] = useState<TempTicket[]>();
    const [films, setFilms] = useState<ResFilm[]>();
    const [sessions, setSessions] = useState<ResSession[]>();
    const [halls, setHalls] = useState<ResHall[]>();
    const [places, setPlaces] = useState<ResPlace[]>();
    const token = Cookies.get("token");
    const user = useAppSelector(state => state.user.val);

    useEffect(() => {
        const position = user.getPosition();
        const login = user.getLogin();

        if ((position !== "admin" && login !== "") || token === undefined) {
            window.location.replace("http://localhost:3000/admin");
        }
    }, [user]);

    async function loadTempTickets() {
        try {
            const resTempTickets: ResTicket[] = await FetchRequest.getAllTickets(token!);
            const tempTickets_: TempTicket[] = [];
            resTempTickets.forEach(elem => {
                tempTickets_.push({ ...elem, choosed: false })
            })
            setTempTickets(tempTickets_);
        } catch (error) {
            Modal.error({
                title: 'Ошибка',
                content: 'У нас проблемы. Подождите немного.',
            });
        }
    }

    useEffect(() => {
        async function getInfoForTickets() {
            try {
                setSessions(await FetchRequest.getAllSessions());
                setPlaces(await FetchRequest.getPlaces());
                setFilms(await FetchRequest.getFilms());
                setHalls(await FetchRequest.getHalls());

            } catch (err) {
                Modal.error({
                    title: 'Ошибка',
                    content: 'У нас проблемы. Подождите немного.',
                });
            }
        }

        getInfoForTickets();
        loadTempTickets();
    }, []);

    const columns = [
        {
            title: "",
            dataIndex: "choosed",
            key: "id",
            render: (choosed: string, tempTicket: TempTicket) =>
                <Button
                    type={choosed ? "primary" : "default"}
                    onClick={() => {
                        setTempTickets(tempTickets!.filter(elem => {
                            if (elem.id === tempTicket.id) {
                                elem.choosed = !choosed;
                            }

                            return elem;
                        }))
                    }}
                >
                    {choosed ? "Отмена" : "Возоврат"}
                </Button>
        },
        {
            title: "Сеанс",
            dataIndex: "session_id",
            key: "id",
            render: (session_id: number, tempTicket: TempTicket) => {
                const session = sessions!.find(elem => elem.id === session_id);
                if (session !== undefined) {
                    const film = films!.find(elem => elem.id === session.film_id);
                    if (film !== undefined) {
                        return (
                            <Title level={5} >{film.name} в {moment(session.date, 'x').format("HH:mm DD.MM.YYYY")}</Title>
                        )
                    }
                }
                return (
                    <Title level={5} type="danger">Ошибка</Title>
                )
            }
        },
        {
            title: "Место",
            dataIndex: "place_id",
            key: "id",
            render: (place_id: number, tempTicket: TempTicket) => {
                const place = places!.find(elem => elem.id === place_id)
                if (place !== undefined) {
                    const hall = halls!.find(elem => elem.id === place.hall_id);
                    if (hall !== undefined) {
                        return (
                            <Title level={5} >{place.row} ряд, {place.number} место, {hall.name}</Title>
                        )
                    }
                }
                return (
                    <Title level={5} type="danger">Ошибка</Title>
                )
            }
        },
        {
            title: "Приобретен",
            dataIndex: "employee_login",
            key: "id",
            render: (employee_login: string, tempTicket: TempTicket) => {
                if (employee_login !== null) {
                    return (
                        <Text>В кассе у {employee_login}</Text>
                    )
                } else {
                    return (
                        <Text>в интернете {tempTicket.user_login}</Text>
                    )
                }
            }
        },
    ];

    async function sendBackTickets() {
        const returnedTickets: ResTicket[] = []
        tempTickets!.forEach(elem => {
            if (elem.choosed) {
                returnedTickets.push({
                    id: elem.id,
                    place_id: elem.place_id,
                    session_id: elem.session_id,
                    employee_login: elem.employee_login,
                    user_login: elem.user_login,
                    used: elem.used,
                });
            }
        })

        if (returnedTickets.length === 0) {
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
                returnedTickets,
                token
            }),
        };

        try {
            const response = await fetch(`http://localhost:8000/api/change/tickets`, params);
            if (response.ok) {
                Modal.success({
                    title: "Билеты возвращены",
                });
                await loadTempTickets();
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
            <Title>Возоврат билетов</Title>
            {tempTickets === undefined ||
                films === undefined ||
                sessions === undefined ||
                halls === undefined ||
                places === undefined ?
                <Text>Загрузка</Text>
                :
                <>
                    <Table pagination={false} columns={columns} dataSource={tempTickets} />
                    <Button
                        type="primary"
                        onClick={sendBackTickets}
                    >
                        Отправить
                    </Button>
                </>
            }
        </Space>
    )
}