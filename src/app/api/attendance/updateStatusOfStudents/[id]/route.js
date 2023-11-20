import prisma from "@/utils/prismadb"
import { NextResponse } from "next/server";


export const PUT = async (request, { params }) => {
    try {
        const { id } = params;
        const body = await request.json();
        const { studentIds, status, letterUrl, letterPublicId } = body;

        const findJson = await prisma.attendance.findUnique({
            where: {
                id,
            },
        });

        console.log("findJson:", findJson);

        studentIds.forEach((studentId) => {
            findJson.students = findJson.students.map((student) => {
                if (student.id === studentId) {
                    console.log("Updating student:", student.id);
                    return { ...student, status, letterUrl, letterPublicId };
                }
                return student;
            });
        });

        const updatedRecord = await prisma.attendance.update({
            where: {
                id: findJson.id,
            },
            data: {
                students: findJson.students,
            },
        });

        console.log("updatedRecord:", updatedRecord);

        return NextResponse.json(updatedRecord);
    } catch (err) {
        console.error(err);
        return NextResponse.json({ message: "Update Error", error: err.message }, { status: 500 });
    }
};
