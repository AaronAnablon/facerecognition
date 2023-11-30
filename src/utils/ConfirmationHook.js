import React, { useState, useCallback } from 'react';
import Modal from './Modal';

const useConfirmation = () => {
    const [isVisible, setIsVisible] = useState(false);
    const [message, setMessage] = useState('');
    const [onConfirm, setOnConfirm] = useState(() => { });

    const showConfirmation = useCallback((msg, onConfirmCallback) => {
        setMessage(msg);
        setIsVisible(true);
        setOnConfirm(() => onConfirmCallback);
    }, []);

    const hideConfirmation = () => {
        setIsVisible(false);
        setOnConfirm(() => { });
    };

    const handleConfirm = () => {
        onConfirm();
        hideConfirmation();
    };

    const ConfirmationDialog = () => {
        return (
            isVisible && (
                <Modal>
                    <div className="p-4 rounded-md">
                        <div className='grid bg-white gap-4 rounded-lg justify-center items-center'>
                            <div>{message}</div>
                            <div className='flex gap-4 p-6 justify-end'>
                                <button className='bg-green-700 text-white w-max rounded-lg py-2 px-6' onClick={handleConfirm}>Yes</button>
                                <button className='bg-red-700 text-white w-max rounded-lg py-2 px-6' onClick={hideConfirmation}>No</button>
                            </div>
                        </div>
                    </div>
                </Modal>
            )
        );
    };

    return {
        showConfirmation,
        ConfirmationDialog,
    };
};

export default useConfirmation;
