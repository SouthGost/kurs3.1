import { useEffect, useState } from "react";
import ResTempEmployee from "../../../../interfaces/IResTempEmployee";
import FetchRequest from "../../../../classes/FetchRequest";
import ResEmployee from "../../../../interfaces/IResEmployee";
import { Modal, Space, Typography, Table, Button, notification } from "antd";
import Cookies from "js-cookie";
import { useAppSelector } from "../../../../reducers/store";
const { Text, Title } = Typography;
type TempEmployee = {
    id: number,
    date: string,
    action: string,
    login: string,
    password: string,
    position: string,
    name: string,
    surname: string,
    patronymic: string,
    used: boolean,
    choosed: boolean,
}

export default function HistoryEmployees() {
    const [tempEmployees, setTempEmployees] = useState<TempEmployee[]>();
    const token = Cookies.get("token");
    const user = useAppSelector(state => state.user.val);

    useEffect(() => {
        const position = user.getPosition();
        const login = user.getLogin();

        if ((position !== "admin" && login !== "") || token === undefined) {
            window.location.replace("http://localhost:3000/admin");
        }
    }, [user]);

    async function loadTempEmployees() {
        try {
            const resTempEmployees: ResTempEmployee[] = await FetchRequest.getTempEmployees();
            const tempEmployees_: TempEmployee[] = [];
            resTempEmployees.forEach(elem => {
                tempEmployees_.push({ ...elem, choosed: false })
            })
            setTempEmployees(tempEmployees_);
        } catch (error) {
            Modal.error({
                title: 'Ошибка',
                content: 'У нас проблемы. Подождите немного.',
            });
        }
    }

    useEffect(() => {
        loadTempEmployees();
    }, []);

    const columns = [
        {
            title: "",
            dataIndex: "choosed",
            key: "id",
            render: (choosed: string, tempEmployee: TempEmployee) =>
                <Button
                    type={choosed ? "primary" : "default"}
                    onClick={() => {
                        setTempEmployees(tempEmployees!.filter(elem => {
                            if (choosed) {
                                if (elem.id === tempEmployee.id) {
                                    elem.choosed = false;
                                }
                            } else {
                                if (elem.login === tempEmployee.login) {
                                    if (elem.id === tempEmployee.id) {
                                        elem.choosed = true;
                                    } else {
                                        elem.choosed = false;
                                    }
                                }
                            }

                            return elem;
                        }))
                    }}
                >
                    Откат
                </Button>
        },
        {
            title: "Действие",
            dataIndex: "action",
            key: "id",
            render: (action: string, tempEmployee: TempEmployee) =>
                <Title level={5}>
                    {action}
                </Title>
        },
        {
            title: "Дата",
            dataIndex: "date",
            key: "id",
        },
        {
            title: "Логин",
            dataIndex: "login",
            key: "id",
            render: (login: string, tempEmployee: TempEmployee) =>
                <Title level={5}>
                    {login}
                </Title>
        },
        {
            title: "Должность",
            dataIndex: "position",
            key: "id",
            render: (position: string, tempEmployee: TempEmployee) =>
                <Text>
                    {position === "admin" ?
                        "Администратор"
                        :
                        position === "seller" ?
                            "Продавец"
                            :
                            "Ошибка"
                    }
                </Text>
        },
        {
            title: "Имя",
            dataIndex: "name",
            key: "id",
        },
        {
            title: "Фамилия",
            dataIndex: "surname",
            key: "id",
        },
        {
            title: "Отчество",
            dataIndex: "patronymic",
            key: "id",
        },
    ]

    async function sendBackUpEmployees() {
        const changedEmployees: ResEmployee[] = []
        tempEmployees!.forEach(elem => {
            if (elem.choosed) {
                changedEmployees.push({
                    login: elem.login,
                    password: elem.password,
                    position: elem.position,
                    name: elem.name,
                    surname: elem.surname,
                    patronymic: elem.patronymic,
                    used: elem.used,
                });
            }
        })

        if (changedEmployees.length === 0) {
            notification.warning({
                message: "Ошибка",
                description: "Вы ничего не выбрали",
            });

            return;
        }

        const params = {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            }, body: JSON.stringify({
                changedEmployees,
                token
            }),
        };

        try {
            const response = await fetch(`http://localhost:8000/api/change/employees`, params);
            if (response.ok) {
                const data = await response.json();
                Modal.success({
                    title: "Данные успешно изменены",
                });
                await loadTempEmployees();
            } else {
                Modal.error({
                    title: 'Ошибка',
                    content: 'У нас проблемы. Подождите немного.',
                });
            }
        } catch (err) {
            Modal.error({
                title: 'Ошибка',
                content: 'У нас проблемы. Подождите немного.',
            });
        }
    }

    return (
        <Space direction="vertical">
            <Title>История работников</Title>
            {tempEmployees === undefined ?
                <Text>Загрузка</Text>
                :
                <>
                    <Table pagination={false} columns={columns} dataSource={tempEmployees} />
                    <Button
                        type="primary"
                        onClick={sendBackUpEmployees}
                    >
                        Отправить
                    </Button>
                </>
            }
        </Space>
    )
}