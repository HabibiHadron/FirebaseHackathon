import React, { useState } from 'react';
import { Input, Card, Tag, Avatar, Tooltip, Modal, Button } from 'antd';
import { Search, MessageCircle, Clock, Book } from 'lucide-react';

const NotesHome = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedNote, setSelectedNote] = useState(null);
  const [newComment, setNewComment] = useState('');

  // Sample data - replace with your Firebase data
  const subjects = ['Mathematics', 'Physics', 'Chemistry', 'Biology', 'Computer Science'];
  const sampleNotes = [
    {
      id: 1,
      title: 'Integration Techniques',
      content: 'Advanced methods for solving complex integrals...',
      subject: 'Mathematics',
      author: {
        name: 'John Doe',
        avatar: '/api/placeholder/32/32'
      },
      lastEdited: '2024-03-01T10:00:00',
      comments: [
        { id: 1, author: 'Alice', text: 'Great notes! Very helpful.', avatar: '/api/placeholder/24/24' }
      ]
    },
    // Add more sample notes
  ];

  const filteredNotes = sampleNotes.filter(note => {
    const matchesSearch = note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         note.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSubject = selectedSubject === 'all' || note.subject === selectedSubject;
    return matchesSearch && matchesSubject;
  });

  const handleNoteClick = (note) => {
    setSelectedNote(note);
    setIsModalOpen(true);
  };

  const handleComment = () => {
    // Implement Firebase comment addition logic here
    setNewComment('');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-gray-900">Collaborative Study Notes</h1>
        </div>
      </div>

      {/* Search and Filter Section */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row gap-4 items-center mb-6">
          <div className="w-full md:w-1/2">
            <Input
              size="large"
              placeholder="Search notes..."
              prefix={<Search className="text-gray-400" size={20} />}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="rounded-lg"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            <Tag 
              className={`cursor-pointer text-base px-4 py-1 ${selectedSubject === 'all' ? 'bg-blue-500 text-white' : ''}`}
              onClick={() => setSelectedSubject('all')}
            >
              All
            </Tag>
            {subjects.map(subject => (
              <Tag
                key={subject}
                className={`cursor-pointer text-base px-4 py-1 ${selectedSubject === subject ? 'bg-blue-500 text-white' : ''}`}
                onClick={() => setSelectedSubject(subject)}
              >
                {subject}
              </Tag>
            ))}
          </div>
        </div>

        {/* Notes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredNotes.map(note => (
            <Card
              key={note.id}
              className="hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => handleNoteClick(note)}
            >
              <div className="flex items-center justify-between mb-4">
                <Tag color="blue">{note.subject}</Tag>
                <Tooltip title={`Last edited: ${new Date(note.lastEdited).toLocaleDateString()}`}>
                  <Clock size={16} className="text-gray-400" />
                </Tooltip>
              </div>
              <h3 className="text-lg font-semibold mb-2">{note.title}</h3>
              <p className="text-gray-600 mb-4 line-clamp-3">{note.content}</p>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Avatar src={note.author.avatar} />
                  <span className="text-sm text-gray-600">{note.author.name}</span>
                </div>
                <div className="flex items-center gap-1">
                  <MessageCircle size={16} className="text-gray-400" />
                  <span className="text-sm text-gray-600">{note.comments.length}</span>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Note Detail Modal */}
      <Modal
        title={selectedNote?.title}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
        width={800}
      >
        {selectedNote && (
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <Book size={20} className="text-blue-500" />
              <Tag color="blue">{selectedNote.subject}</Tag>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-gray-800 whitespace-pre-wrap">{selectedNote.content}</p>
            </div>

            <div className="border-t pt-4">
              <h4 className="text-lg font-semibold mb-4">Comments</h4>
              <div className="space-y-4 mb-4">
                {selectedNote.comments.map(comment => (
                  <div key={comment.id} className="flex items-start gap-3 bg-gray-50 p-3 rounded-lg">
                    <Avatar src={comment.avatar} />
                    <div>
                      <p className="font-medium">{comment.author}</p>
                      <p className="text-gray-600">{comment.text}</p>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="flex gap-2">
                <Input.TextArea
                  placeholder="Add a comment..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  rows={2}
                />
                <Button type="primary" onClick={handleComment}>
                  Comment
                </Button>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default NotesHome;