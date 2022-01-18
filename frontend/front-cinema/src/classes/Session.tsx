import ResSession from "../interfaces/IResSession";
import moment from 'moment';
import { Button, Space, Modal, Typography, Badge } from "antd";
import Hall from "./Hall";
import User from "./User";
import ResViewType from "../interfaces/IResViewType";
const { Text, Title } = Typography;

export default class Session {
    private id: number;
    private film_name: string;
    private hall_id: number;
    private cost: number;
    private view_type: ResViewType;
    private date: moment.Moment;
    private hall: Hall | undefined;
    private showModal: (title: string, elem: JSX.Element) => void;
    private user: User | undefined = undefined;


    public constructor(
        session: ResSession,
        film_name: string,
        view_type: ResViewType,
        showModal: (title: string, elem: JSX.Element) => void,
    ) {
        this.id = session.id;
        this.film_name = film_name;
        this.hall_id = session.hall_id;
        this.cost = session.cost;
        this.view_type = view_type;
        this.date = moment(session.date, "x");
        this.showModal = showModal;
    }

    public setUser(user: User) {
        this.user = user;
        if (this.hall !== undefined) {
            this.hall.setUser(user);
        }
    }

    public getDate() {
        return this.date;
    }

    public getContent() {

        return (
            <>
                <Badge count={<Title level={5}>{this.view_type.d}D </Title>}>
                    <Button
                        style={{
                            height: "100%",
                        }}
                        onClick={async () => {
                            try {
                                const showModal_ = (title: string, elem: JSX.Element) => this.showModal(`${this.film_name} ${this.view_type.d}D ${this.view_type.palette !== "default" ? this.view_type.palette : ""} ${this.view_type.audio !== "default" ? this.view_type.audio : ""} ${title}`, elem)
                                if (this.hall == undefined) {
                                    this.hall = await Hall.createHall(this.hall_id, this.cost, this.id, showModal_, this.user!);
                                }
                                await this.hall.updatePlaces();
                                showModal_(this.hall.getName(), this.hall.getContent());
                            } catch (e) {
                                Modal.error({ title: "Ошибка", content: "У нас проблемы. Подождите немного." })
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
                </Badge>
            </>
        )
    }

}