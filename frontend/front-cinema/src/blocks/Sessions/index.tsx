import { useState, useMemo, useEffect } from 'react';
import Table from '../../classes/Table';
import User from '../../classes/User';
import Employee from '../../classes/Employee';
import { Modal, DatePicker, Space } from 'antd';
import Film from '../../classes/Film';
import moment from 'moment';

export default function Sessions() {
    const [choosedDate, setChoosedDate] = useState(moment());
    const [choosedSession, setChoosedSession] = useState<Film | false>(false);
    const table = useMemo( () => new  Table(choosedDate) ,[]);

    useEffect(() =>{
        // table.setDate(choosedDate);
        console.log(choosedDate);
    }, [choosedDate])

    // const data = [
    //     new Film(
    //         "имя1",
    //         "возрастОгр1",
    //         ["Жанр1"],
    //         "описание1",
    //         "путьКартинки1",
    //     ),
    //     new Film(
    //         "имя2",
    //         "возрастОгр2",
    //         "Жанр2",
    //         "описание2",
    //         "путьКартинки2",
    //     ),
    //     new Film(
    //         "имя3",
    //         "возрастОгр3",
    //         "Жанр3",
    //         "описание3",
    //         "путьКартинки3",
    //     ),
    // ];

    return (
        <Space direction="vertical">
            <DatePicker
                    value={choosedDate}
                    allowClear={false}
                    onChange={(date, dateString) => {
                        console.log(date, dateString);
                        setChoosedDate(date!);
                    }}
                />
            {table.getContent(choosedDate)}
            {/* <Modal
                title={choosedSession !== false ? choosedSession.getName() : true}
                visible={choosedSession === false ? false : true}
                onOk={() => setChoosedSession(false)}
                // cancelButtonProps={{ : false }}
                width={1000}
            >
                <p>some contents..</p>
                <p>some contents..</p>
                <p>some contents..</p>
            </Modal> */}
        </Space>
    );
};