import React, { useState, useEffect } from 'react';
import PageTitle from 'example/components/Typography/PageTitle';
import SectionTitle from 'example/components/Typography/SectionTitle';
import CTA from 'example/components/CTA';
import {
  Table,
  TableHeader,
  TableCell,
  TableBody,
  TableRow,
  TableFooter,
  TableContainer,
  Badge,
  Button,
  Pagination,
  Modal,
  Input,
} from '@roketid/windmill-react-ui';
import { EditIcon, TrashIcon, PlusIcon } from 'icons';
import Layout from 'example/containers/Layout';
import axios from 'axios';

interface Role {
  id: number;
  name: string;
  isActive: boolean;
}

const RoleManagement: React.FC = () => {
  const [roles, setRoles] = useState<Role[]>([]);
  const [loadingRoles, setLoadingRoles] = useState(true);
  const [rolePage, setRolePage] = useState(1);
  const roleResultsPerPage = 10;
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
  const [roleName, setRoleName] = useState('');
  const [roleStatus, setRoleStatus] = useState(true);
  const [editingRoleId, setEditingRoleId] = useState<number | null>(null);
 

  useEffect(() => {
    const fetchRoles = async () => {
      setLoadingRoles(true);
      try {
        const { data } = await axios.get('/api/roles', {
          params: { page: rolePage, resultsPerPage: roleResultsPerPage },
        });
        setRoles(data.results || []);
      } catch (err) {
        console.error('Error fetching roles:', err);
      } finally {
        setLoadingRoles(false);
      }
    };

    fetchRoles();
  }, [rolePage]);

  const handleEditRole = (roleId: number) => {
    console.log(`Editing role with ID: ${roleId}`);
    // Implement edit logic
  };

  const handleDeleteRole = (roleId: number) => {
    console.log(`Deleting role with ID: ${roleId}`);
    // Implement delete logic
  };

  const mapStatusToBadgeType = (status: boolean): "success" | "neutral" | "danger" | "warning" | "primary" | undefined => {
    return status ? 'success' : 'neutral';
  };

  const handleRoleModalOpen = (role?: Role) => {
    if (role) {
      setRoleName(role.name);
      setRoleStatus(role.isActive);
      setEditingRoleId(role.id);
    } else {
      setRoleName('');
      setRoleStatus(true);
      setEditingRoleId(null);
    }
    setIsRoleModalOpen(true);
  };

  const handleRoleModalClose = () => {
    setIsRoleModalOpen(false);
    setRoleName('');
    setRoleStatus(true);
    setEditingRoleId(null);
  };

  const handleRoleSave = async () => {
    try {
      if (editingRoleId) {
        await axios.put(`/api/roles/${editingRoleId}`, { name: roleName, isActive: roleStatus });
        alert('Role updated successfully');
      } else {
        await axios.post('/api/roles', { name: roleName, isActive: roleStatus });
        alert('Role created successfully');
      }
      setRoleName('');
      setRoleStatus(true);
      setEditingRoleId(null);
      setIsRoleModalOpen(false);
      // Refetch roles
      const { data } = await axios.get('/api/roles');
      setRoles(data || []);
    } catch (err) {
      console.error('Error saving role:', err);
      alert('Error saving role');
    }
  };

  return (
    <Layout>
      <PageTitle>Role Management</PageTitle>
      <CTA />
      <SectionTitle>Manage Roles</SectionTitle>
      
      <Button onClick={() => handleRoleModalOpen()}>Create New Role</Button>

      <TableContainer>
        {loadingRoles ? (
          <p>Loading roles...</p>
        ) : (
          <Table>
            <TableHeader>
              <tr>
                {/* <TableCell>Role Id</TableCell> */}
                <TableCell>Role Name</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </tr>
            </TableHeader>
            <TableBody>
              {roles.map((role) => (
                <TableRow key={role.id}>
                  <TableCell>{role.name}</TableCell>
                  <TableCell>
                    <Badge type={mapStatusToBadgeType(role.isActive)}>
                      {role.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-4">
                      <Button layout="link" size="small" onClick={() => handleEditRole(role.id)}>
                        <EditIcon className="w-5 h-5" />
                      </Button>
                      <Button layout="link" size="small" onClick={() => handleDeleteRole(role.id)}>
                        <TrashIcon className="w-5 h-5" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </TableContainer>

      {/* Role Modal */}
      <Modal isOpen={isRoleModalOpen} onClose={handleRoleModalClose}>
        <h2>{editingRoleId ? 'Edit Role' : 'Create New Role'}</h2>
        <div className="modal-body">
          <label>
            Role Name
            <Input
              value={roleName}
              onChange={(e) => setRoleName(e.target.value)}
              placeholder="Enter role name"
            />
          </label>
          <label className="mt-4">
            <input
              type="checkbox"
              checked={roleStatus}
              onChange={() => setRoleStatus((prev) => !prev)}
            />
            Active
          </label>
        </div>
        <div className="modal-footer">
          <Button onClick={handleRoleSave}>Save</Button>
          <Button layout="link" onClick={handleRoleModalClose}>
            Cancel
          </Button>
        </div>
      </Modal>
    </Layout>
  );
};

export default RoleManagement;
