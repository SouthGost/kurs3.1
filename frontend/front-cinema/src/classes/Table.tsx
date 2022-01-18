import Film from './Film';
import ResFilm from '../interfaces/IResFilm';
import moment from 'moment';
import { Space, Typography } from "antd";
import User from './User';
import FetchRequest from './FetchRequest';
const { Text } = Typography;

export default class Table {
    private date: moment.Moment;
    private films: Film[];
    private user: User;

    private constructor(
        date: moment.Moment,
        films: ResFilm[],
        showModal: (title: string, elem: JSX.Element) => void,
        user: User
    ) {
        this.date = date;
        this.films = [];
        this.user = user;
        films.forEach((film) => {
            this.films.push(new Film(film, showModal));
        })

    }

    public static async createTable(
        date: moment.Moment,
        showModal: (title: string, elem: JSX.Element) => void,
        user: User
    ) {
        const films = await FetchRequest.getFilms()
        return new Table(date, films, showModal, user);
    }

    public setUser(user: User) {
        this.user = user;
        this.films.forEach((film) => {
            film.setUser(user);
        })
    }

    public async getContent(date: moment.Moment) {
        const previousDate = this.date;
        let error = false;
        this.date = date;
        try {
            for (const film of this.films) {
                await film.setSessions(await FetchRequest.getSessions(date, film.getId()));
            }
        } catch (err) {
            this.date = previousDate;
            error = true
        }

        return (
            <Space
                direction="vertical"
                size={30}
            >
                {!error ?
                    <>
                        <Text>Сеансы на {this.date.format("DD.MM.YY")}</Text>
                        {this.films.map((film) =>
                            film.getContent()
                        )}
                    </>
                    :
                    <Text>Подождите немного. У нас проблемы.</Text>
                }
            </Space>
        )
    }
}