import IGenre from './IGenre';

interface IResTempFilm {
    id: number,
    date: string,
    action: string,
    film_id: number,
    name: string,
    age_limit: string,
    genres: IGenre[],
    description: string,
    used: boolean,
};

export default IResTempFilm;