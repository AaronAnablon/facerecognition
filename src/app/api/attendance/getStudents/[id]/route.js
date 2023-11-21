import prisma from "@/utils/prismadb"
import { NextResponse } from "next/server";


export const GET = async (request, { params }) => {
    try {
        const { id } = params;
        const findJson = await prisma.attendance.findMany({
            where: {
                section: id
            }
        });

        return NextResponse.json(findJson);

    } catch (err) {
        console.error(err);
        return NextResponse.json({ message: "Update Error", error: err.message }, { status: 500 });
    }
}

export const revalidate = 0;