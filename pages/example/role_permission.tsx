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

interface RolePermission {
  id: number;
  role: string;
  main_module: string;
  module_name: string;
  view_access: boolean;
  create_access: boolean;
  update_access: boolean;
  delete_access: boolean;
}

const RolePermissionPage: React.FC = () => {
  const [permissions, setPermissions] = useState<RolePermission[]>([]);
  const [loadingPermissions, setLoadingPermissions] = useState(true);
  const [isPermissionModalOpen, setIsPermissionModalOpen] = useState(false);
  const [permissionName, setPermissionName] = useState('');
  const [mainModule, setMainModule] = useState('');
  const [moduleName, setModuleName] = useState('');
  const [viewAccess, setViewAccess] = useState(false);
  const [createAccess, setCreateAccess] = useState(false);
  const [updateAccess, setUpdateAccess] = useState(false);
  const [deleteAccess, setDeleteAccess] = useState(false);
  const [editingPermissionId, setEditingPermissionId] = useState<number | null>(null);

  useEffect(() => {
    const fetchPermissions = async () => {
      setLoadingPermissions(true);
      try {
        const { data } = await axios.get('/api/role_permissions');
        setPermissions(data.results || []);
      } catch (err) {
        console.error('Error fetching role permissions:', err);
      } finally {
        setLoadingPermissions(false);
      }
    };

    fetchPermissions();
  }, []);

  const handleEditPermission = (permissionId: number) => {
    const permission = permissions.find(p => p.id === permissionId);
    if (permission) {
      setPermissionName(permission.main_module);
      setMainModule(permission.main_module);
      setModuleName(permission.module_name);
      setViewAccess(permission.view_access);
      setCreateAccess(permission.create_access);
      setUpdateAccess(permission.update_access);
      setDeleteAccess(permission.delete_access);
      setEditingPermissionId(permissionId);
    }
    setIsPermissionModalOpen(true);
  };

  const handleDeletePermission = (permissionId: number) => {
    console.log(`Deleting permission with ID: ${permissionId}`);
    // Implement delete logic
  };

  const handlePermissionModalOpen = () => {
    setPermissionName('');
    setMainModule('');
    setModuleName('');
    setViewAccess(false);
    setCreateAccess(false);
    setUpdateAccess(false);
    setDeleteAccess(false);
    setEditingPermissionId(null);
    setIsPermissionModalOpen(true);
  };

  const handlePermissionModalClose = () => {
    setIsPermissionModalOpen(false);
  };

  const handlePermissionSave = async () => {
    const permissionData = {
      main_module: mainModule,
      module_name: moduleName,
      view_access: viewAccess,
      create_access: createAccess,
      update_access: updateAccess,
      delete_access: deleteAccess,
    };

    try {
      if (editingPermissionId) {
        await axios.put(`/api/role_permissions/${editingPermissionId}`, permissionData);
        alert('Permission updated successfully');
      } else {
        await axios.post('/api/role_permissions', permissionData);
        alert('Permission created successfully');
      }
      setIsPermissionModalOpen(false);
      // Refetch permissions
      const { data } = await axios.get('/api/role_permissions');
      setPermissions(data.results || []);
    } catch (err) {
      console.error('Error saving permission:', err);
      alert('Error saving permission');
    }
  };

  return (
    <Layout>
      <PageTitle>Role Permission Management</PageTitle>
      <CTA />
      <SectionTitle>Role Permissions</SectionTitle>
      
      <Button onClick={handlePermissionModalOpen}>Create New Permission</Button>

      <TableContainer>
        {loadingPermissions ? (
          <p>Loading role permissions...</p>
        ) : (
          <Table>
            <TableHeader>
              <tr>
                <TableCell>Main Module</TableCell>
                <TableCell>Module Name</TableCell>
                <TableCell>Actions</TableCell>
              </tr>
            </TableHeader>
            <TableBody>
              {permissions.map((permission) => (
                <TableRow key={permission.id}>
                  <TableCell>{permission.main_module}</TableCell>
                  <TableCell>{permission.module_name}</TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-4">
                      <Button layout="link" size="small" onClick={() => handleEditPermission(permission.id)}>
                        <EditIcon className="w-5 h-5" />
                      </Button>
                      <Button layout="link" size="small" onClick={() => handleDeletePermission(permission.id)}>
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

      {/* Permission Modal */}
      <Modal isOpen={isPermissionModalOpen} onClose={handlePermissionModalClose}>
        <h2>{editingPermissionId ? 'Edit Permission' : 'Create New Permission'}</h2>
        <div className="modal-body">
          <label>
            Main Module
            <Input
              value={mainModule}
              onChange={(e) => setMainModule(e.target.value)}
              placeholder="Enter main module"
            />
          </label>
          <label className="mt-4">
            Module Name
            <Input
              value={moduleName}
              onChange={(e) => setModuleName(e.target.value)}
              placeholder="Enter module name"
            />
          </label>
          <label className="mt-4">
            <input
              type="checkbox"
              checked={viewAccess}
              onChange={() => setViewAccess((prev) => !prev)}
            />
            View Access
          </label>
          <label className="mt-4">
            <input
              type="checkbox"
              checked={createAccess}
              onChange={() => setCreateAccess((prev) => !prev)}
            />
            Create Access
          </label>
          <label className="mt-4">
            <input
              type="checkbox"
              checked={updateAccess}
              onChange={() => setUpdateAccess((prev) => !prev)}
            />
            Update Access
          </label>
          <label className="mt-4">
            <input
              type="checkbox"
              checked={deleteAccess}
              onChange={() => setDeleteAccess((prev) => !prev)}
            />
            Delete Access
          </label>
        </div>
        <div className="modal-footer">
          <Button onClick={handlePermissionSave}>Save</Button>
          <Button layout="link" onClick={handlePermissionModalClose}>
            Cancel
          </Button>
        </div>
      </Modal>
    </Layout>
  );
};

export default RolePermissionPage;
