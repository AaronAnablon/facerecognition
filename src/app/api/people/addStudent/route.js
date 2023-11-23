import prisma from "@/utils/prismadb"
import { NextResponse } from "next/server"
import bcrypt from 'bcrypt';

export const POST = async (request) => {
    try {
        const body = await request.json();
        const { firstName, lastName, email, homeAddress,age,  contact, section, adviser, password, role } = body;

        const saltRounds = 10

        const hashedPassword = await bcrypt.hash(password, saltRounds);
        const newPost = await prisma.people.create({
            data: {
                firstName,
                lastName,
                email,
                homeAddress,
                age,
                contact,
                section,
                adviser,
                password: hashedPassword,
                role
            },
        })
        return NextResponse.json(newPost)
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: "POST Error", error }, { status: 500 });
    }
};


