import IGenre from './IGenre';

interface ResFilm {
    id: number,
    name: string,
    age_limit: string,
    genres: IGenre[],
    description: string,
    used: boolean,
};

export default ResFilm;