import moment from "moment";
import Genre from "../interfaces/IGenre";

export default class FetchRequest {

    public static async getAllSessions() {
        const params = {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            }
        };

        try {
            const response = await fetch(`http://localhost:8000/api/info/allsessions`, params);
            if (response.ok) {
                const data = await response.json();
                return data.sessions;
            } else {
                throw new Error("Не найдены сеансы");
            }
        } catch (err) {
            throw new Error("У нас проблемы. Подождите немного.");
        }
    }

    public static async getSessions(date: moment.Moment, film_id: number) {
        const params = {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                film_id,
                date: date.format('x'),
            }),
        };

        try {
            const response = await fetch(`http://localhost:8000/api/info/sessions`, params);
            if (response.ok) {
                const data = await response.json();
                return data.sessions;
            } else {
                throw new Error("Не найдены сеансы");
            }
        } catch (err) {
            throw new Error("У нас проблемы. Подождите немного.");
        }
    }

    public static async getTempSessions() {
        const params = {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            }
        };

        try {
            const response = await fetch(`http://localhost:8000/api/info/history/sessions`, params);
            if (response.ok) {
                const data = await response.json();
                return data.tempSessions;
            } else {
                throw new Error("Не найдены фильмы");
            }
        } catch (err) {
            throw new Error("У нас проблемы. Подождите немного.");
        }
    }

    public static async getSessionPlaces(session_id: number) {
        const params = {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                session_id,
            }),
        };

        try {
            const response = await fetch(`http://localhost:8000/api/info/tickets`, params);
            if (response.ok) {
                const data = await response.json();
                return data.tickets;
            } else {
                throw new Error("Не найден сеанс");
            }
        } catch (err) {
            throw new Error("У нас проблемы. Подождите немного.");
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

    public static async getFilms() {
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
                return data.films;
            } else {
                throw new Error("Не найдены фильмы");
            }
        } catch (err) {
            throw new Error("У нас проблемы. Подождите немного.");
        }
    }

    public static async getTempFilms() {
        const params = {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            }
        };

        try {
            const response = await fetch(`http://localhost:8000/api/info/history/films`, params);
            if (response.ok) {
                const data = await response.json();
                return data.tempFilms;
            } else {
                throw new Error("Не найдены фильмы");
            }
        } catch (err) {
            throw new Error("У нас проблемы. Подождите немного.");
        }
    }

    public static async getHalls() {
        const params = {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            }
        };

        try {
            const response = await fetch(`http://localhost:8000/api/info/halls`, params);
            if (response.ok) {
                const data = await response.json();
                return data.halls;
            } else {
                throw new Error("Не найдены залы");
            }
        } catch (err) {
            throw new Error("У нас проблемы. Подождите немного.");
        }
    }

    public static async getHallInfo(hall_id: number) {
        const params = {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                hall_id,
            }),
        };

        try {
            const response = await fetch(`http://localhost:8000/api/info/hall`, params);
            if (response.ok) {

                return (await response.json());
            } else {
                throw new Error("Не найден зал");
            }
        } catch (err) {
            throw new Error("У нас проблемы. Подождите немного.");
        }
    }

    public static async buyTickets(
        session_id: number,
        choosed_places: number[],
        employee_login: string | null,
        user_login: string | null,
    ) {
        if (choosed_places.length !== 0) {
            const params = {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    session_id,
                    choosed_places,
                    employee_login,
                    user_login
                }),
            };

            try {
                const response = await fetch(`http://localhost:8000/api/add/tickets`, params);
                if (response.ok) {
                    const blob = await response.blob()
                    const downloadUrl = window.URL.createObjectURL(blob)
                    const link = document.createElement('a')
                    link.href = downloadUrl
                    link.download = `tiket`
                    document.body.appendChild(link)
                    link.click()
                    link.remove()
                } else {
                    throw new Error("Покупка не получилась");
                }
            } catch (err) {
                throw new Error("У нас проблемы. Подождите немного.");
            }
        }
    }

    public static async getViewTypes() {
        const params = {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            }
        };

        try {
            const response = await fetch(`http://localhost:8000/api/info/viewTypes`, params);
            if (response.ok) {
                const data = await response.json();
                return data.view_types;
            } else {
                throw new Error("Не найдены Типы показа");
            }
        } catch (err) {
            throw new Error("У нас проблемы. Подождите немного.");
        }
    }

    public static async getViewType(id: number) {
        const params = {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                id
            }),
        };

        try {
            const response = await fetch(`http://localhost:8000/api/info/viewType`, params);
            if (response.ok) {
                const data = await response.json();
                return data.view_type;
            } else {
                throw new Error("Не найдены Типы показа");
            }
        } catch (err) {
            throw new Error("У нас проблемы. Подождите немного.");
        }
    }

    public static async getEmployees() {
        const params = {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            }
        };

        try {
            const response = await fetch(`http://localhost:8000/api/info/employees`, params);
            if (response.ok) {
                const data = await response.json();
                return data.employees;
            } else {
                throw new Error("Не найдены сеансы");
            }
        } catch (err) {
            throw new Error("У нас проблемы. Подождите немного.");
        }
    }

    public static async getTempEmployees() {
        const params = {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            }
        };

        try {
            const response = await fetch(`http://localhost:8000/api/info/history/employees`, params);
            if (response.ok) {
                const data = await response.json();
                return data.tempEmployees;
            } else {
                throw new Error("Не найдены фильмы");
            }
        } catch (err) {
            throw new Error("У нас проблемы. Подождите немного.");
        }
    }
}