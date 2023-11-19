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
import { FiArrowRightCircle } from "react-icons/fi";

const Page = () => {
    const [schedule, setSchedule] = useState()
    const [teacher, setTeacher] = useState()
    const [loading, setLoading] = useState(false)
    const currentPathname = usePathname()
    const [active, setActive] = useState()
    const { data: session } = useSession();

    useEffect(() => {
        setActive(currentPathname)
    }, [currentPathname])

    const router = useRouter();

    const goBack = () => {
        router.back();
    };

    const searchParams = useSearchParams()
    const teacherId = searchParams.get('id')


    const handleGetTeacher = async () => {
        setLoading(true)
        try {
            const response = await axios.get(`${url}/api/people/${teacherId}`, { headers });
            setTeacher(response.data)
            setLoading(false)
        } catch (err) {
            alert("Something went wrong!")
            console.log(err);
            setLoading(false)
        }
    }


    const handleGetData = async () => {
        setLoading(true)
        try {
            const response = await axios.get(`${url}/api/attendance/${teacherId}`, { headers });
            setSchedule(response.data)
            setLoading(false)
        } catch (err) {
            alert("Something went wrong!")
            console.log(err);
            setLoading(false)
        }
    }

    useEffect(() => {
        handleGetData()
        handleGetTeacher()
    }, [])

    const groupByDay = () => {
        const groupedByDay = {};
        schedule?.forEach((item) => {
            const day = new Date(item.date).toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
            });

            if (!groupedByDay[day]) {
                groupedByDay[day] = [];
            }
            groupedByDay[day].push(item);
        });

        return groupedByDay;
    };
    const groupedSchedule = groupByDay(schedule);


    return (
        <Layout>
            <div className="w-full flex justify-center gap-4">
                <div className="bg-green-700 w-full text-white mx-4 py-2 rounded-lg mb-4 text-center">{teacher?.firstName} {teacher?.lastName}</div>
            </div>
            <div className="w-full flex justify-center gap-4">
                <LoadingSpin loading={loading} />
                <div className="grid gap-4 w-full mx-4">
                    {Object.keys(groupedSchedule)?.map((day, index) => (
                        <ul className="px-6 text-white bg-green-700 rounded-lg py-2 grid " key={index}>
                            <h2 className="text-white">{day}</h2>
                            {groupedSchedule[day].map((item, itemIndex) => (
                                <li className="flex flex-wrap justify-between w-full my-1" key={itemIndex}>
                                    <p>{item.time} {item.section}</p>
                                    <Link className="bg-white rounded-full text-green-700 p-1" href={`Schedule/RecordAttendance?AttendanceId=${item.id}`}>
                                        <FiArrowRightCircle size={16} />
                                    </Link>
                                </li>
                            ))}
                        </ul>
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