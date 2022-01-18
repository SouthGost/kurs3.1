interface IResSession {
    id: number,
    date: string,
    action: string,
    session_id: number,
    film_id: number,
    hall_id: number,
    cost: number,
    view_type_id: number,
    session_date: number,
    used: boolean,
};

export default IResSession;