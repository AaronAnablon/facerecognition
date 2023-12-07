"use client"

import Link from "next/link";
import { RxCalendar } from "react-icons/rx";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useAccount } from "../contextProvider/AccountProvider";
import { BsPersonCircle } from "react-icons/bs";
import UploadProfile from "@/components/UploadProfile";
import { url, headers } from "@/utils/api";
import axios from "axios";
import Image from "next/image";
import useMessageHook from "@/utils/MessageHook";

const Layout = ({ children }) => {
    const { showMessage, Message } = useMessageHook();
    const profile = useAccount()
    const currentPathname = usePathname()
    const [active, setActive] = useState()
    useEffect(() => {
        setActive(currentPathname)
    }, [currentPathname])

    const [uploadProfile, setUploadProfile] = useState(false)
    const [account, setAccount] = useState()

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
        // <StudentRoute>
        <div className="w-full">
            <Message />
            <div className={`my-4 w-full flex justify-center ${active !== "/Student" && "border-b-2 border-green-700"}`}>
                <div className={`flex justify-between items-center mx-4 ${active === "/Student" ? "grid gap-2 w-full" : "w-full"} `}>
                    {active !== "/Student" &&
                        <div className="hidden md:flex items-center gap-2 my-2">
                            <button className="rounded-full border-4 border-green-700 text-white bg-green-700"
                                onClick={() => setUploadProfile(!uploadProfile)}>
                                {account ?
                                    account?.profile ?
                                        <Image
                                            src={account?.profile}
                                            alt="profile"
                                            width={40}
                                            height={40}
                                            className="object-fill rounded-full"
                                        /> :
                                        <BsPersonCircle size={44} />
                                    :
                                    <BsPersonCircle size={44} />
                                }
                            </button>
                            {profile?.firstName} {profile?.lastName} &#40;Student&#41;
                        </div>
                    }
                    {uploadProfile && profile && account &&
                        <UploadProfile
                            handleGetStudent={handleGetStudent}
                            setUploadProfile={setUploadProfile}
                            uploadProfile={uploadProfile}
                            account={account} />}
                    {profile && <>
                        <Link className={`flex gap-2 items-center`}
                            href={`/Student/Schedule?id=${profile.id}`}>
                            {active === "/Student" ?
                                <div className="flex gap-2 items-center">
                                    <div className={`bg-green-700 text-white h-max p-1 rounded-full`}>
                                        <RxCalendar size={20} />
                                    </div>
                                    <div className="grid justify-start">
                                        <h3>Schedule</h3>
                                        <p className="text-gray-600 text-xs">Attendance</p>
                                    </div>
                                </div>
                                :
                                <div className={`${active?.includes("/Student/Schedule")
                                    &&
                                    "bg-green-700 my-2 px-4 rounded-full text-white"}`}>Schedule</div>
                            }

                        </Link>
                        {active !== "/Student" &&
                            <Link
                                className={`flex gap-4 h-max items-center ${active?.includes("Student/Attendance") &&
                                    "bg-green-700 px-4 rounded-full text-white"}`}
                                href={`/Student/Attendance?id=${profile.id}`}>
                                Attendance</Link>}
                    </>
                    }
                </div>
            </div>
            <div className="h-full">
                {children}
            </div>

        </div>
        // </StudentRoute>
    );
}

export default Layout;