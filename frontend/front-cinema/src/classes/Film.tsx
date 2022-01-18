import ResFilm from "../interfaces/IResFilm";
import ResSession from '../interfaces/IResSession';
import IGenre from "../interfaces/IGenre";
import Session from './Session';
import { Space, Typography } from "antd";
import User from "./User";
import Paragraph from "antd/lib/typography/Paragraph";
import Title from "antd/lib/typography/Title";
import FetchRequest from "./FetchRequest";
const { Text } = Typography;


export default class Film {
    private sessions: Session[];
    private id: number;
    private name: string;
    private age_limit: string;
    private genres: IGenre[];
    private description: string;
    private showModal: (title: string, elem: JSX.Element) => void;

    public constructor(
        film: ResFilm,
        showModal: (title: string, elem: JSX.Element) => void,
    ) {
        this.id = film.id;
        this.name = film.name;
        this.age_limit = film.age_limit;
        this.genres = film.genres;
        this.description = film.description;
        this.sessions = [];
        this.showModal = showModal;
    }

    public async setSessions(sessions: ResSession[]) {
        this.sessions = [];
        for (const session of sessions) {
            this.sessions.push(new Session(session, this.name, await FetchRequest.getViewType(session.view_type_id), this.showModal));
        }
    }

    public setUser(user: User) {
        this.sessions.forEach(session => {
            session.setUser(user);
        })
    }

    public getId() {
        return this.id;
    }

    public getContent() {
        return (
            <Space
                direction="horizontal"
                className="film_conteiner"
                size={14}
            >
                <Space
                    direction="vertical"
                    style={{
                        width: "300px"
                    }}
                >
                    <Space direction="horizontal">
                        <Title level={2}>
                            {this.name}
                        </Title >
                        <Title level={2} code>
                            {this.age_limit}+
                        </Title>
                    </Space>
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
                    <Paragraph
                        style={{
                            width: "300px",
                            display: "flex",
                            wordBreak: "break-word",
                            whiteSpace: "normal",
                        }}
                        ellipsis={{
                            expandable: true,
                            symbol: "показать",
                        }}
                    >
                        {this.description}
                    </Paragraph>
                </Space>
                {this.sessions.length !== 0 ?
                    this.sessions.map((session) =>
                        session.getContent()
                    )
                    :
                    <Text>Нет сеансов</Text>
                }
            </Space>
        )
    }

}