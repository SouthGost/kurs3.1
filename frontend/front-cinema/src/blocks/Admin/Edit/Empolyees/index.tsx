import { Modal, Space, Typography, Table, Select, Button, Input, notification } from "antd";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import FetchRequest from "../../../../classes/FetchRequest";
import ResEmployee from "../../../../interfaces/IResEmployee";
import { useAppSelector } from "../../../../reducers/store";
const { Text, Title, Paragraph } = Typography;
const { Option } = Select;
type property = "newPassword" | "position" | "name" | "surname" | "patronymic";
type changedEmployee = {
    login: string,
    position: string,
    name: string,
    surname: string,
    patronymic: string,
    newPassword: string,
    changed: boolean,
    used: boolean
};

export default function EditEmpolyee() {
    const [resEmployees, setResEmployees] = useState<ResEmployee[]>();
    const [employees, setEmployees] = useState<changedEmployee[]>();
    const token = Cookies.get("token");
    const user = useAppSelector(state => state.user.val);

    useEffect(() => {
        const position = user.getPosition();
        const login = user.getLogin();

        if ((position !== "admin" && login !== "") || token === undefined) {
            window.location.replace("http://localhost:3000/admin");
        }
    }, [user]);

    async function loadEmployees() {
        try {
            setResEmployees(await FetchRequest.getEmployees());
        } catch (err) {
            Modal.error({
                title: 'Ошибка',
                content: 'У нас проблемы. Подождите немного.',
            });
        }
    }

    useEffect(() => {
        loadEmployees()
    }, []);

    useEffect(() => {
        if (resEmployees !== undefined) {
            const employee_: changedEmployee[] = [];
            resEmployees.forEach(elem => {
                employee_.push({ ...elem, newPassword: "", changed: false})
            })

            setEmployees(employee_);
        }
    }, [resEmployees])

    function changeString(login: string, property: property, newVal: string) {
        setEmployees(employees!.filter(elem => {
            if (elem.login === login) {
                elem[property] = newVal;
                elem.changed = true;
            }
            return elem;
        }))
    }

    const columns = [
        {
            title: "Логин",
            dataIndex: "login",
            key: "id",
            render: (login: string, employee: changedEmployee) =>
                <Text delete={!employee.used}>{login}</Text>
        },
        {
            title: "Новый Пароль",
            dataIndex: "newPassword",
            key: "id",
            render: (newPassword: string, employee: changedEmployee) =>
                <Input
                    type="password"
                    value={newPassword}
                    disabled={!employee.used}
                    onChange={(event) => {
                        changeString(employee.login, "newPassword", event.target.value);
                    }}
                ></Input>
        },
        {
            title: "Должность",
            dataIndex: "position",
            key: "id",
            render: (position: string, employee: changedEmployee) =>
                <Select
                    value={position}
                    disabled={!employee.used}
                    onChange={(value) => {
                        if (value !== undefined) {
                            changeString(employee.login, "position", value);
                        }
                    }}
                >
                    <Option value={"seller"}>
                        Продавец
                    </Option>
                    <Option value={"admin"}>
                        Администратор
                    </Option>
                </Select>
        },
        {
            title: "Имя",
            dataIndex: "name",
            key: "id",
            render: (name: string, employee: changedEmployee) =>
                employee.used ?
                    <Paragraph
                        editable={{
                            onChange: (value) => {
                                if (value !== "") {
                                    changeString(employee.login, "name", value);
                                }
                            }
                        }}
                    >
                        {name}
                    </Paragraph >
                    :
                    <Text delete>{name}</Text>
        },
        {
            title: "Фамилия",
            dataIndex: "surname",
            key: "id",
            render: (surname: string, employee: changedEmployee) =>
                employee.used ?
                    <Paragraph
                        editable={{
                            onChange: (value) => {
                                if (value !== "") {
                                    changeString(employee.login, "surname", value);
                                }
                            }
                        }}
                    >
                        {surname}
                    </Paragraph >
                    :
                    <Text delete>{surname}</Text>
        },
        {
            title: "Отчество",
            dataIndex: "patronymic",
            key: "id",
            render: (patronymic: string, employee: changedEmployee) =>
                employee.used ?
                    <Paragraph
                        editable={{
                            onChange: (value) => {
                                changeString(employee.login, "patronymic", value);
                            }
                        }}
                    >
                        {patronymic}
                    </Paragraph >
                    :
                    <Text delete>{patronymic}</Text>
        },
        {
            title: "",
            dataIndex: "used",
            key: "id",
            render: (used: boolean, employee: changedEmployee) =>
                <Button
                    type={!used? "primary" : "default"}
                    onClick={() => {
                        setEmployees(employees!.filter(elem => {
                            if (elem.login == employee.login) {
                                elem.used = !elem.used;
                                elem.changed = true;
                            }
                            return elem;
                        }))
                    }}
                >
                    {used ? "Удалить" : "Не удалять"}
                </Button>

        },
        {
            title: "",
            dataIndex: "changed",
            key: "id",
            render: (isChanged: boolean, employee: changedEmployee) =>
                <Button
                    disabled={!isChanged}
                    onClick={() => {
                        setEmployees(employees!.filter(elem => {
                            if (elem.login == employee.login) {
                                const oldEmployee = resEmployees!.find(resEmployee => resEmployee.login === employee.login);
                                if (oldEmployee !== undefined) {
                                    elem.newPassword = "";
                                    elem.position = oldEmployee.position;
                                    elem.name = oldEmployee.name;
                                    elem.surname = oldEmployee.surname;
                                    elem.patronymic = oldEmployee.patronymic;
                                    elem.used = true;
                                    elem.changed = false;
                                } else {
                                    Modal.error({
                                        title: "Ошибка"
                                    })
                                }
                            }
                            return elem;
                        }))
                    }}
                >
                    Вернуть
                </Button>

        }
    ]

    async function sendChangedEmployees() {
        const changedEmployees = employees!.filter(elem => elem.changed === true)

        if(changedEmployees.length === 0){
            notification.warning({
                message: "Ошибка",
                description: "Вы ничего не поменяли",
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
                Modal.success({
                    title: "Данные успешно изменены",
                });
                setResEmployees(undefined);
                await loadEmployees();
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
            <Title>Редактирование работников</Title>
            {employees === undefined ?
                <Text>Загрузка</Text>
                :
                <>
                    <Table pagination={false} columns={columns} dataSource={employees} />
                    <Button
                        type="primary"
                        onClick={sendChangedEmployees}
                    >
                        Отправить
                    </Button>
                </>
            }
        </Space>
    )
}