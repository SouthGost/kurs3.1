import { useEffect, useState } from "react";
import ResTempFilm from "../../../../interfaces/IResTempFilm";
import IGenre from "../../../../interfaces/IGenre";
import FetchRequest from "../../../../classes/FetchRequest";
import Cookies from "js-cookie";
import ResFilm from "../../../../interfaces/IResFilm";
import { Modal, Space, Typography, Table, Button, notification } from "antd";
import { useAppSelector } from "../../../../reducers/store";
import moment from "moment";
const { Text, Title } = Typography;
type TempFilm = {
    id: number,
    action: string,
    date: string,
    film_id: number,
    name: string,
    age_limit: string,
    genres: IGenre[],
    description: string,
    used: boolean,
    choosed: boolean,
}


export default function HistoryFilms() {
    const [tempFilms, setTempFilms] = useState<TempFilm[]>();
    const token = Cookies.get("token");
    const user = useAppSelector(state => state.user.val);

    useEffect(() => {
        const position = user.getPosition();
        const login = user.getLogin();

        if ((position !== "admin" && login !== "") || token === undefined) {
            window.location.replace("http://localhost:3000/admin");
        }
    }, [user]);

    async function loadTempFilms() {
        try {
            const resTempFilms: ResTempFilm[] = await FetchRequest.getTempFilms();
            const tempFilms_: TempFilm[] = [];
            resTempFilms.forEach(elem => {
                tempFilms_.push({ ...elem, choosed: false })
            })
            setTempFilms(tempFilms_);
        } catch (error) {
            Modal.error({
                title: 'Ошибка',
                content: 'У нас проблемы. Подождите немного.',
            });
        }
    }

    useEffect(() => {
        loadTempFilms();
    }, []);

    const columns = [
        {
            title: "",
            dataIndex: "choosed",
            key: "id",
            render: (choosed: string, tempFilm: TempFilm) =>
                <Button
                    type={choosed ? "primary" : "default"}
                    onClick={() => {
                        setTempFilms(tempFilms!.filter(elem => {
                            if (choosed) {
                                if (elem.id === tempFilm.id) {
                                    elem.choosed = false;
                                }
                            } else {
                                if (elem.film_id === tempFilm.film_id) {
                                    if (elem.id === tempFilm.id) {
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
            render: (action: string, tempFilm: TempFilm) =>
                <Title level={5}>
                    {action}
                </Title>
        },
        {
            title: "Дата",
            dataIndex: "date",
            key: "id",
            render: (date: string, tempFilm: TempFilm) =>
                <Text>
                    {moment(date).format("HH:mm:ss DD.MM.yyyy")}
                </Text>
        },
        {
            title: "Имя фильма",
            dataIndex: "name",
            key: "id",
            render: (name: string, tempFilm: TempFilm) =>
                <Title level={5}>
                    {name}
                </Title>
        },
        {
            title: "Возрастное ограничение",
            dataIndex: "age_limit",
            key: "id",
            render: (age_limit: string, tempFilm: TempFilm) =>
                <Text>
                    {age_limit}+
                </Text>
        },
        {
            title: "Жанры",
            dataIndex: "genres",
            key: "id",
            render: (choosedGenres: IGenre[], tempFilm: TempFilm) =>
                <Space direction="vertical">
                    {choosedGenres !== undefined && choosedGenres.length !== 0 ?
                        choosedGenres.map(elem => (
                            <Text>
                                {elem.name}
                            </Text>
                        ))
                        :
                        <></>
                    }
                </Space>
        },
        {
            title: "Описание",
            dataIndex: "description",
            key: "id",
        },
    ];

    async function sendBackUpFilms() {
        const changedFilms: ResFilm[] = []
        tempFilms!.forEach(elem => {
            if (elem.choosed) {
                changedFilms.push({
                    id: elem.film_id,
                    name: elem.name,
                    age_limit: elem.age_limit,
                    genres: elem.genres,
                    description: elem.description,
                    used: elem.used,
                });
            }
        })

        if (changedFilms.length === 0) {
            notification.warning({
                message: "Ошибка",
                description: "Вы ничего не выбрали",
            });

            return;
        }

        const params = {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            }, body: JSON.stringify({
                changedFilms,
                token
            }),
        };

        try {
            const response = await fetch(`http://localhost:8000/api/change/films`, params);
            if (response.ok) {
                const data = await response.json();
                Modal.success({
                    title: "Данные успешно изменены",
                });
                await loadTempFilms();
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
            <Title>История фильмов</Title>
            {tempFilms === undefined ?
                <Text>Загрузка</Text>
                :
                <>
                    <Table pagination={false} columns={columns} dataSource={tempFilms} />
                    <Button
                        type="primary"
                        onClick={sendBackUpFilms}
                    >
                        Отправить
                    </Button>
                </>
            }
        </Space>
    )
}