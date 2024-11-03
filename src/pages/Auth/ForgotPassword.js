import React, { useState } from 'react'
import { Button, Col, Form, Input, Row, Typography } from 'antd'
import { sendPasswordResetEmail } from 'firebase/auth'
import { auth } from 'config/firebase'
import { useNavigate } from 'react-router-dom'

const { Title } = Typography

const initialState = { email: "" }

export default function ForgotPassword() {

    const [state, setState] = useState(initialState)
    const [isProcessing, setIsProcessing] = useState(false)
    const navigate = useNavigate()

    const handleChange = e => setState(s => ({ ...s, [e.target.name]: e.target.value }))

    const handleSubmit = e => {
        e.preventDefault();

        let { email } = state

        if (!window.isEmail(email)) { return window.toastify("Please enter a valid email address", "error") }

        setIsProcessing(true)

        sendPasswordResetEmail(auth, email)
            .then(() => {
                navigate("/auth/login")
                window.toastify("Email sent successfully. Please check your mail box", "success")
            })
            .catch((error) => {
                console.error("error", error)
                switch (error.code) {
                    case "auth/invalid-credential":
                        window.toastify("Invalid email or password", "error"); break;
                    default: window.toastify("Something went wrong while sending email", "error"); break;
                }
            })
            .finally(() => {
                setIsProcessing(false)
            })

    }

    return (
        <main className='auth'>
            <div className="card p-3 p-md-4 w-100">
                <Title level={2} className='text-center'>Forgot Password</Title>

                <Form layout="vertical">
                    <Row gutter={[16, 16]}>
                        <Col span={24}>
                            <Input size='large' type='email' placeholder='Enter your email' name="email" value={state.email} onChange={handleChange} />
                        </Col>
                        <Col span={24}>
                            <Button type='primary' size='large' block htmlType='submit' loading={isProcessing} onClick={handleSubmit}>Forgot Password</Button>
                        </Col>
                    </Row>
                </Form>
            </div>
        </main>
    )
}
