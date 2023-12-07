"use client"

import { signOut } from "next-auth/react";
import { BsPersonCircle } from "react-icons/bs";
import { FcDataProtection } from "react-icons/fc";
import { useAccount } from "../contextProvider/AccountProvider";
import Layout from "./Layout";
import useConfirmation from "@/utils/ConfirmationHook";
import { FaHome } from "react-icons/fa";
import { IoCallOutline } from "react-icons/io5";
import { FaPeopleLine } from "react-icons/fa6";
import { GiTeacher } from "react-icons/gi";
import { CgTime } from "react-icons/cg";
import UploadProfile from "@/components/UploadProfile";
import { useEffect, useState } from "react";
import { url, headers } from "@/utils/api";
import axios from "axios";
import Image from "next/image";
import useMessageHook from "@/utils/MessageHook";

const Page = () => {
    const { showMessage, Message } = useMessageHook();
    const [uploadProfile, setUploadProfile] = useState(false)
    const [account, setAccount] = useState()
    const profile = useAccount();
    const { showConfirmation, ConfirmationDialog } = useConfirmation();
    const handleSignOut = (e) => {
        e.preventDefault();
        showConfirmation(<div className='grid justify-center gap-4'>
            <div className='bg-green-700 flex items-center text-white gap-4 rounded-t-lg w-full'><FcDataProtection size={32} />Logout Account</div>
            <p className='text-xl p-6'>Are you sure you want to logout this account?</p>
        </div>, () => {
            signOut({ callbackUrl: `${url}/` })
        });
    };

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
        <div className="text-green-700 w-screen relative h-screen">
            <Message />
            <div className="flex items-center gap-2 mb-4 pl-4 border-b-2 border-green-700">
                <button className="rounded-full m-4 border-4 border-green-700 text-white bg-green-700"
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
                {profile?.firstName} {profile?.lastName} &#40;Student&#41;
            </div>
            {uploadProfile && profile && account &&
                <UploadProfile
                    handleGetStudent={handleGetStudent}
                    setUploadProfile={setUploadProfile}
                    uploadProfile={uploadProfile}
                    account={account} />}
            <ConfirmationDialog />
            <p className="ml-4">Student&#39;s Information</p>
            <Layout />
            <div className="grid gap-4 ml-4">
                <div className="flex gap-2 items-center">
                    <div className={`bg-green-700 text-white h-max p-1 rounded-full`}>
                        <FaHome size={20} />
                    </div>
                    <div className="grid justify-start">
                        <h3>{profile?.homeAddress}</h3>
                        <p className="text-gray-600 text-xs">Address</p>
                    </div>
                </div>
                <div className="flex gap-2 items-center">
                    <div className={`bg-green-700 text-white h-max p-1 rounded-full`}>
                        <CgTime size={20} />
                    </div>
                    <div className="grid justify-start">
                        <h3>{profile?.age}</h3>
                        <p className="text-gray-600 text-xs">Age</p>
                    </div>
                </div>
                <div className="flex gap-2 items-center">
                    <div className={`bg-green-700 text-white h-max p-1 rounded-full`}>
                        <IoCallOutline size={20} />
                    </div>
                    <div className="grid justify-start">
                        <h3>{profile?.contact}</h3>
                        <p className="text-gray-600 text-xs">Contact Number</p>
                    </div>
                </div>
                <div className="flex gap-2 items-center">
                    <div className={`bg-green-700 text-white h-max p-1 rounded-full`}>
                        <FaPeopleLine size={20} />
                    </div>
                    <div className="grid justify-start">
                        <h3>{profile?.section}</h3>
                        <p className="text-gray-600 text-xs">Section</p>
                    </div>
                </div>
                <div className="flex gap-2 items-center">
                    <div className={`bg-green-700 text-white h-max p-1 rounded-full`}>
                        <GiTeacher size={20} />
                    </div>
                    <div className="grid justify-start">
                        <h3>{profile?.adviser}</h3>
                        <p className="text-gray-600 text-xs">Adviser</p>
                    </div>
                </div>
            </div>
            <div className="w-full mt-6 bottom-8 flex justify-center items-center">
                <button className="bg-green-700 text-white h-max px-4 py-2 rounded-lg"
                    onClick={handleSignOut}>Log Out</button>
            </div>
        </div>
    );
}

export default Page;