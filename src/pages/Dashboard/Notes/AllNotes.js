import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { firestore } from 'config/firebase';
import { 
  Card, 
  Typography, 
  List, 
  Avatar, 
  Modal, 
  Button, 
  Space, 
  Tag, 
  Spin
} from 'antd';
import { MessageOutlined, UserOutlined } from '@ant-design/icons';
import 'bootstrap/dist/css/bootstrap.min.css';

const { Title, Text, Paragraph } = Typography;

const AllNotes = ({ searchTerm }) => {
    const [notes, setNotes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedNote, setSelectedNote] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);

    // Fetch notes from Firestore
    useEffect(() => {
        const fetchNotes = async () => {
            try {
                const notesCollection = collection(firestore, 'Notes');
                const noteSnapshot = await getDocs(notesCollection);
                const notesList = noteSnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data(),
                }));
                setNotes(notesList);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching notes:', error);
                setLoading(false);
            }
        };

        fetchNotes();
    }, []);

    // Filter notes based on the search term
    const filteredNotes = notes.filter(note => 
        note.title?.toLowerCase().includes(searchTerm?.toLowerCase() || '') ||
        note.subject?.toLowerCase().includes(searchTerm?.toLowerCase() || '') ||
        note.content?.toLowerCase().includes(searchTerm?.toLowerCase() || '')
    );

    const formatDate = (timestamp) => {
        if (!timestamp) return 'Unknown date';
        return new Date(timestamp).toLocaleString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const handleNoteClick = (note) => {
        setSelectedNote(note);
        setModalVisible(true);
    };

    const NoteCard = ({ note }) => (
        <Card
            hoverable
            className="mb-4 shadow-sm"
            actions={[
                <Button 
                    type="link" 
                    icon={<MessageOutlined />}
                    onClick={() => handleNoteClick(note)}
                >
                    View Details
                </Button>
            ]}
        >
            <div className="d-flex align-items-center mb-3">
                <Avatar 
                    size={48}
                    src={note.createdByUserData?.profilePictureUrl}
                    icon={!note.createdByUserData?.profilePictureUrl && <UserOutlined />}
                    className="me-3"
                />
                <div className="flex-grow-1">
                    <Title level={4} className="mb-0">{note.title}</Title>
                    <Text type="secondary">{note.subject}</Text>
                </div>
            </div>
            <Paragraph ellipsis={{ rows: 3 }}>
                {note.content}
            </Paragraph>
            <div className="d-flex justify-content-between align-items-center mt-3">
                <Text type="secondary">
                    {formatDate(note.createdAt)}
                </Text>
                <Tag color="blue">
                    {note.createdByUserData?.email || 'Unknown user'}
                </Tag>
            </div>
        </Card>
    );

    const DetailModal = () => (
        <Modal
            title={selectedNote?.title}
            open={modalVisible}
            onCancel={() => setModalVisible(false)}
            footer={null}
            width={800}
        >
            <div className="d-flex align-items-center mb-4">
                <Avatar 
                    size={64}
                    src={selectedNote?.createdByUserData?.profilePictureUrl}
                    icon={!selectedNote?.createdByUserData?.profilePictureUrl && <UserOutlined />}
                    className="me-3"
                />
                <div>
                    <Title level={4} className="mb-1">
                        {selectedNote?.createdByUserData?.email || 'Unknown user'}
                    </Title>
                    <Text type="secondary">
                        {formatDate(selectedNote?.createdAt)}
                    </Text>
                </div>
            </div>
            <Card className="mb-4">
                <Title level={5}>Subject</Title>
                <Text>{selectedNote?.subject}</Text>
                
                <Title level={5} className="mt-4">Content</Title>
                <Paragraph className="text-pre-wrap">
                    {selectedNote?.content}
                </Paragraph>
            </Card>
        </Modal>
    );

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center min-vh-50">
                <Spin size="large" />
            </div>
        );
    }

    return (
        <div className="container py-4">
            <Title level={2} className="mb-4">All Notes</Title>
            
            {filteredNotes.length === 0 ? (
                <div className="text-center py-5">
                    <Text type="secondary">No notes found</Text>
                </div>
            ) : (
                <div className="row">
                    {filteredNotes.map(note => (
                        <div key={note.id} className="col-12 col-md-6 col-lg-4">
                            <NoteCard note={note} />
                        </div>
                    ))}
                </div>
            )}
            
            <DetailModal />
        </div>
    );
};

export default AllNotes;
