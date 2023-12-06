import prisma from "@/utils/prismadb"
import { NextResponse } from "next/server";


export const PUT = async (request, { params }) => {
    try {
        const { id } = params;
        const body = await request.json();
        const { studentIds, status } = body;
    
        const findJson = await prisma.attendance.findUnique({
            where: {
                id,
            },
        });

        studentIds.forEach((studentId) => {
            findJson.students = findJson.students.map((student) => {
                if (student.id === studentId) {
                    return {
                        ...student,
                        statusIn: status ? "present" : student.statusIn,
                        statusOut: status ? student.statusOut : "present",
                        letterUrl: student.letterUrl,
                        letterPublicId: student.letterPublicId
                    };
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

        return NextResponse.json(updatedRecord);
    } catch (err) {
        console.error(err);
        return NextResponse.json({ message: "Update Error", error: err.message }, { status: 500 });
    }
};
