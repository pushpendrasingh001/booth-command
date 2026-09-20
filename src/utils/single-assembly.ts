import { prisma } from "../config/prisma.js";

export async function getSingleActiveAssembly() {
    const assemblies =
        await prisma.assembly.findMany({
            where: {
                isActive: true,
            },
            select: {
                id: true,
                number: true,
                name: true,
                district: true,
                electionYear: true,
            },
            orderBy: {
                createdAt: "asc",
            },
        });

    if (assemblies.length === 0) {
        throw new Error(
            "No active assembly is configured"
        );
    }

    if (assemblies.length > 1) {
        throw new Error(
            "Multiple active assemblies found. V3.1.1 supports only one active assembly"
        );
    }

    return assemblies[0];
}