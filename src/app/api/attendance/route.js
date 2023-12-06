import prisma from "@/utils/prismadb"
import { NextResponse } from "next/server"

export const POST = async (request) => {
    let fiveDigitNumber;
    let isCodeUnique = false;

    do {
        fiveDigitNumber = Math.floor(10000 + Math.random() * 90000);

        const findCode = await prisma.attendance.findFirst({
            where: {
                code: fiveDigitNumber
            }
        });

        isCodeUnique = !findCode;
    } while (!isCodeUnique);

    try {
        const body = await request.json();
        const { isOn, date, time, teacher, event, section, students } = body;

        const newPost = await prisma.attendance.create({
            data: {
                isOn,
                date,
                time,
                teacher,
                event,
                code: fiveDigitNumber,
                section,
                students
            },
        });
        return NextResponse.json({ message: "Registered", newPost });

    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: "POST Error", error }, { status: 500 });
    }
};





export const GET = async () => {
    try {
        const posts = await prisma.attendance.findMany({
        })
        return NextResponse.json(posts, {
            headers: {
                "revalidate": "0"
            }
        });
    } catch (err) {
        console.log(err)
        return NextResponse.json({ message: "GET Error", err }, { status: 500 })
    }
}