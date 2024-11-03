import React, { useCallback, useEffect, useState } from 'react';
import { useAuthContext } from 'contexts/AuthContext';
import { collection, getDocs, query } from 'firebase/firestore';
import { firestore } from 'config/firebase';
import { Input } from 'antd';
import AllNotes from '../Notes/AllNotes';

const { Search } = Input;

export default function Home() {
    const { user } = useAuthContext();
    const [documents, setDocuments] = useState([]);
    const [searchTerm, setSearchTerm] = useState(""); // Search term state

    const readUsers = useCallback(async () => {
        const q = query(collection(firestore, "users"));
        const querySnapshot = await getDocs(q);

        const array = [];
        querySnapshot.forEach(doc => {
            const document = doc.data();
            array.push(document);
        });

        setDocuments(array);
    }, []);

    useEffect(() => { readUsers() }, [readUsers]);

    // Search handler
    const handleSearch = (value) => {
        setSearchTerm(value); // Update the search term state
    };

    return (
        <>
            <div className="d-flex justify-content-between text-light bg-dark p-3">
                <div>User: {user.fullName}</div>

                <Search
                    className='w-50'
                    placeholder="Search Notes"
                    onSearch={handleSearch} // Call handleSearch on search
                    enterButton
                />

                <div>Email: {user.email}</div>
            </div>
            <div>
                <h3 className='text-center m-3'>Notes</h3>
                <AllNotes searchTerm={searchTerm} /> {/* Pass searchTerm as a prop */}
            </div>
        </>
    );
}
