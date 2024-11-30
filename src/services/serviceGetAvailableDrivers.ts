import getDrivers from "./serviceGetDriver";


const getAvailableDrivers = async (distanceMeters: number): Promise<AvailableDriver[]> => {
    const drivers = await getDrivers();
    const filteredDrivers = filterDriversByDistance(drivers, distanceMeters);
    return filteredDrivers.map(driver => mapDriverToAvailableDriver(driver, distanceMeters));
};

const filterDriversByDistance = (drivers: GetDriver[], distanceMeters: number): GetDriver[] => {
    return drivers.filter(driver => distanceMeters >= driver.minKm * 1000);
};

const mapDriverToAvailableDriver = (driver: GetDriver, distanceMeters: number): AvailableDriver => {
    return {
        id: driver.id,
        name: driver.name,
        description: driver.description,
        vehicle: driver.car,
        review: {
            rating: driver.rating,
            comment: driver.review,
        },
        value: ((distanceMeters / 1000) * driver.ratePerKm).toFixed(2),
    };
};

export default getAvailableDrivers;