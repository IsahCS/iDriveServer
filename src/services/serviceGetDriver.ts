import pool from "../../db";

pool.connect()
    .then(() => console.log('Conectado ao banco de dados' + process.env.DATABASE_URL))
    .catch((err) => console.error('Erro ao conectar ao banco:', err));

const getDrivers = async () => {
    try {
        const result = await pool.query(`
            SELECT id, name, description, car, rating, ratePerKm, minKm, review
            FROM drivers
        `);

        return result.rows.map(mapDriver);

    } catch (error) {
        console.error("Erro ao buscar motoristas:", error);
        throw new Error("Erro ao buscar motoristas: " + error);
    }
}

const mapDriver = (driver: any) => {
    return {
        id: driver.id,
        name: driver.name,
        description: driver.description,
        car: driver.car,
        rating: driver.rating,
        ratePerKm: driver.rateperkm,
        minKm: driver.minkm,
        review: driver.review
    };
}

export default getDrivers;