"use client"

import Link from "next/link";
import { RxCalendar } from "react-icons/rx";
import { GoPeople } from "react-icons/go";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useSession } from 'next-auth/react';
import { BsPersonCircle } from "react-icons/bs";
import { TeacherRoute } from "@/utils/auth";
import { useAccount } from "../contextProvider/AccountProvider";
import { url, headers } from "@/utils/api";
import axios from "axios";
import Image from "next/image";
import UploadProfile from "@/components/UploadProfile";
import useMessageHook from "@/utils/MessageHook";

const Layout = ({ children }) => {
    const { data: session } = useSession();
    const { showMessage, Message } = useMessageHook();
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
            showMessage("Something went wrong!")
            console.log(err);
        }
    }

    useEffect(() => {
        profile?.id && handleGetStudent()
    }, [profile])

    return (
        // <TeacherRoute>
        <div className="w-full">
            <Message />
            <div className={`my-4 w-full flex justify-center ${active !== "/Teacher" && "border-b-2 border-green-700"}`}>
                <div className={`flex justify-between my-1 items-center mx-4 ${active === "/Teacher" ? "grid gap-2 w-full" : "w-full"} `}>
                    {active !== "/Teacher" &&
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
                            {session?.firstName} {session?.lastName} &#40;Teacher&#41;
                        </div>}
                    {uploadProfile && profile && account &&
                        <UploadProfile
                            handleGetStudent={handleGetStudent}
                            setUploadProfile={setUploadProfile}
                            uploadProfile={uploadProfile}
                            account={account} />}
                    {session && <><Link className={`flex gap-4 items-center h-max ${active?.includes("/Teacher/Schedule") &&
                        "bg-green-700 px-4 rounded-full text-white"}`} href={`/Teacher/Schedule?id=${session.id}`}>
                        {active === "/Teacher" && <div className={`bg-green-700 text-white p-1 rounded-full`}>
                            <RxCalendar size={20} />
                        </div>}
                        Schedule</Link>
                        <Link className={`flex gap-4 items-center h-max ${active?.includes("Teacher/Sections") &&
                            "bg-green-700 px-4 rounded-full text-white"}`} href={`/Teacher/Sections?id=${session.id}`}>
                            {active === "/Teacher" && <div className="bg-green-700 text-white p-1 rounded-full">
                                <GoPeople size={20} />
                            </div>}
                            Sections</Link>
                    </>
                    }
                </div>
            </div>
            <div className="h-full">
                {children}
            </div>

        </div>
        // </TeacherRoute>
    );
}

export default Layout;