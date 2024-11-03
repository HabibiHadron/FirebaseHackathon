import React, { useState } from 'react';
import { Modal, Input, Select, Button, Form } from 'antd';
import { Book, FileText, PenLine } from 'lucide-react';
import { collection, addDoc } from "firebase/firestore";
import { firestore } from 'config/firebase';
import { useAuthContext } from 'contexts/AuthContext';


const { TextArea } = Input;
const CreateNoteModal = ({ isOpen, onClose, onSubmit }) => {
  const [form] = Form.useForm();

  const subjects = [
    'Mathematics',
    'Physics',
    'Chemistry',
    'Biology',
    'Computer Science',
    'Literature',
    'History'
  ];
  const { user } = useAuthContext()

  const handleSubmit = async () => {
    try {
      console.log('user', user)
      const values = await form.validateFields();
      onSubmit(values);
      form.resetFields();
      onClose();
    } catch (error) {
      console.error('Validation failed:', error);
    }
  };

  return (
    <Modal
      title={
        <div className="flex items-center gap-2 text-xl">
          <PenLine className="text-blue-500" size={24} />
          <span>Create New Note</span>
        </div>
      }
      open={isOpen}
      onCancel={onClose}
      footer={null}
      width={800}
      className="top-8"
    >
      <div className="bg-gray-50 p-6 rounded-lg mt-4">
        <Form
          form={form}
          layout="vertical"
          className="space-y-4"
        >
          {/* Title Input */}
          <Form.Item
            name="title"
            label={
              <div className="flex items-center gap-2 text-base">
                <FileText size={18} className="text-blue-500" />
                <span>Note Title</span>
              </div>
            }
            rules={[
              { required: true, message: 'Please enter a title' },
              { max: 100, message: 'Title must be less than 100 characters' }
            ]}
          >
            <Input
              size="large"
              placeholder="Enter a descriptive title for your note"
              className="rounded-lg"
            />
          </Form.Item>

          {/* Subject Selection */}
          <Form.Item
            name="subject"
            label={
              <div className="flex items-center gap-2 text-base">
                <Book size={18} className="text-blue-500" />
                <span>Subject</span>
              </div>
            }
            rules={[{ required: true, message: 'Please select a subject' }]}
          >
            <Select
              size="large"
              placeholder="Select the subject category"
              className="w-full rounded-lg"
              options={subjects.map(subject => ({
                value: subject,
                label: subject
              }))}
            />
          </Form.Item>

          {/* Content Text Area */}
          <Form.Item
            name="content"
            label={
              <div className="flex items-center gap-2 text-base">
                <PenLine size={18} className="text-blue-500" />
                <span>Note Content</span>
              </div>
            }
            rules={[{ required: true, message: 'Please enter note content' }]}
          >
            <TextArea
              placeholder="Write your note content here..."
              rows={12}
              className="rounded-lg"
            />
          </Form.Item>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-4">
            <Button
              size="large"
              onClick={onClose}
              className="min-w-24"
            >
              Cancel
            </Button>
            <Button
              type="primary"
              size="large"
              onClick={handleSubmit}
              className="min-w-24 bg-blue-500"
            >
              Create Note
            </Button>
          </div>
        </Form>
      </div>
    </Modal>
  );
};

// Parent component implementation example
const ParentComponent = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { user } = useAuthContext()

  const handleCreateNote = async (noteData) => {
    try {
      // Add your Firebase implementation here
      const newNote = {
        ...noteData,
        createdAt: new Date().toISOString(),
        lastEditedAt: new Date().toISOString(),
        createdByUserData: user, // Replace with actual user ID
        lastEditedBy: 'currentUserId', // Replace with actual user ID
        collaborators: ['currentUserId'] // Initialize with creator

      };

      // Add to Firebase


      try {
        const docRef = await addDoc(collection(firestore, "Notes"), newNote);
        console.log("Document written with ID: ", docRef.id);
      } catch (e) {
        console.error("Error adding document: ", e);
      }



      console.log('Note created:', newNote);
    } catch (error) {
      console.error('Error creating note:', error);
    }
  };

  return (
    <div>
      <Button
        type="primary"
        size="large"
        onClick={() => setIsModalOpen(true)}
        className="bg-blue-500 flex items-center gap-2"
      >
        <PenLine size={20} />
        Create New Note
      </Button>

      <CreateNoteModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreateNote}
      />
    </div>
  );
};

export default ParentComponent;