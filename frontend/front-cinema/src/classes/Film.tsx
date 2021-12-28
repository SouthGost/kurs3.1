import ResFilm from "../interfaces/IResFilm";
import ResSession from '../interfaces/IResSession';
import Genre from "../interfaces/IGenre";
import Session from './Session';
import { Space, Typography } from "antd";
import moment from 'moment';
import Place from "./Place";
import User from "./User";
import Paragraph from "antd/lib/typography/Paragraph";
import Title from "antd/lib/typography/Title";
const { Text } = Typography;

export default class Film {
    private sessions: Session[];
    private id;
    private name: string;
    private age_limit: string;
    private genres: Genre[];
    private description: string;
    private showModal: (title: string, elem: JSX.Element) => void;
    // private user: User

    public constructor(
        film: ResFilm,
        // date: moment.Moment,
        showModal: (title: string, elem: JSX.Element) => void,
        // user: User
        // changeChoosedPlace: (action: string, place: Place) => void
    ) {
        this.id = film.id;
        this.name = film.name;
        this.age_limit = film.age_limit;
        this.genres = film.genres;
        this.description = film.description;
        this.sessions = [];
        // this.loadSessions(date);
        this.showModal = showModal;
        // this.user = user;
    }

    public static async loadFilms() {
        const params = {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            }
        };

        try {
            const response = await fetch(`http://localhost:8000/api/info/films`, params);
            if (response.ok) {
                const data = await response.json();
                console.log(data);
                return data.films;
            } else {
                throw new Error("Не найдены фильмы");
                // throw new Error("Не найдены фильмы");
            }
        } catch (err) {
            throw new Error("У нас проблемы. Подождите немного.");
            // throw new Error("У нас проблемы. Подождите немного.");
        }
    }

    public static async getGenres() {
        const params = {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
        };

        try {
            const response = await fetch(`http://localhost:8000/api/info/genres`, params);
            if (response.ok) {
                const data = await response.json();
                return data.genres;

            } else {
                throw new Error("Не найдены жанры");
            }
        } catch (err) {
            throw new Error("У нас проблемы. Подождите немного.");
        }
    }

    // public async loadSessions(date: moment.Moment) {
    //     const params = {
    //         method: "POST",
    //         headers: {
    //             'Content-Type': 'application/json'
    //         },
    //         body: JSON.stringify({
    //             film_id: this.id,
    //             date: date.format('x'),
    //         }),
    //     };

    //     try {
    //         const response = await fetch(`http://localhost:8000/api/info/sessions`, params);
    //         if (response.ok) {
    //             const data = await response.json();
    //             this.setSessions(data.sessions);
    //             console.log(data);
    //         } else {
    //             throw new Error("Не найдены сеансы");
    //         }
    //     } catch (err) {
    //         throw new Error("У нас проблемы. Подождите немного.");
    //     }
    // }

    public setSessions(sessions: ResSession[]) {
        this.sessions = [];
        for (const session of sessions) {
            this.sessions.push(new Session(session, this.showModal));
        }
    }

    public setUser(user: User) {
        this.sessions.forEach(session => {
            session.setUser(user);
        })
    }

    public getId(){
        return this.id;
    }

    public getContent() {
        return (
            <Space 
                direction="horizontal"
                className="film_conteiner"
            >
                <Space
                    direction="vertical"
                    style={{
                        width: "300px"
                    }}
                >
                    <Title level={2}>
                        {this.name}
                    </Title >
                    <Space direction="horizontal">
                        {this.genres.length !== 0 ?
                            <>
                                <Text>Жанры:</Text>
                                {this.genres.map(genre => (
                                    <Text>
                                        {genre.name}
                                    </Text>
                                ))}
                            </>
                        :
                            <></>
                        }
                    </Space>
                    <Paragraph ellipsis>
                        {this.description}
                    </Paragraph>
                </Space>
                {this.sessions.length !== 0 ?
                    this.sessions.map((session) =>
                        session.getContent()
                    )
                    :
                    <Text>Нет сеансов на этот день</Text>
                }
            </Space>
        )
    }

    // getName():string {
    //     return this.name;
    // }

    // getAgeLimit():string {
    //     return this.ageLimit;
    // }

    // getGenre():string[] {
    //     return this.genre;
    // }

    // getDescription():string {
    //     return this.description;
    // }

    // getPosterUrl():string {
    //     return this.posterUrl;
    // }
}