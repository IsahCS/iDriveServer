import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function getDrivers() {
    try {
        const drivers = await prisma.driver.findMany({
            select: {
                id: true,
                name: true,
                description: true,
                car: true,
                rating: true,
                ratePerKm: true,
                minKm: true,
                review: true,
            },
        });
        return drivers;
    } catch (error) {
        console.error("error fetching drivers:", error);
        throw new Error("failed to fetch drivers.");
    }
}
