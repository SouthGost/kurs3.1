import Session from "./Session";

export default function Sessions(){
    const data = [
        {
            name: "имя",
            ageLimit: "возрастОгр",
            genre: "Жанр",
            description: "описание",
            posterUrl: "путьКартинки",
        },
        {
            name: "имя",
            ageLimit: "возрастОгр",
            genre: "Жанр",
            description: "описание",
            posterUrl: "путьКартинки",
        },
        {
            name: "имя",
            ageLimit: "возрастОгр",
            genre: "Жанр",
            description: "описание",
            posterUrl: "путьКартинки",
        },
    ];

    return(
        <div>
            {data.map(elem => (
                <Session {...elem}/>
            ))}
        </div>
    );
};