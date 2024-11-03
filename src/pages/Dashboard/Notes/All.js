import React, { useState, useEffect, useCallback } from 'react'
import { Col, Image, Input, Row, Space, Table, Tag, Typography } from 'antd'
import { useAuthContext } from 'contexts/AuthContext'
import { setDoc, doc, serverTimestamp, query, collection, getDocs, where, deleteDoc, orderBy, limit } from 'firebase/firestore'
import { firestore } from 'config/firebase'
import { Link } from 'react-router-dom'
import dayjs from 'dayjs'

const { Title, Text } = Typography

export default function All() {

    const { user } = useAuthContext()
    const [documents, setDcouments] = useState([])
    const [filteredDocuments, setFilteredDcouments] = useState([])
    const [searchValue, setSearchValue] = useState("")
    const [isLoading, setIsLoading] = useState(false)

    const handleSearch = e => setFilteredDcouments(documents.filter(doc => doc.title.toLowerCase().includes((e.target.value).toLowerCase())))

    const getDocuments = useCallback(async () => {
        if (user.uid) {
            setIsLoading(true)
            const q = query(collection(firestore, "todos"), where("user_id", "==", user.uid), orderBy("dateCreated", "desc"), limit(10));

            const array = []
            const querySnapshot = await getDocs(q);
            querySnapshot.forEach((doc) => {
                const document = doc.data()
                array.push({ ...document, key: document.id })
            });
            setDcouments(array)
            setIsLoading(false)
        }
    }, [user.uid])
    useEffect(() => { getDocuments() }, [getDocuments])
    useEffect(() => { setFilteredDcouments(documents) }, [documents])

    const handleCompleteTodo = async (todo) => {
        try {
            await setDoc(doc(firestore, "todos", todo.id), { status: "completed", dateUpdated: serverTimestamp() }, { merge: true });

            const updatedDocuments = documents.map(item => {
                if (item.id === todo.id)
                    return { ...item, status: "completed" }
                return item
            })
            setDcouments(updatedDocuments)

            window.toastify("Todo completed", "success")
        } catch (e) {
            window.toastify("Something went wrong", "error")
            console.error("Error updating document: ", e);
        }
    }

    const handleDelete = async (todo) => {
        try {
            await deleteDoc(doc(firestore, "todos", todo.id))
            const filteredDocuments = documents.filter(item => item.id !== todo.id)
            setDcouments(filteredDocuments)
            window.toastify("Todo deleted successfully", "success")
        } catch (err) {
            window.toastify("Something went wrong while deleting a todo", "error")
            console.error(err)
        }
    }

    const columns = [
        { title: 'ID', dataIndex: 'id', key: 'id', },
        {
            title: 'Image', dataIndex: 'imageURL', key: 'imageURL',
            render: (url) => url ? <Image src={url} preview={false} style={{ width: 48, height: 48 }} className='rounded-circle' /> : ""
        },
        { title: 'Title', dataIndex: 'title', key: 'title', },
        { title: 'Location', dataIndex: 'location', key: 'location', },
        { title: 'Description', dataIndex: 'description', key: 'description', },
        {
            title: 'Date Created', dataIndex: 'dateCreated', key: 'dateCreated',
            render: (timestamp) => timestamp ? <Text>{dayjs(timestamp.seconds * 1000).format("dddd, DD MMM YYYY, hh:mm:ss A")}</Text> : ""
        },
        {
            title: 'Date Updated', dataIndex: 'dateUpdated', key: 'dateUpdated',
            render: (timestamp) => timestamp ? <Text>{dayjs(timestamp.seconds * 1000).format("dddd, DD MMM YYYY, hh:mm:ss A")}</Text> : ""
        },
        {
            title: 'Status', dataIndex: 'status', key: 'status',
            render: (text) => <Tag color={text === "incompleted" ? "error" : "success"} className='text-capitalize'>{text}</Tag>
        },
        {
            title: 'Action', dataIndex: 'location', key: 'action',
            render: (_, record) => (
                <Space>
                    <a onClick={() => { handleCompleteTodo(record) }} className='text-success text-decoration-none'>Complete</a>
                    <Link to={`/dashboard/todos/edit/${record.id}`}>Edit</Link>
                    <a onClick={() => { handleDelete(record) }} className='text-danger text-decoration-none'>Delete</a>
                </Space>
            ),
        },
    ];

    return (
        <div className='container p-0'>
            <Row>
                <Col xs={24} lg={12}>
                    <Title level={2}>Todos</Title>
                </Col>
                <Col xs={24} lg={12}>
                    <Input size='large' type='search' placeholder='Search Todo' onChange={handleSearch} />
                </Col>
            </Row>
            <div className="card card-shadow p-3 p-md-4">
                <div className="table-responsive">
                    <Table columns={columns} dataSource={filteredDocuments} loading={isLoading} />
                </div>
            </div>
        </div>
    )
}
