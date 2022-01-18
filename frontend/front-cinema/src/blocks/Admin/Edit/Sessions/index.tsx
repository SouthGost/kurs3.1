import { Modal, Space, Typography, Table, Select, Button, Checkbox, Input, notification } from "antd";
import moment from "moment";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import FetchRequest from "../../../../classes/FetchRequest";
import ResFilm from "../../../../interfaces/IResFilm";
import ResHall from "../../../../interfaces/IResHall";
import ResSession from "../../../../interfaces/IResSession";
import ResViewType from "../../../../interfaces/IResViewType";
import { useAppSelector } from "../../../../reducers/store";
const { Text, Title, Paragraph } = Typography;
const { Option } = Select;
type property = "cost" | "view_type_id" | "film_id";
type changedSession = {
    id: number,
    film_id: number,
    hall_id: number,
    cost: number,
    view_type_id: number,
    date: number,
    changed: boolean,
    used: boolean,
};

export default function EditSessions() {
    const [resSessions, setResSessions] = useState<ResSession[]>();
    const [sessions, setSessions] = useState<changedSession[]>();
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

    async function loadAllSessions() {
        try {
            setResSessions(await FetchRequest.getAllSessions());
        } catch (e) {
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
        loadAllSessions();
    }, [])

    useEffect(() => {
        if (resSessions !== undefined) {
            const session_: changedSession[] = [];
            resSessions.forEach(elem => {
                session_.push({ ...elem, changed: false })
            })

            setSessions(session_);
        }
    }, [resSessions])

    function changeNumber(id: number, property: property, newVal: number) {
        setSessions(sessions!.filter(elem => {
            if (elem.id == id) {
                elem[property] = newVal;
                elem.changed = true;
            }
            return elem;
        }))
    }

    const columns = [
        {
            title: "Фильм",
            dataIndex: "film_id",
            key: "id",
            render: (film_id: number, session: changedSession) =>
                <Select
                    disabled={!session.used}
                    value={film_id}
                    onChange={(value) => {
                        if (value !== film_id) {
                            changeNumber(session.id, "film_id", value);
                        }
                    }}
                >
                    {films!.map(elem =>
                        <Option value={elem.id} key={elem.id}>
                            {elem.name}
                        </Option>
                    )}
                </Select>
        },
        {
            title: "Зал",
            dataIndex: "hall_id",
            key: "id",
            render: (hall_id: number, session: changedSession) => {
                const hall = halls!.find(elem => elem.id === hall_id)
                return (

                    hall !== undefined ?
                        <Text delete={!session.used}>{hall.name}</Text>
                        :
                        <Text type="danger" delete={!session.used}>Ошибка</Text>
                )
            }
        },
        {
            title: "Дата",
            dataIndex: "date",
            key: "id",
            render: (date: number, session: changedSession) =>
                <Text delete={!session.used}>{moment(date, 'x').format('DD.MM.YYYY HH:mm')}</Text>
        },
        {
            title: "Тип показа",
            dataIndex: "view_type_id",
            key: "id",
            render: (view_type_id: number, session: changedSession) =>
                <Select
                    disabled={!session.used}
                    value={view_type_id}
                    style={{
                        width: "300px",
                    }}
                    onChange={(value) => {
                        if (value !== view_type_id) {
                            changeNumber(session.id, "view_type_id", value);
                        }
                    }}
                >
                    {viewTypes!.map(elem =>
                        <Option value={elem.id} key={elem.id}>
                            {elem.d}D {elem.palette !== "default" ? elem.palette : ""} {elem.audio !== "default" ? elem.audio : ""}
                        </Option>
                    )}
                </Select>
        },
        {
            title: "Стоимость",
            dataIndex: "cost",
            key: "id",
            render: (cost: number, session: changedSession) =>
                session.used ?
                    <Input
                        type="number"
                        value={cost}
                        min={0}
                        allowClear={false}
                        onChange={(event) => {
                            changeNumber(session.id, "cost", +event.target.value);
                        }}

                    />
                    :
                    <Text delete>{cost}</Text>
        },
        {
            title: "",
            dataIndex: "used",
            key: "id",
            render: (used: boolean, session: changedSession) =>
                <Button
                    type={!used ? "primary" : "default"}
                    onClick={() => {
                        setSessions(sessions!.filter(elem => {
                            if (elem.id == session.id) {
                                elem.used = !elem.used;
                                elem.changed = true;
                            }
                            return elem;
                        }))
                    }}
                >
                    {used ? "Удалить" : "Не удалять"}
                </Button>

        },
        {
            title: "",
            dataIndex: "changed",
            key: "id",
            render: (isChanged: boolean, session: changedSession) =>
                <Button
                    disabled={!isChanged}
                    onClick={() => {
                        setSessions(sessions!.filter(elem => {
                            if (elem.id == session.id) {
                                const oldSession = resSessions!.find(resSession => resSession.id === session.id);
                                if (oldSession !== undefined) {
                                    elem.cost = oldSession.cost;
                                    elem.view_type_id = oldSession.view_type_id;
                                    elem.used = true;
                                    elem.changed = false;
                                } else {
                                    Modal.error({
                                        title: "Ошибка"
                                    })
                                }
                            }
                            return elem;
                        }))
                    }}
                >
                    Вернуть
                </Button>

        }
    ]

    async function sendChangedSessions() {
        const changedSessions = sessions!.filter(elem => elem.changed === true)

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
                setResSessions(undefined);
                await loadAllSessions();
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
            <Title>Редактирование сеансов</Title>
            {sessions === undefined ||
                halls === undefined ||
                films === undefined ||
                viewTypes === undefined ?
                <Text>Загрузка</Text>
                :
                <>
                    <Table pagination={false} columns={columns} dataSource={sessions} />
                    <Button
                        type="primary"
                        onClick={sendChangedSessions}
                    >
                        Отправить
                    </Button>
                </>
            }
        </Space>
    )
}