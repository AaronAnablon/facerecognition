import React, { useState, useCallback } from 'react';
import Modal from './Modal';
import { IoInformationCircle } from "react-icons/io5";

const useMessageHook = () => {
    const [isVisible, setIsVisible] = useState(false);
    const [message, setMessage] = useState('');

    const showMessage = useCallback((msg) => {
        setMessage(msg);
        setIsVisible(true);
    }, []);


    const Message = () => {
        return (
            isVisible && (
                <Modal>
                    <div className="p-4 rounded-md">
                        <div className='bg-green-700 flex items-center text-white gap-1 rounded-t-lg w-full'>
                            <IoInformationCircle size={32} />Information</div>
                        <div className='grid bg-white p-6 gap-4 rounded-b-lg justify-center items-center'>
                            <div className='font-semibold text-lg'>{message}</div>
                            <div className='flex justify-end'>
                                <button
                                    className='bg-green-700 text-white w-max rounded-lg py-2 px-4'
                                    onClick={() => setIsVisible(false)}>Okay</button>
                            </div>
                        </div>
                    </div>
                </Modal>
            )
        );
    };

    return {
        showMessage,
        Message,
    };
};

export default useMessageHook;
