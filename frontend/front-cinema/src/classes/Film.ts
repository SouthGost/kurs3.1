import ResFilm from "../interfaces/IResFilm";
import ResSession from '../interfaces/IResSession';
import Session from './Session';

export default class Film{
    private sessions: Session[];
    private id;
    private name: string;
    private ageLimit: string;
    private genre: string[];
    private description: string;
    private posterUrl: string;

    public constructor(
        film:ResFilm,
        date:number = 0
    ){
        this.id = film.id;
        this.name = film.name;
        this.ageLimit = film.ageLimit;
        this.genre = film.genre;
        this.description = film.description;
        this.posterUrl = film.posterUrl;
        this.sessions = [];
        if(date = 0){
            const today = new Date();
            this.setSessions(new Date(today.getFullYear(), today.getMonth(), today.getDate(), 5).getTime());
        }else {
            this.setSessions(date);
        }
    }

    async setSessions(date:number){
        const params = {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                film_id: this.id,
                date,
            }),
        };

        try {
            const response = await fetch(`http://localhost:8000/api/info/sessions`, params);
            if (response.ok) {
                const data = await response.json();
                this.setSessions_(data.sessions);
                console.log(data);
            } else {
                throw new Error("Не найдены сеансы");
            }
        } catch (err) {
            throw new Error("У нас что-то происходит не так. Подождите немного.");
        }
    }

    private setSessions_(sessions:ResSession[]){
        this.sessions = [];
        sessions.forEach((session) => {
            this.sessions.push(new Session(session));
        });
    }

    getName():string {
        return this.name;
    }

    getAgeLimit():string {
        return this.ageLimit;
    }

    getGenre():string[] {
        return this.genre;
    }

    getDescription():string {
        return this.description;
    }

    getPosterUrl():string {
        return this.posterUrl;
    }
}