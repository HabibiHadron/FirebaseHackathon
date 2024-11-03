import React, { useCallback, useEffect, useState } from 'react'
import { Button, Col, Form, Input, Row, Typography } from 'antd'
import { doc, serverTimestamp, getDoc, updateDoc } from 'firebase/firestore'
import { firestore } from 'config/firebase'
import { useParams } from 'react-router-dom'

const { Title } = Typography

const initialState = { title: "", location: "", description: "" }

export default function Edit() {

    const [state, setState] = useState(initialState)
    const [isProcessing, setIsProcessing] = useState(false)
    const [isEditing, setIsEditing] = useState(false)
    const params = useParams()

    const handleChange = e => setState(s => ({ ...s, [e.target.name]: e.target.value }))

    const getDocument = useCallback(async () => {
        const docSnap = await getDoc(doc(firestore, "todos", params.id));

        if (docSnap.exists()) {
            const todo = docSnap.data()
            console.log("todo =>", todo)
            setState(s => ({ ...s, ...todo }))
            setIsEditing(true)

        } else {
            console.log("Todo not found!");
        }
    }, [params])
    useEffect(() => { getDocument() }, [getDocument])

    const handleSubmit = async (e) => {
        e.preventDefault();

        let { title, location, description } = state

        title = title.trim()
        location = location.trim()
        description = description.trim()

        if (title.length < 1) { return window.toastify("Please enter title", "error") }

        setIsProcessing(true)

        const formData = {
            id: params.id || window.getRandomId(),
            title, location, description,
            [!isEditing ? "dateCreated" : "dateUpdated"]: serverTimestamp()
        }


        try {
            await updateDoc(doc(firestore, "todos", formData.id), formData);
            window.toastify("Todo udpated successfully", "success")
            setState(initialState)
        } catch (e) {
            window.toastify("Something went wrong", "error")
            console.error("Error updating document: ", e);
        } finally {
            setIsProcessing(false)
        }
    }

    return (
        <div className='container p-0'>
            <Title level={2}>{!isEditing ? "Add" : "Update"} Todo</Title>
            <div className="card card-shadow p-3 p-md-4">

                <Form layout="vertical">
                    <Row gutter={16}>
                        <Col span={24}>
                            <Form.Item label="Title" required>
                                <Input size='large' type='text' placeholder='Enter title' name="title" value={state.title} onChange={handleChange} />
                            </Form.Item>
                        </Col>
                        <Col span={24}>
                            <Form.Item label="Location">
                                <Input size='large' type='text' placeholder='Enter location' name="location" value={state.location} onChange={handleChange} />
                            </Form.Item>
                        </Col>
                        <Col span={24}>
                            <Form.Item label="Description">
                                <Input.TextArea rows={5} size='large' placeholder='Enter description' style={{ resize: "none" }} name="description" value={state.description} onChange={handleChange} />
                            </Form.Item>
                        </Col>
                        <Col span={24}>
                            <Button type='primary' size='large' block className='shadow-none' htmlType='submit' loading={isProcessing} onClick={handleSubmit}>Update</Button>
                        </Col>
                    </Row>
                </Form>
            </div>
        </div>
    )
}
