"use client"

import Layout from "../Layout";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import axios from "axios";
import { LoadingSpin } from "@/utils/LoadingSpin";
import { url, headers } from "@/utils/api";
import useMessageHook from "@/utils/MessageHook";
import Link from "next/link";
import Modal from "@/utils/Modal";
import { FcDataProtection } from "react-icons/fc";
import { FaClipboardList } from "react-icons/fa";
import { RiDeleteBin5Line } from "react-icons/ri";
import useConfirmation from "@/utils/ConfirmationHook";

const Page = () => {
    const { showConfirmation, ConfirmationDialog } = useConfirmation();
    const [section, setSection] = useState()
    const [loading, setLoading] = useState(false)
    const currentPathname = usePathname()
    const [active, setActive] = useState()
    const { showMessage, Message } = useMessageHook();


    useEffect(() => {
        setActive(currentPathname)
    }, [currentPathname])


    const handleGetData = async () => {
        setLoading(true)
        try {
            const response = await axios.get(`${url}/api/attendance`, { headers });
            setSection(response.data)
            setLoading(false)
        } catch (err) {
            setLoading(false)
            showMessage("Something went wrong!")
            console.log(err);
        }
    }

    const handleDelete = (sectionId) => {
        showConfirmation(<div className='grid justify-center gap-4'>
            <div className='bg-green-700 flex items-center text-white gap-4 rounded-t-lg w-full'>
                <FcDataProtection size={32} />Delete Section</div>
            <div className="grid gap-1 p-6">
                <p className='text-xl'>Are you sure you want to delete this section?</p>
                <p className="italic text-xs">All attendance under this section will be deleted.</p>
            </div>
        </div>, () => {
            handleDeleteApi(sectionId)
        });
    };

    const handleDeleteApi = async (sectionId) => {
        setLoading(true)
        try {
            await axios.delete(`${url}/api/attendance/deleteSection/${sectionId}`,
                { section: sectionId }, { headers });
            handleGetData()
            showMessage("Succesfully Deleted!")
            setLoading(false)
        } catch (err) {
            setLoading(false)
            showMessage("Something went wrong!")
            console.log(err);
        }
    }

    useEffect(() => {
        handleGetData()
    }, [])

    const uniqueSection = section && Array.from(new Set(section.map(section => section.section)));

    return (
        <Layout>
            <Message />
            <ConfirmationDialog />
            <div className="w-full flex justify-center gap-4 mb-20">
                {loading && <Modal>
                    <LoadingSpin loading={loading} />
                </Modal>}
                <div className="grid gap-4 w-full mx-4">
                    <ul className="grid">
                        {uniqueSection?.map((item, index) => (
                            <div key={index}
                                className="flex justify-between w-full px-6 text-white bg-green-700 rounded-lg py-2 my-1">
                                <p>{item}</p>
                                <div className="flex gap-1">
                                    <Link className="bg-white border-green-700 border-2 h-max rounded-full text-yellow-500 p-1"
                                        href={`Sections/Students?section=${item}`}>
                                        <FaClipboardList size={15} />
                                    </Link>
                                    <button onClick={() => handleDelete(item)}
                                        className="bg-white border-green-700 border-2 h-max rounded-full text-red-700 p-1">
                                        <RiDeleteBin5Line size={16} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </ul>
                </div>
            </div>
            <div className={`fixed bottom-2 flex w-full justify-center`}>
                <div className={`flex justify-between mx-4 ${active === "/Admin" ? "grid gap-2 w-full" : "w-full md:w-1/4"}`}>
                    <Link href={"/Admin"} className="bg-green-700 text-white px-4 rounded-full" >Back</Link>
                </div>
            </div>
        </Layout >
    );
}

export default Page;