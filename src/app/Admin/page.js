"use client"

import { signOut } from "next-auth/react";
import { BsPersonCircle } from "react-icons/bs";
import { FcDataProtection } from "react-icons/fc";
import { useSession } from 'next-auth/react';
import Layout from "./Layout";
import useConfirmation from "@/utils/ConfirmationHook";
import { url, headers } from "@/utils/api";
import { useAccount } from "../contextProvider/AccountProvider";
import { useEffect, useState } from "react";
import UploadProfile from "@/components/UploadProfile";
import Image from "next/image";
import axios from "axios";

const Page = () => {
    const [uploadProfile, setUploadProfile] = useState(false)
    const [account, setAccount] = useState()
    const profile = useAccount();
    const { showConfirmation, ConfirmationDialog } = useConfirmation();
    const { data: session } = useSession();
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
            alert("Something went wrong!")
            console.log(err);
        }
    }


    useEffect(() => {
        profile?.id && handleGetStudent()
    }, [profile])
    return (
        <div className="text-green-700 w-screen relative h-screen">
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
                {session?.firstName} {session?.lastName} &#40;Admin&#41;
            </div>
            {uploadProfile && profile && account &&
                <UploadProfile
                    handleGetStudent={handleGetStudent}
                    setUploadProfile={setUploadProfile}
                    uploadProfile={uploadProfile}
                    account={account} />}
            <ConfirmationDialog />
            <p className="pl-4">Application Control</p>
            <Layout />
            <div className="w-full absolute bottom-8 flex justify-center items-center">
                <button className="bg-green-700 text-white px-4 py-2 rounded-lg"
                    onClick={handleSignOut}>Log Out</button>
            </div>
        </div>
    );
}

export default Page;