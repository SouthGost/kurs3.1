import Place from "./Place";
import ResPlace from "../interfaces/IResPlace";
import ResTicket from "../interfaces/IResTicket";
import ResSession from "../interfaces/IResSession";
import moment from 'moment';
import { Button, Space, Modal } from "antd";
import Hall from "./Hall";
import User from "./User";

export default class Session {
    private id: number;
    private film_id: number;
    private hall_id: number;
    private cost: number;
    private view_type_id: number;
    private date: moment.Moment;
    private hall: Hall | undefined;
    private showModal: (title: string, elem: JSX.Element) => void;
    private user: User | undefined = undefined;


    public constructor(
        session: ResSession,
        showModal: (title: string, elem: JSX.Element) => void,
        // user: User
        // changeChoosedPlace: (action: string, place: Place) => void
    ) {
        this.id = session.id;
        this.film_id = session.film_id;
        this.hall_id = session.hall_id;
        this.cost = session.cost;
        this.view_type_id = session.view_type_id;
        this.date = moment(session.date, "x");
        this.showModal = showModal;
        // this.user = user;
    }

    public static async loadSessions(date: moment.Moment, film_id: number) {
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

    public setUser(user: User){
        this.user = user;
        if(this.hall !== undefined){
            this.hall.setUser(user);
        }
    }

    public getContent() {
        const isDisableButton = moment() > this.date;
        
        return (
            <>
                <Button
                    style={{
                        height: "100%"
                    }}
                    disabled={isDisableButton}
                    onClick={async () => {
                        try{
                            if (this.hall == undefined) {
                                this.hall = await Hall.createHall(this.hall_id, this.cost, this.id, this.showModal, this.user!);
                            }
                            await this.hall.updatePlaces();
                            this.showModal(this.hall.getName(), this.hall.getContent());
                        }catch(e){
                            Modal.error({title:"Ошибка", content: "У нас проблемы. Подождите немного."})
                        }
                    }}
                >
                    <Space direction="vertical">
                        <div>
                            {this.date.format("HH:mm")}
                        </div>
                        <div>
                            {this.cost}
                        </div>
                    </Space>
                </Button>
            </> 
        )
    }

}