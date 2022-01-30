import { useEffect, useState } from "react";
import FetchRequest from "../../../../classes/FetchRequest";
import { Modal, Space, Typography, Table, Button, notification } from "antd";
import Cookies from "js-cookie";
import { useAppSelector } from "../../../../reducers/store";
const { Text, Title } = Typography;
type backupFile = {
    id: number,
    fileName: string,
    choosed: boolean,
}

export default function HistoryEmployees() {
    const [backups, setBackups] = useState<backupFile[]>();
    const token = Cookies.get("token");
    const user = useAppSelector(state => state.user.val);

    useEffect(() => {
        const position = user.getPosition();
        const login = user.getLogin();

        if ((position !== "admin" && login !== "") || token === undefined) {
            window.location.replace("http://localhost:3000/admin");
        }
    }, [user]);

    async function loadBackups() {
        try {
            const resBackups: string[] = await FetchRequest.getBackups()
            const backups_: backupFile[] = [];
            resBackups.forEach((elem, id) => {
                backups_.push({ fileName: elem, id: id + 1, choosed: false })
            })
            setBackups(backups_);
        } catch (error) {
            Modal.error({
                title: 'Ошибка',
                content: 'У нас проблемы. Подождите немного.',
            });
        }
    }

    useEffect(() => {
        loadBackups();
    }, []);

    const columns = [
        {
            title: "",
            dataIndex: "id",
            key: "id",
        },
        {
            title: "База данных",
            dataIndex: "fileName",
            key: "id",
            render: (fileName: string) =>
                <Title level={5}>
                    {fileName}
                </Title>
        },
        {
            title: "",
            dataIndex: "choosed",
            key: "id",
            render: (choosed: boolean, file:backupFile) =>
                <Button
                    type={choosed ? "primary" : "default"}
                    onClick={() => {
                        if (choosed) {
                            setBackups(backups!.filter(elem => {
                                elem.choosed = false
                                return elem;
                            }))
                        } else {
                            setBackups(backups!.filter(elem => {
                                if(file.id === elem.id) {
                                    elem.choosed = true;
                                } else {
                                    elem.choosed = false;
                                }
                                return elem;
                            }))
                        }
                    }}
                >
                    {!choosed ? "Выбрать" : "Отмена"}
                </Button>
        },
    ]

    async function addBackup() {
        try {
            await FetchRequest.addBackups(token!);
            Modal.success({
                title: "Резервная копия созданна",
            });
            loadBackups();
        } catch (e) {
            Modal.error({
                title: 'Ошибка',
                content: 'У нас проблемы. Подождите немного.',
            });
        }
    }

    async function chooseBackup() {
        const choosedBackup = backups!.find(elem => elem.choosed);

        if (choosedBackup === undefined) {
            notification.warning({
                message: "Ошибка",
                description: "Вы ничего не выбрали",
            });

            return;
        }

        try {
            await FetchRequest.changeDB(choosedBackup.fileName, token!);
            Modal.success({
                title: "База данных изменена",
            });
            loadBackups();
        } catch (e) {
            Modal.error({
                title: 'Ошибка',
                content: 'У нас проблемы. Подождите немного.',
            });
        }
    }

    return (
        <Space direction="vertical">
            <Title>Резервные копии БД</Title>
            {backups === undefined ?
                <Text>Загрузка</Text>
                :
                <>
                    <Table pagination={false} columns={columns} dataSource={backups} />
                    <Button
                        type="primary"
                        onClick={chooseBackup}
                    >
                        Восстановить
                    </Button>
                    <Button
                        type="primary"
                        onClick={addBackup}
                    >
                        Создать резервную копию
                    </Button>
                </>
            }
        </Space>
    )
}