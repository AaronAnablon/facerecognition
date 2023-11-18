"use client"

import { signOut } from "next-auth/react";
import { BsPersonCircle } from "react-icons/bs";
import { FcDataProtection } from "react-icons/fc";
import { useSession } from 'next-auth/react';
import Layout from "./Layout";
import useConfirmation from "@/utils/ConfirmationHook";
import { url } from "@/utils/api";

const Page = () => {
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
    return (
        <div className="text-green-700 w-screen relative h-screen">

            <div className="flex items-center gap-2 mb-4 pl-4 border-b-2 border-green-700">
                <div className="rounded-full m-4 border-4 border-green-700 text-white bg-green-700">
                    <BsPersonCircle size={44} />
                </div>
                {session?.firstName} {session?.lastName} &#40;Admin&#41;
            </div>
            <ConfirmationDialog />
            <p>Application Control</p>
            <Layout />
            <div className="w-full absolute bottom-8 flex md:justify-start md:pl-4 justify-center items-center">
                <button className="bg-green-700 text-white px-4 py-2 rounded-lg"
                    onClick={handleSignOut}>Log Out</button>
            </div>
        </div>
    );
}

export default Page;