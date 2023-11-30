import prisma from "@/utils/prismadb"
import { NextResponse } from "next/server";

export const GET = async (request, { params }) => {
    try {
        const { id } = params;
        const findJson = await prisma.attendance.findUnique({
            where: {
                id: id
            }
        });

        return NextResponse.json(findJson);

    } catch (err) {
        console.error(err);
        return NextResponse.json({ message: "Update Error", error: err.message }, { status: 500 });
    }
}

export const revalidate = 0;


export const DELETE = async (request, { params }) => {
    try {
        const { id } = params;

        await prisma.attendance.deleteMany({
            where: {
                teacher: id
            }
        });

        return NextResponse.json("Post has been deleted");
    } catch (err) {
        return NextResponse.json({ message: "DELETE Error", err }, { status: 500 });
    }
};