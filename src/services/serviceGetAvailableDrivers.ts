import { getDrivers } from "./serviceGetDriver";

export async function getAvailableDrivers(distanceMeters: number) {
    const drivers = await getDrivers();

    const availableDrivers = drivers
        .filter((driver) => distanceMeters >= driver.minKm * 1000) 
        .map((driver) => ({
            id: driver.id,
            name: driver.name,
            description: driver.description,
            vehicle: driver.car,
            review: {
                rating: driver.rating,
                comment: driver.review,
            },
            value: ((distanceMeters / 1000) * driver.ratePerKm).toFixed(2),
        }));

    return availableDrivers;
}


