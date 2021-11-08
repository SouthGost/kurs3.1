import './style.css';
import Film from '../../../classes/Film';

interface IFilm_ {
    film: Film,
    setChoosedSession: React.Dispatch<React.SetStateAction<Film|undefined>>
};

export default function Session(props:IFilm_) {

    return (
        <div className="session">
            <img src="/" alt={props.film.getPosterUrl()} />
            <p>{props.film.getName()}</p>
            <p>{props.film.getAgeLimit()}</p>
            <p>{props.film.getGenre()}</p>
            <p>{props.film.getDescription()}</p>
            <p>{props.film.getPosterUrl()}</p>
            <button onClick={() => {
                props.setChoosedSession(props.film);
            }}>Купить билет</button>
        </div>
    );
}