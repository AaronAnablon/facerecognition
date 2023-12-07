import prisma from "@/utils/prismadb";
import { NextResponse } from "next/server";

export const PUT = async (request, { params }) => {
    try {
        const { id } = params;
        const body = await request.json();
        const { code, section } = body;

        const attendanceData = await prisma.attendance.findFirst({
            where: {
                code: parseInt(code, 10)
            }
        });

        if (!attendanceData) {
            return NextResponse.json({ message: "Attendance record not found!" }, { status: 404 });
        }

        if (attendanceData && attendanceData.section !== section) {
            return NextResponse.json({ message: "Attendance record do not have the same section!" }, { status: 404 });
        }

        const updatedRecord = await prisma.attendance.update({
            where: {
                id
            },
            data: {
                students: attendanceData.students,
            },
        });

        return NextResponse.json(updatedRecord);
    } catch (err) {
        console.error(err);
        return NextResponse.json({ message: "Update Error!" }, { status: 500 });
    }
};
