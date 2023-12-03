"use client"

import Link from "next/link";
import { RxCalendar } from "react-icons/rx";
import { GoPeople } from "react-icons/go";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useSession } from 'next-auth/react';
import { BsPersonCircle } from "react-icons/bs";
import { AdminRoute } from "@/utils/auth";
import { url, headers } from "@/utils/api";
import { useAccount } from "../contextProvider/AccountProvider";
import UploadProfile from "@/components/UploadProfile";
import Image from "next/image";
import axios from "axios";

const Layout = ({ children }) => {
    const { data: session } = useSession();

    const [uploadProfile, setUploadProfile] = useState(false)
    const [account, setAccount] = useState()
    const profile = useAccount();

    const currentPathname = usePathname()
    const [active, setActive] = useState()
    useEffect(() => {
        setActive(currentPathname)
    }, [currentPathname])
    const handleGetStudent = async () => {
        try {
            const response = await axios.get(`${url}/api/people/${profile?.id}`, { headers });
            setAccount(response.data)
        } catch (err) {
            alert("Something went wrong!")
            console.log(err);
        }
    }

    useEffect(() => {
        profile?.id && handleGetStudent()
    }, [profile])

    return (
        // <AdminRoute>
        <div className="w-full">
            <div className={`mb-4 w-full flex justify-center ${active !== "/Admin" && "border-b-2 border-green-700"}`}>
                <div className={`flex justify-between my-1 mx-4 items-center ${active === "/Admin" ? "grid gap-2 w-full" : "w-full"} `}>
                    {active !== "/Admin" &&
                        <div className="hidden md:flex items-center gap-2 ">
                           <button className="rounded-full m-1 border-4 border-green-700 text-white bg-green-700"
                                onClick={() => setUploadProfile(!uploadProfile)}>
                                {account ?
                                    account?.profile ?
                                        <div className="w-12 h-12 rounded-full object-fill bg-green-700 overflow-hidden border-4 border-white">
                                            <Image
                                                src={account?.profile}
                                                alt="profile"
                                                width={44}
                                                height={44}
                                                className="object-fill rounded-full"
                                            />
                                        </div>
                                        :
                                        <BsPersonCircle size={44} />
                                    :
                                    <BsPersonCircle size={44} />
                                }
                            </button>
                            {session?.firstName} {session?.lastName} &#40;Admin&#41;
                        </div>}
                        {uploadProfile && profile && account &&
                        <UploadProfile
                            handleGetStudent={handleGetStudent}
                            setUploadProfile={setUploadProfile}
                            uploadProfile={uploadProfile}
                            account={account} />}
                    <Link className={`flex gap-4 items-center  ${active?.includes("/Admin/TeacherSchedule") &&
                        "bg-green-700 px-4 rounded-full text-white"}`} href={`/Admin/TeacherSchedule`}>
                        {active === "/Admin" && <div className={`bg-green-700 text-white p-1 rounded-full`}>
                            <RxCalendar size={20} />
                        </div>}
                        {active !== "/Admin" ? "Schedule" : "Teacher's Schedule"}</Link>
                    <Link className={`flex gap-4 items-center h-max ${active?.includes("Admin/Sections") &&
                        "bg-green-700 px-4 rounded-full text-white"}`} href={`/Admin/Sections`}>
                        {active === "/Admin" && <div className="bg-green-700 text-white p-1 rounded-full">
                            <GoPeople size={20} />
                        </div>}
                        Sections</Link>
                </div>
            </div>
            <div className="h-full">
                {children}
            </div>

        </div>
        // </AdminRoute>
    );
}

export default Layout;