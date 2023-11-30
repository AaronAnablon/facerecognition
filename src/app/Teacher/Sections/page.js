"use client"

import Layout from "../Layout";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import axios from "axios";
import { LoadingSpin } from "@/utils/LoadingSpin";
import { url, headers } from "@/utils/api";
import { useSearchParams } from "next/navigation";
import { useSession } from 'next-auth/react';
import Link from "next/link";
import Modal from "@/utils/Modal";

const Page = () => {
    const [section, setSection] = useState()
    const [loading, setLoading] = useState(false)
    const currentPathname = usePathname()
    const [active, setActive] = useState()
    const { data: session } = useSession();

    const searchParams = useSearchParams()
    const teacherId = searchParams.get('id')

    useEffect(() => {
        setActive(currentPathname)
    }, [currentPathname])

    const router = useRouter();

    const goBack = () => {
        router.back();
    };

    const handleGetData = async () => {
        setLoading(true)
        try {
            const response = await axios.get(`${url}/api/attendance/${teacherId}`, { headers });
            setSection(response.data)
            setLoading(false)
        } catch (err) {
            alert("Something went wrong!")
            console.log(err);
            setLoading(false)
        }
    }

    useEffect(() => {
        handleGetData()
    }, [])

    const uniqueSection = section && Array.from(new Set(section.map(section => section.section)));

    return (
        <Layout>
            <div className="w-full flex justify-center gap-4 mb-20">
                {loading && <Modal>
                    <LoadingSpin loading={loading} />
                </Modal>}
                <div className="grid gap-4 w-full mx-4">
                    {uniqueSection?.map((item, index) => (
                        <Link key={index} href={`Sections/Section?section=${item}`}>
                            <ul className=" text-white bg-green-700 rounded-lg py-2 grid " >
                                <li className="flex hover:bg-green-600 px-6 flex-wrap justify-between w-full my-1" >
                                    {item}
                                </li>
                            </ul>
                        </Link>
                    ))}
                </div>
            </div>
            <div className={`fixed bottom-2 flex w-full justify-center`}>
                <div className={`flex justify-between mx-4 ${active === "/Admin" ? "grid gap-2 w-full" : "w-full md:w-1/4"}`}>
                    <button onClick={goBack} className="bg-green-700 text-white px-4 rounded-full" >Back</button>
                </div>
            </div>
        </Layout>
    );
}

export default Page;