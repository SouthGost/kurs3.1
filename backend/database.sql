-- exampels
create TABLE film(
    id SERIAL PRIMARY KEY,
    name VARCHAR(255)
);

create TABLE session(
    id SERIAL PRIMARY KEY,
    hall VARCHAR(255),
    film_id INTEGER,
    FOREIGN KEY (film_id) REFERENCES film (id)
);