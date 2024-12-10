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
  Avatar,
  Button,
  Pagination,
} from '@roketid/windmill-react-ui';
import { EditIcon, TrashIcon } from 'icons';
import Layout from 'example/containers/Layout';
import axios from 'axios';

interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  role?: { id: number; name: string };
  avatar?: string;
  isActive: boolean;
  loginCount: number;
  lastLoginAt?: string;
  lastLoginIP?: string;
  isConfirmed: boolean;
  deletedAt?: string;
}

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [userPage, setUserPage] = useState(1);
  const userResultsPerPage = 10;

  useEffect(() => {
    const fetchUsers = async () => {
      setLoadingUsers(true);
      try {
        const { data } = await axios.get('/api/users', {
          params: { page: userPage, resultsPerPage: userResultsPerPage },
        });
        setUsers(data.results || []);
      } catch (err) {
        console.error('Error fetching users:', err);
      } finally {
        setLoadingUsers(false);
      }
    };
    fetchUsers();
  }, [userPage]);

  const handleEditUser = (userId: number) => {
    console.log(`Editing user with ID: ${userId}`);
    // Implement edit logic
  };

  const handleDeleteUser = (userId: number) => {
    console.log(`Soft deleting user with ID: ${userId}`);
    // Implement soft delete logic (set deletedAt field)
  };

  const handleActivateUser = (userId: number) => {
    console.log(`Activating user with ID: ${userId}`);
    // Implement activate logic (set isActive to true)
  };

  const handleDeactivateUser = (userId: number) => {
    console.log(`Deactivating user with ID: ${userId}`);
    // Implement deactivate logic (set isActive to false)
  };

  const mapStatusToBadgeType = (status: boolean): "success" | "neutral" | "danger" | "warning" | "primary" | undefined => {
    return status ? 'success' : 'neutral';
  };

  return (
    <Layout>
      <PageTitle>User Management</PageTitle>
      <CTA />

      <SectionTitle>Manage Users</SectionTitle>
      <TableContainer>
        {loadingUsers ? (
          <p>Loading users...</p>
        ) : (
          <Table>
            <TableHeader>
              <tr>
                <TableCell>First Name</TableCell>
                <TableCell>Last Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Role</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </tr>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>{user.firstName}</TableCell>
                  <TableCell>{user.lastName}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Badge type={user.role ? 'success' : 'neutral'}>
                      {user.role?.name || 'Unassigned'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge type={mapStatusToBadgeType(user.isActive)}>
                      {user.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-4">
                      <Button layout="link" size="small" onClick={() => handleEditUser(user.id)}>
                        <EditIcon className="w-5 h-5" />
                      </Button>
                      <Button layout="link" size="small" onClick={() => handleDeleteUser(user.id)}>
                        <TrashIcon className="w-5 h-5" />
                      </Button>
                      {user.isActive ? (
                        <Button layout="link" size="small" onClick={() => handleDeactivateUser(user.id)}>
                          Deactivate
                        </Button>
                      ) : (
                        <Button layout="link" size="small" onClick={() => handleActivateUser(user.id)}>
                          Activate
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </TableContainer>
      {/* Pagination would go here */}
    </Layout>
  );
};

export default UserManagement;
