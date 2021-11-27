import Place from "./Place";
import ResPlace from "../interfaces/IResPlace";
import ResTicket from "../interfaces/IResTicket";
import ResSession from "../interfaces/IResSession";

export default class Session {
    private places: Place[];
    private id: number;
    private film_id: number;
    private hall_id: number;
    private cost: number;
    private view_type_id: number;
    private date: number;

    public constructor(
        session:ResSession
    ) {
        this.id = session.id;
        this.film_id = session.film_id;
        this.hall_id = session.hall_id;
        this.cost = session.cost;
        this.view_type_id = session.view_type_id;
        this.date = session.date;
        this.places = [];
    }

    async updatePlaces() {
        const params = {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                session_id: this.id,
                hall_id: this.hall_id,
            }),
        };

        try {
            const response = await fetch(`http://localhost:8000/api/info/places`, params);
            if (response.ok) {
                const data = await response.json();
                this.updatePlaces_(data.places, data.tickets);
                // console.log(data);
            } else {
                throw new Error("Не найден сеанс");
            }
        } catch (err) {
            throw new Error("У нас что-то происходит не так. Подождите немного.");
        }
    }

    private updatePlaces_(
        allPlaces: ResPlace[],
        boughtTicket: ResTicket[],
    ) {
        this.places = [];
        allPlaces.forEach((place) => {
            if (boughtTicket.find(ticket => ticket.place_id === place.id) !== undefined) {
                this.places.push(new Place(place.row, place.number, "busy"));
            } else {
                this.places.push(new Place(place.row, place.number, "free"));
            }
        });
    }

}