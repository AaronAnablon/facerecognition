import prisma from "@/utils/prismadb"
import { NextResponse } from "next/server"


export const GET = async () => {
    try {
        const posts = await prisma.people.findMany({
            where: {
                role: 1
            }
        })
        return NextResponse.json(posts, {
            headers: {
                "revalidate": 0
            }
        });
    } catch (err) {
        console.log(err)
        return NextResponse.json({ message: "GET Error", err }, { status: 500 })
    }
}