import prisma from "@/utils/prismadb"
import { NextResponse } from "next/server";

export const GET = async (request, { params }) => {
    try {
        const { id } = params;
        const post = await prisma.attendance.findMany({
            where: {
                teacher: id
            }
        });
        return NextResponse.json(post);
    } catch (err) {
        console.log(err)
        return NextResponse.json(
            { message: "GET Error" },
            { status: 500 }
        );
    }
};

export const revalidate = 0;


export const PUT = async (request, { params }) => {
    try {
        const { id } = params
        const body = await request.json();
        const { data } = body;
        const { isOn, date, time, teacher, event, section } = data;
        const updatePost = await prisma.attendance.update({
            where: {
                id
            },
            data: {
                isOn,
                date,
                time,
                teacher,
                event,
                section,
            }
        })

        return NextResponse.json(updatePost);
    } catch (err) {
        console.log(err)
        return NextResponse.json({ message: "update Error", err }, { status: 500 })
    }
}

export const DELETE = async (request, { params }) => {
    try {
        const { id } = params;

        await prisma.attendance.delete({
            where: {
                id
            }
        });

        return NextResponse.json("Post has been deleted");
    } catch (err) {
        return NextResponse.json({ message: "DELETE Error", err }, { status: 500 });
    }
};
