CREATE TABLE drivers (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    car TEXT NOT NULL,
    rating FLOAT NOT NULL,
    ratePerKm FLOAT NOT NULL,
    minKm INT NOT NULL,
    review TEXT NOT NULL
);

CREATE TABLE trips (
    id SERIAL PRIMARY KEY,
    customer_id TEXT NOT NULL,
    origin TEXT NOT NULL,
    destination TEXT NOT NULL,
    duration TEXT NOT NULL,
    distance FLOAT NOT NULL,
    driverId INT NOT NULL REFERENCES drivers(id),
    driverName TEXT NOT NULL,
    value FLOAT NOT NULL,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
