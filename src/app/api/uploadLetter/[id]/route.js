import prisma from "@/utils/prismadb";
import { v2 as cloudinary } from 'cloudinary';
import { NextResponse } from "next/server";

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true
});

export const PUT = async (request, { params }) => {
    try {
        const { id } = params;
        const body = await request.json();
        const { file, studentId } = body;

        // if (letterPublicId) {
        //     await cloudinary.uploader.destroy(letterPublicId, { invalidate: true });
        // }

        const uploadResponse = await cloudinary.uploader.upload(file, {
            upload_preset: "Afratinhs",
            folder: 'Letters'
        });

        if (uploadResponse) {
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
                            return {
                                ...student,
                                letterUrl: uploadResponse.secure_url,
                                letterPublicId: uploadResponse.public_id
                            };
                        }
                        return student;
                    }),
                },
            });
            return NextResponse.json(updatedRecord);
        }

    } catch (err) {
        console.error(err);
        return NextResponse.json({ message: "Update error" }, { status: 500 });
    }
};
