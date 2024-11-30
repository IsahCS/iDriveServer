interface Driver {
    id: number;
    name: string;
}

interface Trip {
    id: number;
    createdat: Date;
    origin: string;
    destination: string;
    distance: number;
    duration: string;
    driverid: number;
    drivername: string;
    value: number;
}

interface RideHistory {
    customer_id: string;
    rides: {
        id: number;
        date: Date;
        origin: string;
        destination: string;
        distance: number;
        duration: string;
        driver: Driver;
        value: number;
    }[];
}

interface AvailableDriver {
    id: number;
    name: string;
    description: string;
    vehicle: string;
    review: {
        rating: number;
        comment: string;
    };
    value: string;
}

interface GetDriver {
    id: number;
    name: string;
    description: string;
    car: string;
    rating: number;
    review: string;
    minKm: number;
    ratePerKm: number;
}

interface RideRequest {
    origin: { address: string };
    destination: { address: string };
}

interface EstimateRequest {
    customer_id: string;
    origin: string;
    destination: string;
}