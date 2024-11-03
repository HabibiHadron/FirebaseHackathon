import React, { useEffect, useState } from 'react'
import { Button, Col, Form, Input, Row, Typography } from 'antd'
import { setDoc, doc } from 'firebase/firestore'
import { firestore } from 'config/firebase'
import { useAuthContext } from 'contexts/AuthContext'

import { Upload } from 'lucide-react';

const { Title } = Typography

const initialState = { fullName: "", email: "", password: "", confirmPassword: "", profilePictureUrl: "" }

export default function Profile() {
    const { user } = useAuthContext()
    const [state, setState] = useState(initialState)
    const [isProcessing, setIsProcessing] = useState(false)

    const handleChange = e => setState(s => ({ ...s, [e.target.name]: e.target.value }))

    useEffect(() => {
        setState(s => ({ ...s, ...user }))
        console.log('user', user)
    }, [user])

    const handleSubmit = async (e) => {
        e.preventDefault();

        let { fullName, email, password, profilePictureUrl } = state

        fullName = fullName.trim()
        email = email.trim()

        if (fullName.length < 3) { return window.toastify("Please enter your full name", "error") }

        setIsProcessing(true)

        const formData = { fullName, email, password, profilePictureUrl } // Include profilePictureUrl

        try {
            await setDoc(doc(firestore, "users", user.uid), formData, { merge: true });
            window.toastify("Profile updated", "success")
        } catch (e) {
            console.error("Error adding document: ", e);
        } finally {
            setIsProcessing(false)
        }
    }

    // Upload Code
    const [file, setFile] = useState(null);
    const [uploadedUrl, setUploadedUrl] = useState('');
    const [error, setError] = useState('');

    const handleFileChange = async (e) => {
        const selectedFile = e.target.files[0];
        if (!selectedFile) return;

        setFile(selectedFile);
        setError('');

        const formData = new FormData();
        formData.append('file', selectedFile);
        formData.append('upload_preset', 'first-Time'); // Replace with your upload preset

        try {
            const response = await fetch('https://api.cloudinary.com/v1_1/dtesdhvro/auto/upload', {
                method: 'POST',
                body: formData,
            });
            const data = await response.json();
            if (data.secure_url) {
                setUploadedUrl(data.secure_url);
                console.log(data.secure_url);
                setState((s) => ({ ...s, profilePictureUrl: data.secure_url }));
                
                setFile(null);
            } else {
                throw new Error('Upload failed');
            }
        } catch {
            setError('Failed to upload file. Please try again.');
        }
    };

    return (
        <main className='auth'>
            <div className="card p-3 p-md-4 w-100">
                <Title level={2} className='text-center'>Update Profile</Title>
                
                {/* Profile Picture */}
                <div className='circle'>
                    <img src={state.profilePictureUrl || 'default-image-url'} alt="Profile" />
                </div>

                {/* Upload Button */}
                <div className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50 hover:bg-gray-100 cursor-pointer">
                    <input
                        type="file"
                        onChange={handleFileChange}
                        className="hidden"
                        id="fileInput"
                    />
                    <label htmlFor="fileInput" className="flex flex-col items-center justify-center w-full h-full">
                        <Upload className="w-8 h-8 text-gray-500 mb-2" />
                        <p className="text-sm text-gray-500">
                            {file ? file.name : 'Click or drag file to upload'}
                        </p>
                    </label>
                </div>
                {error && <p className="text-red-500">{error}</p>}
                {uploadedUrl && <p className="text-green-500">File uploaded successfully</p>}

                <Form layout="vertical">
                    <Row gutter={[16, 16]}>
                        <Col span={24}>
                            <label htmlFor="fullName">Full Name:</label>
                            <Input size='large' type='text' placeholder='Enter your full name' name="fullName" value={state.fullName} onChange={handleChange} />
                        </Col>
                        <Col span={24}>
                            <label htmlFor="email">Email:</label>
                            <Input size='large' type='text' placeholder='Enter your email' name="email" value={state.email} onChange={handleChange} />
                        </Col>

                        <Col span={24}>
                            <Button type='primary' size='large' block htmlType='submit' loading={isProcessing} onClick={handleSubmit}>Update Profile</Button>
                        </Col>
                    </Row>
                </Form>
            </div>
        </main>
    )
}
