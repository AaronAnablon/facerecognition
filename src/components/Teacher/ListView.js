import React, { useEffect, useState } from "react";
import moment from "moment";

const ListView = ({ studentList }) => {

    return (
        <ul className="divide-y divide-gray-200">
            {studentList.map((student) => (
                <li key={student._id} className="py-4 flex justify-center">
                    <div className="ml-4 flex gap-4">
                        <p className="">
                            {student.firstName} {student.lastName}
                            ({student._id}){"  "}
                        </p>
                        <p className="">
                            {student.status}
                        </p>
                        <div className="flex flex-col">
                            <div>
                                <p>
                                    Check in:{" "}
                                    {student.attend_at
                                        ? moment(student.attend_at).format("DD/MM/YYYY h:mm:ss a")
                                        : "-"}
                                </p>
                            </div>
                        </div>
                    </div>
                </li>
            ))}
        </ul>
    );
};

ListView.displayName = 'ListView';


export default ListView