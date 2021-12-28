import ResFilm from "../../../../interfaces/IResFilm";
import { Space, Typography } from "antd";
const { Text } = Typography;


export default function EditFilm(props: ResFilm) {
    return (
        <Space direction="horizontal">
            <Text>{props.name}</Text>
            <Text>{props.age_limit}+</Text>
            {props.genres.length !== 0 ?
                <>
                    <Text>Жанры:</Text>
                    {props.genres.map( elem => (
                        <Text>{elem.name}</Text>
                    ))}
                </>
                :
                <></>
            }
            <Text>{props.description}</Text>
        </Space>
    )
}