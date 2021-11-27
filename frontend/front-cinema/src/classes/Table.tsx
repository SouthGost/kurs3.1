import Film from './Film';
import ResFilm from '../interfaces/IResFilm';


export default class Table {
    private date: number;
    private films: Film[];

    public constructor(date: number = 0) {
        if(date = 0){
            const today = new Date();
            this.date = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 5).getTime();
        } else{
            this.date = date;
        }
        this.films = [];
    }

    async setFilms(date: number) {
        this.date = date;
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
                throw new Error("Не найдены фильмы");
            }
        } catch (err) {
            throw new Error("У нас что-то происходит не так. Подождите немного.");
        }
    }

    private setFilms_(films: ResFilm[]) {
        this.films = [];
        films.forEach((film) => {
            this.films.push(new Film(film, this.date));
        })
    }
}