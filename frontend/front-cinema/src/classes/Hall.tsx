import Place from "./Place";
import ResPlace from "../interfaces/IResPlace";
import ResTicket from "../interfaces/IResTicket";
import ResHaall from "../interfaces/IResHall";
import ResPlaceCategory from "../interfaces/IResPlaceCategory";
import PlaceCategory from './PlaceCategory';
import moment from 'moment';
import { Button, Space, Typography } from "antd";
import User from "./User";
const { Text } = Typography;

export default class Hall {
    private places: Place[][];
    private id: number;
    private session_id: number;
    private name: string;
    private user: User;
    private showModal: (title: string, elem: JSX.Element) => void;

    private constructor(
        hall: ResHaall,
        sessionCost: number,
        session_id: number,
        res_places: ResPlace[],
        place_categorys: ResPlaceCategory[],
        showModal: (title: string, elem: JSX.Element) => void,
        user:  User
        // changeChoosedPlace: (action: string, place: Place) => void
    ) {
        this.id = hall.id;
        this.name = hall.name;
        this.session_id = session_id;
        this.places = [];
        this.user = user;
        this.showModal = showModal;
        res_places.forEach((place) => {
            if (this.places[place.row] == undefined) {
                this.places[place.row] = [];
            }
            const placeCategory = place_categorys.find((category) => category.id === place.place_category_id)
            if (placeCategory === undefined) {
                throw new Error("Не существующая каиегория места");
            }
            this.places[place.row][place.number] = new Place(
                sessionCost,
                place,
                new PlaceCategory(placeCategory),
                () => {
                    showModal(this.name, this.getContent())
                }
            );
        });
    }

    public static async createHall(
        hall_id: number,
        sessionCost: number,
        session_id: number,
        showModal: (title: string, elem: JSX.Element) => void,
        user:  User
        // changeChoosedPlace: (action: string, place: Place) => void
    ) {
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
                const data = await response.json();
                return new Hall(data.hall, sessionCost, session_id, data.places, data.place_categorys, showModal, user);
            } else {
                throw new Error("Не найден зал");
            }
        } catch (err) {
            throw new Error("У нас проблемы. Подождите немного.");
        }
    }

    async updatePlaces() {
        const params = {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                session_id: this.session_id,
            }),
        };

        try {
            const response = await fetch(`http://localhost:8000/api/info/tickets`, params);
            if (response.ok) {
                const data = await response.json();
                this.updatePlaces_(data.tickets);
                // console.log(data);
            } else {
                throw new Error("Не найден сеанс");
            }
        } catch (err) {
            throw new Error("У нас проблемы. Подождите немного.");
        }
    }

    private async updatePlaces_(
        boughtTicket: ResTicket[],
    ) {
        this.places.forEach((elem) => {
            elem.forEach(place => {
                const id = place.getId();
                if (boughtTicket.find(ticket => ticket.place_id === id) !== undefined) {
                    if (place.getState() !== "busy") {
                        place.setState("busy");
                    }
                } else {
                    if (place.getState() !== "free") {
                        place.setState("free");
                    }
                }
            })
        });
    }

    private getCostOfCoosed() {
        let cost = 0;
        this.places.forEach((elem) => {
            elem.forEach(place => {
                if (place.getState() === "choosed") {
                    cost += place.getCost();
                }
            })
        })
        return cost;
    }

    public setUser(user: User){
        this.user = user;
    }

    private async buyTickets() {
        const choosedPlaces: number[] = []
        this.places.forEach((elem) => {
            elem.forEach(place => {
                if (place.getState() === "choosed") {
                    choosedPlaces.push(place.getId());
                }
            })
        })

        let employee_login = null;
        let user_login = null;
        if (this.user.getLogin() !== "") {
            if (this.user.getPosition() !== "User") {
                employee_login = this.user.getLogin();
            } else {
                user_login = this.user.getLogin();
            }

        }

        const params = {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                session_id: this.session_id,
                choosed_places: choosedPlaces,
                employee_login,
                user_login
            }),
        };

        try {
            const response = await fetch(`http://localhost:8000/api/add/tickets`, params);
            if (response.ok) {
                const data = await response.json();
                console.log(data)
                await this.updatePlaces();
                this.showModal(this.name, this.getContent())
                //-----------действие--------
                // console.log(data);
            } else {
                throw new Error("Не найден сеанс");
            }
        } catch (err) {
            throw new Error("У нас проблемы. Подождите немного.");
        }

    }

    public getName() {
        return this.name;
    }

    public getContent() {
        const toPay = this.getCostOfCoosed();
        return (
            <Space direction="vertical">
                {this.places.map((elem, index) => (
                    <Space direction="horizontal">
                        <Text>{index} ряд</Text>
                        <Space direction="horizontal">
                            {elem.map(place => (
                                place.getContent()
                            ))}
                        </Space>
                    </Space>
                ))}
                <Space direction='horizontal'>
                    {toPay === 0 ?
                        <></>
                        :
                        <Text>
                            Стоимость {toPay}
                        </Text>
                    }
                    <Button
                        disabled={toPay === 0}
                        onClick={() => {
                            this.buyTickets()
                        }}
                    >
                        Купить билеты
                    </Button>
                </Space>
            </Space>
        )
    }

}