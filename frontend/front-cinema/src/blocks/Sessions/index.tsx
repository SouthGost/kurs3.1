import { useState, useMemo, useEffect } from 'react';
import Table from '../../classes/Table';
import User from '../../classes/User';
import Employee from '../../classes/Employee';
import { Modal, DatePicker, Space, Typography, Button } from 'antd';
import Film from '../../classes/Film';
import moment from 'moment';
import { useAppSelector } from './../../reducers/store';
import Place from '../../classes/Place';
const { Text, Title } = Typography;
type modal = {
    title: string,
    content: JSX.Element
}

export default function Sessions() {
    const [choosedDate, setChoosedDate] = useState(moment());
    const [table, setTable] = useState<Table | null>();
    const [content, setContent] = useState<JSX.Element>();
    const [modal, setModal] = useState<modal>();
    const [choosedPlace, setChoosedPlace] = useState<Place[]>([])
    const user = useAppSelector(state => state.user.val);
    // const [toPay, setToPay] = useState(0);

    const showModal = (title: string, elem: JSX.Element) => {
        document.body.style.overflow = 'hidden';
        setModal({ title, content: elem });
    }

    useEffect(() => {
        if (table !== null && table !== undefined) {
            table.setUser(user);
        }
    });

    // const changeChoosedPlace = (action: string, place: Place) => {
    //     if (action == "add") {
    //         if (choosedPlace.indexOf(place) === -1) {
    //             setChoosedPlace([...choosedPlace, place]);
    //         }
    //     } else if (action == "delete") {
    //         if (choosedPlace.indexOf(place) !== -1) {
    //             setChoosedPlace(
    //                 choosedPlace.filter((elem) => {
    //                     if (elem !== place) {
    //                         return elem;
    //                     };
    //                 })
    //             );
    //         }
    //     }
    // }

    // useEffect(()=>{
    //     let cost = 0;
    //     choosedPlace.forEach(place => {
    //         cost += place.getCost();
    //     })
    //     setToPay(cost);
    // }, [choosedPlace])

    useEffect(() => {
        async function waitTable() {
            try {
                const table_ = await Table.createTable(choosedDate, showModal, user);
                setTable(table_);
            } catch (e) {
                setTable(null);
            }
        }

        waitTable();
    }, []);

    useEffect(() => {
        async function waitContent() {
            if (table !== null && table !== undefined) {
                setContent(await table.getContent(choosedDate));
            }
        }

        waitContent();
    }, [choosedDate, table]);

    return (
        <Space
            direction="vertical"
        >
            <DatePicker
                value={choosedDate}
                allowClear={false}
                onChange={(date, dateString) => {
                    console.log(date, dateString);
                    setChoosedDate(date!);
                }}
            />
            {table === undefined ?
                <Text>Загрузка</Text>
                :
                table !== null ?
                    content
                    :
                    <Text>У нас проблемы. Подождите немного</Text>
            }
            {modal === undefined ?
                <></>
                :
                <div id="modal_contrainer">
                    <div id="modal">
                        <Space direction='vertical'>
                            <Space direction='horizontal'>
                                <Title level={3}>
                                    {modal.title}
                                </Title>
                                <Button
                                    onClick={() => {
                                        setModal(undefined)
                                        document.body.style.overflow = 'auto';
                                    }}
                                >
                                    Закрыть
                                </Button>
                            </Space>
                            {modal.content}
                        </Space>
                    </div>
                </div>
            }

        </Space>
    );
};