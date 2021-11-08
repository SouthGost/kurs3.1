import './style.css';

export default function Session(props){
    return(
        <div className="session">
            <img src="/" alt={props.posterUrl}/>
            <p>{props.name}</p>
            <p>{props.ageLimit}</p>
            <p>{props.genre}</p>
            <p>{props.description}</p>
            <p>{props.posterUrl}</p>
        </div>
    );
}