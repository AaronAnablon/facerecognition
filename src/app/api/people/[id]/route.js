import prisma from "@/utils/prismadb"
import { NextResponse } from "next/server";
import bcrypt from 'bcrypt';

export const GET = async (request, { params }) => {
    try {
        const { id } = params;
        const post = await prisma.people.findUnique({
            where: {
                id
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
        const { data } = body;
        const { firstName,
            lastName,
            email,
            homeAddress,
            age,
            contact,
            section,
            adviser,
            password, } = data;
        const saltRounds = 10

        let updateData = {
            firstName,
            lastName,
            email,
            homeAddress,
            age,
            contact,
            section,
            adviser,
        };

        if (password) {
            const hashedPassword = await bcrypt.hash(password, saltRounds);
            updateData.password = hashedPassword;
        }

        const updatePost = await prisma.people.update({
            where: {
                id
            },
            data: updateData,
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

        await prisma.people.delete({
            where: {
                id
            }
        });

        return NextResponse.json("Post has been deleted");
    } catch (err) {
        return NextResponse.json({ message: "DELETE Error", err }, { status: 500 });
    }
};
