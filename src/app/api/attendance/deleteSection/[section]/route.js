import prisma from "@/utils/prismadb"
import { NextResponse } from "next/server";

export const DELETE = async (request, { params }) => {
    try {
        const { section } = params
        await prisma.attendance.deleteMany({
            where: {
                section
            }
        });

        return NextResponse.json("Post has been deleted");
    } catch (err) {
        console.log(err)
        return NextResponse.json({ message: "DELETE Error", err }, { status: 500 });
    }
};
