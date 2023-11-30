"use client"

import Link from "next/link";
import { RxCalendar } from "react-icons/rx";
import { GoPeople } from "react-icons/go";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useAccount } from "../contextProvider/AccountProvider";
import { BsPersonCircle } from "react-icons/bs";


const Layout = ({ children }) => {
    const profile = useAccount()
    const currentPathname = usePathname()
    const [active, setActive] = useState()
    useEffect(() => {
        setActive(currentPathname)
    }, [currentPathname])

    return (
        // <StudentRoute>
        <div className="w-full">
            <div className={`my-4 w-full flex justify-center ${active !== "/Student" && "border-b-2 border-green-700"}`}>
                <div className={`flex justify-between mx-4 ${active === "/Student" ? "grid gap-2 w-full" : "w-full"} `}>
                    {active !== "/Student" &&
                        <div className="hidden md:flex items-center gap-2 my-2">
                            <div className="rounded-full border-4 border-green-700 text-white bg-green-700">
                                <BsPersonCircle size={24} />
                            </div>
                            {profile?.firstName} {profile?.lastName} &#40;Student&#41;
                        </div>}
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
                                className={`flex gap-4 items-center my-2 ${active?.includes("Student/Attendance") &&
                                    "bg-green-700 px-4 rounded-full text-white"}`} href={`/Student/Attendance?id=${profile.id}`}>
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