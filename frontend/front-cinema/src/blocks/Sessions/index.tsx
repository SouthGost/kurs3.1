import { useState } from 'react';
import Session from "./Session";
import { Modal } from 'antd';
import Film from '../../classes/Film';

export default function Sessions(){
    const [choosedSession, setChoosedSession] = useState<Film|undefined>(undefined);
    const data = [
        new Film(
            "имя1",
            "возрастОгр1",
            "Жанр1",
            "описание1",
            "путьКартинки1",
        ),
        new Film(
            "имя2",
            "возрастОгр2",
            "Жанр2",
            "описание2",
            "путьКартинки2",
        ),new Film(
            "имя3",
            "возрастОгр3",
            "Жанр3",
            "описание3",
            "путьКартинки3",
        ),
    ];

    return(
        <div>
            {data.map(elem => (
                <Session film={elem} setChoosedSession={setChoosedSession}/>
            ))}
            <Modal
                title={choosedSession?.getName()}
                visible={choosedSession === undefined ? false : true}
                onOk={() => setChoosedSession(undefined)}
                onCancel={() => setChoosedSession(undefined)}
                width={1000}
            >
                <p>some contents..</p>
                <p>some contents..</p>
                <p>some contents..</p>
            </Modal>
        </div>
    );
};