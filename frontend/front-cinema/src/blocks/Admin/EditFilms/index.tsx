import { useEffect, useState } from "react";
import ResFilm from './../../../interfaces/IResFilm';
import Film from './../../../classes/Film';
import EditFilm from "./EditFilm";
import { Modal, Space, Typography, Table, Select, Button } from "antd";
import IGenre from "../../../interfaces/IGenre";
const { Text, Title, Paragraph } = Typography;
const { Option } = Select;
type changedFilms = {
    id: number;
    name: string,
    age_limit: string,
    genres: IGenre[],
    description: string,
    changed: boolean,
    delete: boolean
}

export default function EditFilms() {
    const [resFilms, setResFilms] = useState<ResFilm[]>();
    const [films, setFilms] = useState<changedFilms[]>();
    const [genres, setGenres] = useState<IGenre[]>();

    useEffect(() => {
        async function loadEditFilms() {
            try {
                setResFilms(await Film.loadFilms());
            } catch (error) {
                Modal.error({
                    title: "Ошибка"
                })
            }
        }

        async function getGenres() {
            try {
                setGenres(await Film.getGenres());
            } catch (error) {
                Modal.error({
                    title: "Ошибка"
                })
            }
        }

        getGenres();
        loadEditFilms();
    }, []);

    useEffect(() => {
        if (resFilms !== undefined) {
            const films_: changedFilms[] = [];
            resFilms.forEach(elem => {
                films_.push({ ...elem, changed: false, delete: false })
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
                film.delete ?
                    <Text delete>{name}</Text>
                    :
                    <Paragraph

                        editable={{
                            onChange: (value) => {
                                changeName(film.id, value);
                            }
                        }}

                    >
                        {name}
                    </Paragraph >

        },
        {
            title: "Возрастное ограничение",
            dataIndex: "age_limit",
            key: "id",
            render: (age_limit: string, film: changedFilms) =>
                film.delete ?
                    <Text delete>+{age_limit}</Text>
                    :
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
        },
        {
            title: "Жанры",
            dataIndex: "genres",
            key: "id",
            render: (choosedGenres: IGenre[], film: changedFilms) =>
                film.delete ?
                    <Text delete>Выберете жанр</Text>
                    :
                    <Space direction="vertical">
                        {choosedGenres !== undefined && choosedGenres.length !== 0 ?
                            choosedGenres.map(elem => (
                                <Button
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
                                        // setChoosedGenres([...choosedGenres, value]);
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
                    </Space>
        },
        {
            title: "Описание",
            dataIndex: "description",
            key: "id",
            render: (description: string, film: changedFilms) =>
                film.delete ?
                    <Text delete>{description}</Text>
                    :
                    <Paragraph
                        editable={{
                            onChange: (value) => {
                                changeDescription(film.id, value);
                            }
                        }}

                    >
                        {description}
                    </Paragraph >
        },
        {
            title: "Удалить",
            dataIndex: "delete",
            key: "id",
            render: (isDelete: boolean, film: changedFilms) =>
                <Button
                    onClick={() => {
                        setFilms(films!.filter(elem => {
                            if (elem.id == film.id) {
                                elem.delete = !elem.delete;
                                elem.changed = true;
                            }
                            return elem;
                        }))
                    }}
                >
                    {isDelete ? "Восстанавить" : "Удалить"}
                </Button>

        }
    ]

    return (
        <Space direction="vertical">
            <Title>Редактирование фильмов</Title>
            {films === undefined ?
                <Text>Загрузка</Text>
                :
                <Table columns={columns} dataSource={films} />
                // films.map(elem => (
                // <EditFilm {...elem}/>
                // ))
            }
        </Space>
    )
}