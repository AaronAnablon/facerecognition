import prisma from "@/utils/prismadb"
import { v2 as cloudinary } from 'cloudinary';
import { NextResponse } from "next/server";

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true
});

export const GET = async (request, { params }) => {
    try {
        const { id } = params;
        const post = await prisma.facephotos.findMany({
            where: {
                owner: id
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


export const PUT = async (request, { params }) => {
    try {
        const { id } = params
        const body = await request.json();
        const { editedValues } = body;
        const { owner,
            photoPublicId,
            photoUrl,
            faceDescriptor, } = editedValues;
        const updatePost = await prisma.facephotos.update({
            where: {
                id
            },
            data: {
                owner,
                photoPublicId,
                photoUrl,
                faceDescriptor,
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

        const deletePhoto = await prisma.facephotos.delete({
            where: {
                id
            }
        })
        return NextResponse.json(deletePhoto);
    } catch (err) {
        console.log(err)
        return NextResponse.json({ message: "DELETE Error", err }, { status: 500 });
    }
};
