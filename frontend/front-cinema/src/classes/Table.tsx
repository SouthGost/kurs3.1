import Film from './Film';
import ResFilm from '../interfaces/IResFilm';
import moment from 'moment';
import { Space } from "antd";


export default class Table {
    private date: moment.Moment;
    private films: Film[];
    private errors: string ="";

    public constructor(date: moment.Moment) {
        this.date = date;
        this.films = [];
        this.loadFilms();
    }

    public setDate(date: moment.Moment){
        this.date = date;
        this.films.forEach(film => {
            film.loadSessions(date);
        });
    }

    private async loadFilms() {
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
                this.setFilms_(data.films);
                console.log(data);
            } else {
                this.errors = "Не найдены фильмы";
                // throw new Error("Не найдены фильмы");
            }
        } catch (err) {
            this.errors = "У нас что-то происходит не так. Подождите немного.";
            // throw new Error("У нас что-то происходит не так. Подождите немного.");
        }
    }

    private setFilms_(films: ResFilm[]) {
        this.films = [];
        films.forEach((film) => {
            this.films.push(new Film(film, this.date));
        })
    }

    public getContent(date: moment.Moment){
        this.setDate(date);

        return(
            <Space direction="vertical">
                {this.errors !== ""?
                    <p>this.errors</p>
                :
                    <></>
                }
                Сеансы на {this.date.format("DD-MM-YY")}
                {this.films.map((film) =>
                    film.getContent()
                )}
            </Space>
        )
    }
}