import { useState,ChangeEvent } from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter, Button, Input, Select, Label } from '@roketid/windmill-react-ui';
import PageTitle from 'example/components/Typography/PageTitle';
import CTA from 'example/components/CTA';
import Layout from 'example/containers/Layout';

function UserManagementModals() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    role: '',
    status: 'active',
  });

  const roles = ['Admin', 'Editor', 'Viewer'];

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = () => {
    console.log('User Data:', formData);
    // Add logic to submit the form data to the server
    closeModal();
  };

  return (
    <Layout>
      <PageTitle>User Management</PageTitle>
      <CTA />

      <div>
        <Button onClick={openModal}>Add New User</Button>
      </div>

      <Modal isOpen={isModalOpen} onClose={closeModal}>
        <ModalHeader>Add New User</ModalHeader>
        <ModalBody>
          <div className="grid gap-4">
            <Label>
              <span>First Name</span>
              <Input
                className="mt-1"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                placeholder="Enter first name"
              />
            </Label>
            <Label>
              <span>Last Name</span>
              <Input
                className="mt-1"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                placeholder="Enter last name"
              />
            </Label>
            <Label>
              <span>Email</span>
              <Input
                className="mt-1"
                name="email"
                value={formData.email}
                onChange={handleChange}
                type="email"
                placeholder="Enter email address"
              />
            </Label>
            <Label>
              <span>Role</span>
              <Select className="mt-1" name="role" value={formData.role} onChange={handleChange}>
                <option value="">Select Role</option>
                {roles.map((role) => (
                  <option key={role} value={role}>
                    {role}
                  </option>
                ))}
              </Select>
            </Label>
            <Label>
              <span>Status</span>
              <Select className="mt-1" name="status" value={formData.status} onChange={handleChange}>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </Select>
            </Label>
          </div>
        </ModalBody>
        <ModalFooter>
          <div className="flex flex-col sm:flex-row sm:justify-end sm:space-x-4">
            <Button layout="outline" onClick={closeModal} className="mb-2 sm:mb-0">
              Cancel
            </Button>
            <Button onClick={handleSubmit}>Save</Button>
          </div>
        </ModalFooter>
      </Modal>
    </Layout>
  );
}

export default UserManagementModals;