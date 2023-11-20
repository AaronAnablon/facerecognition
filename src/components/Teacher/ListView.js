import React, { useEffect, useState } from "react";
import { FaCheck } from "react-icons/fa";
import { IoClose } from "react-icons/io5";

const ListView = ({ studentList }) => {

    return (
        <ul className="grid gap-1">
            {studentList?.map((student) => (
                <li key={student._id} className=" flex justify-between items-center text-white py-1 bg-green-700 px-4 rounded-lg">
                    <p className="">
                        {student.firstName} {student.lastName}
                    </p>
                    <p className="">
                        {student.status === "Present" ?
                            <div className="bg-white rounded-full text-green-700 p-1">
                                <FaCheck size={14} /></div> :
                            <div className="bg-white rounded-full text-red-700 p-1">
                                <IoClose size={16} /></div>
                        }
                    </p>
                </li>
            ))}
        </ul>
    );
};

ListView.displayName = 'ListView';


export default ListView