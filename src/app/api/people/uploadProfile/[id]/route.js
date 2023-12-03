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
        const { file, account } = body;
        const { profile, profilePublicId } = account

        if (profilePublicId && profile) {
            if (profilePublicId) {
                await cloudinary.uploader.destroy(profilePublicId, { invalidate: true });
            }
            const cloudinaryUploadResponse = await cloudinary.uploader.upload(file, {
                upload_preset: "Afratinhs",
                folder: 'Profile'
            });

            const updatePost = await prisma.people.update({
                where: { id },
                data: {
                    profilePublicId: cloudinaryUploadResponse.public_id,
                    profile: cloudinaryUploadResponse.url,
                }
            });
            return NextResponse.json(updatePost);
        } else {
            const cloudinaryUploadResponse = await cloudinary.uploader.upload(file, {
                upload_preset: "Afratinhs",
                folder: 'Profile'
            });
            const updatePost = await prisma.people.update({
                where: { id },
                data: {
                    profilePublicId: cloudinaryUploadResponse.public_id,
                    profile: cloudinaryUploadResponse.url,
                }
            });
            return NextResponse.json(updatePost);
        }
    } catch (err) {
        console.error(err);
        return NextResponse.json({ message: "Update Error", error: err }, { status: 500 });
    }
};
