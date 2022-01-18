import { useEffect, useState } from "react";
import ResFilm from '../../../../interfaces/IResFilm';
import Cookies from "js-cookie";
import IGenre from "../../../../interfaces/IGenre";
import FetchRequest from "../../../../classes/FetchRequest";
import { Modal, Space, Typography, Table, Select, Button, notification } from "antd";
import { useAppSelector } from "../../../../reducers/store";
const { Text, Title, Paragraph } = Typography;
const { Option } = Select;
type changedFilms = {
    id: number;
    name: string,
    age_limit: string,
    genres: IGenre[],
    description: string,
    changed: boolean,
    used: boolean
}

export default function EditFilms() {
    const [resFilms, setResFilms] = useState<ResFilm[]>();
    const [films, setFilms] = useState<changedFilms[]>();
    const [genres, setGenres] = useState<IGenre[]>();
    const token = Cookies.get("token");
    const user = useAppSelector(state => state.user.val);

    useEffect(() => {
        const position = user.getPosition();
        const login = user.getLogin();

        if ((position !== "admin" && login !== "") || token === undefined) {
            window.location.replace("http://localhost:3000/admin");
        }
    }, [user]);

    async function loadEditFilms() {
        try {
            setResFilms(await FetchRequest.getFilms());
        } catch (error) {
            Modal.error({
                title: 'Ошибка',
                content: 'У нас проблемы. Подождите немного.',
            });
        }
    }

    useEffect(() => {
        async function getGenres() {
            try {
                setGenres(await FetchRequest.getGenres());
            } catch (error) {
                Modal.error({
                    title: 'Ошибка',
                    content: 'У нас проблемы. Подождите немного.',
                });
            }
        }

        getGenres();
        loadEditFilms();
    }, []);

    useEffect(() => {
        if (resFilms !== undefined) {
            const films_: changedFilms[] = [];
            resFilms.forEach(elem => {
                films_.push({ ...elem, changed: false })
            })
            setFilms(films_);
        }
    }, [resFilms])

    function changeName(id: number, newVal: string) {
        if (newVal !== "") {
            setFilms(films!.filter(elem => {
                if (elem.id == id) {
                    elem.name = newVal;
                    elem.changed = true;
                }
                return elem;
            }))
        }
    }

    function changeAgeLimit(id: number, newVal: string) {
        if (newVal !== "") {
            setFilms(films!.filter(elem => {
                if (elem.id == id) {
                    elem.age_limit = newVal;
                    elem.changed = true;
                }
                return elem;
            }))
        }
    }

    function changeChoosedGenres(id: number, action: string, value: number) {
        setFilms(films!.filter(elem => {
            if (elem.id == id) {
                switch (action) {
                    case "add":
                        const addGenre = genres!.find(genre => genre.id === value);
                        if (addGenre !== undefined) {
                            elem.genres = [...elem.genres, addGenre]
                        }
                        break;
                    case "delete":
                        elem.genres = elem.genres.filter((filterElem) => {
                            if (filterElem.id !== value) {
                                return filterElem;
                            };
                        })
                        break;
                }
                elem.changed = true;
            }
            return elem;
        }))
    }

    function changeDescription(id: number, newVal: string) {
        if (newVal !== "") {
            setFilms(films!.filter(elem => {
                if (elem.id == id) {
                    elem.description = newVal;
                    elem.changed = true;
                }
                return elem;
            }))
        }
    }


    const columns = [
        {
            title: "Имя",
            dataIndex: "name",
            key: "id",
            render: (name: string, film: changedFilms) =>
                film.used ?
                    <Paragraph

                        editable={{
                            onChange: (value) => {
                                changeName(film.id, value);
                            }
                        }}

                    >
                        {name}
                    </Paragraph >
                    :
                    <Text delete>{name}</Text>

        },
        {
            title: "Возрастное ограничение",
            dataIndex: "age_limit",
            key: "id",
            render: (age_limit: string, film: changedFilms) =>
                film.used ?
                    <Select
                        value={age_limit}
                        onChange={(value) => {
                            changeAgeLimit(film.id, value)
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
                    :
                    <Text delete>+{age_limit}</Text>
        },
        {
            title: "Жанры",
            dataIndex: "genres",
            key: "id",
            render: (choosedGenres: IGenre[], film: changedFilms) =>
                film.used ?
                    <Space direction="vertical">
                        {genres === undefined ?
                            <Select
                                value="Выберете жанр"
                                disabled
                            ></Select>
                            :
                            <Select
                                value="Выберете жанр"
                                onChange={(value) => {
                                    if (value !== "Выберете жанр") {
                                        changeChoosedGenres(film.id, "add", value)
                                    }
                                }}
                            >
                                {genres!.map((elem) => {
                                    let disabled = false;
                                    const genre_ = choosedGenres.find(choosedGenre => choosedGenre.id === elem.id)
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
                        {choosedGenres !== undefined && choosedGenres.length !== 0 ?
                            choosedGenres.map(elem => (
                                <Button
                                    danger
                                    onClick={() => {
                                        changeChoosedGenres(film.id, "delete", elem.id);
                                    }}
                                >
                                    {elem.name}
                                </Button>
                            ))
                            :
                            <></>
                        }

                    </Space>
                    :
                    <Text delete>Выберете жанр</Text>
        },
        {
            title: "Описание",
            dataIndex: "description",
            key: "id",
            render: (description: string, film: changedFilms) =>
                film.used ?
                    <Paragraph
                        editable={{
                            onChange: (value) => {
                                changeDescription(film.id, value);
                            }
                        }}

                    >
                        {description}
                    </Paragraph >
                    :
                    <Text delete>{description}</Text>
        },
        {
            title: "",
            dataIndex: "used",
            key: "id",
            render: (used: boolean, film: changedFilms) =>
                <Button
                    type={!used ? "primary" : "default"}
                    onClick={() => {
                        setFilms(films!.filter(elem => {
                            if (elem.id == film.id) {
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
            render: (isChanged: boolean, film: changedFilms) =>
                <Button
                    disabled={!isChanged}
                    onClick={() => {
                        setFilms(films!.filter(elem => {
                            if (elem.id == film.id) {
                                const oldFilm = resFilms!.find(resFilm => resFilm.id === film.id);
                                if (oldFilm !== undefined) {
                                    elem.name = oldFilm.name;
                                    elem.genres = oldFilm.genres;
                                    elem.age_limit = oldFilm.age_limit;
                                    elem.description = oldFilm.description;
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

    async function sendChangedFilms() {
        const changedFilms = films!.filter(elem => elem.changed)

        if (changedFilms.length === 0) {
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
                setResFilms(undefined);
                await loadEditFilms();
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
            <Title>Редактирование фильмов</Title>
            {genres === undefined ||
                films === undefined ?
                <Text>Загрузка</Text>
                :
                <>
                    <Table pagination={false} columns={columns} dataSource={films} />
                    <Button
                        type="primary"
                        onClick={sendChangedFilms}
                    >
                        Отправить
                    </Button>
                </>
            }
        </Space>
    )
}