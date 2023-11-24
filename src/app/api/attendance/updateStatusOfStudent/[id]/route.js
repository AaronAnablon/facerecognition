import prisma from "@/utils/prismadb"
import { NextResponse } from "next/server";


export const PUT = async (request, { params }) => {
    try {
        const { id } = params
        const body = await request.json();
        const { studentId, statusIn, statusOut, letterUrl, letterPublicId } = body;

        const findJson = await prisma.attendance.findUnique({
            where: {
                id
            }
        });

        const updatedRecord = await prisma.attendance.update({
            where: {
                id: findJson.id
            },
            data: {
                students: findJson.students.map((student) => {
                    if (student.id === studentId) {
                        return { ...student, statusIn, statusOut, letterUrl, letterPublicId };
                    }
                    return student;
                }),
            },
        });
        return NextResponse.json(updatedRecord);


    } catch (err) {
        console.error(err);
        return NextResponse.json({ message: "Update Error", error: err.message }, { status: 500 });
    }
}
