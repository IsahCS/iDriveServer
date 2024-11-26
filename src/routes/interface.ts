
interface EstimateRequest {
    customer_id: string;
    origin: string;
    destination: string;
}

interface RideRequest {
    origin: { address: string };
    destination: { address: string };
}

interface RideConfirm {
    customer_id: string;
    origin: string;
    destination: string;
    distance: number;
    duration: string;
    driver: {
        id: string;
        name: string;
    }
    value: number;
}

interface RideDriverParams {
    customer_id: string;
}

interface RideDriverQuery {
    driver_id?: string;
}