import React, { useState, useEffect } from 'react';
import { Line, Doughnut } from 'react-chartjs-2';
import CTA from 'example/components/CTA'
import Layout from 'example/containers/Layout';

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import InfoCard from 'example/components/Cards/InfoCard';
import Modal from 'example/components/Modal/modal';
import RoundIcon from 'example/components/RoundIcon';
import Dropdown from 'example/components/Dropdown/dropdown';
import axios from 'axios';
import { CartIcon, ChatIcon, MoneyIcon, PeopleIcon } from 'icons';


import {
  TableBody,
  TableContainer,
  Table,
  TableHeader,
  TableCell,
  TableRow,
  TableFooter,
  Avatar,
  Badge,
  Pagination,
} from '@roketid/windmill-react-ui';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);


interface User {
    firstName: string;
    lastName: string;
    email: string;
    avatar?: string;
    role?: {
      id: number;
      name: string;
    };
  }
  interface Role {
    id: number;
    name: string;
  }
  interface Metrics {
    totalUsers: number;
    activeRoles: number;
  }
  interface Activity {
    timestamp: string;
    user: string;
    action: string;
  }



const Dashboard: React.FC = () => {
  
  const [users, setUsers] = useState<User[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [metrics, setMetrics] = useState({ totalUsers: 0, activeRoles: 0 });
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  const resultsPerPage = 10;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [metricsRes, rolesRes, activitiesRes] = await Promise.all([
          axios.get('/api/metrics'),
          axios.get('/api/roles'),
          axios.get('/api/activities'),
        ]);
        setMetrics(metricsRes.data);
        setRoles(rolesRes.data);
        setActivities(activitiesRes.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const { data } = await axios.get('/api/users', {
          params: { page, resultsPerPage },
        });
        setUsers(data.results);
        setTotalResults(data.total); // Ensure the API provides the total user count
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, [page]);

  const generateColors = (count: number): string[] =>
    Array.from({ length: count }, (_, i) => `hsl(${(i * 360) / count}, 70%, 60%)`);
  const doughnutData = roles && roles.length > 0 ? {
    labels: roles.map((role) => role.name),
    datasets: [
      {
        data: roles.map((role) =>
          users.filter((user) => user.role?.id === role.id).length
        ),
        backgroundColor: generateColors(roles.length),
      },
    ],
  } : { labels: [], datasets: [] };

  const lineData = {
    labels: activities.map((activity) =>
      new Date(activity.timestamp).toLocaleDateString('en-US', {
        month: 'short',
        year: 'numeric',
      })
    ),
    datasets: [
      {
        label: 'Activity Count',
        data: activities.map((_, i) => i + 1), // Dummy counts for now
        backgroundColor: 'rgba(54,162,235,0.2)',
        borderColor: '#36A2EB',
        borderWidth: 2,
      },
    ],
  };

  return (
    <Layout>
    <div>
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>


      <CTA />

      {/* Info Cards */}
      <div className="grid gap-6 mb-8 md:grid-cols-2 xl:grid-cols-4">
         <InfoCard title="Total Users" value={metrics.totalUsers.toString()}>
          {/* @ts-ignore */}
          <RoundIcon
            icon={PeopleIcon}
            iconColorClass="text-orange-500 dark:text-orange-100"
            bgColorClass="bg-orange-100 dark:bg-orange-500"
            className="mr-4"
          />
        </InfoCard>

        <InfoCard title="Active Roles" value={metrics.activeRoles.toString()}>
          {/* @ts-ignore */}
          <RoundIcon
            icon={MoneyIcon}
            iconColorClass="text-green-500 dark:text-green-100"
            bgColorClass="bg-green-100 dark:bg-green-500"
            className="mr-4"
          />
        </InfoCard>

        <InfoCard title="Recent Activities" value={activities.length.toString()}>
          {/* @ts-ignore */}
          <RoundIcon
            icon={CartIcon}
            iconColorClass="text-blue-500 dark:text-blue-100"
            bgColorClass="bg-blue-100 dark:bg-blue-500"
            className="mr-4"
          />
        </InfoCard>

        <InfoCard title="Pending Tasks" value="15">
          {/* @ts-ignore */}
          <RoundIcon
            icon={ChatIcon}
            iconColorClass="text-teal-500 dark:text-teal-100"
            bgColorClass="bg-teal-100 dark:bg-teal-500"
            className="mr-4"
          />
        </InfoCard>
      </div>

      {/* User Table */}
      <TableContainer>
        {loading ? (
          <p>Loading users...</p>
        ) : users.length ? (
          <>
            <Table>
              <TableHeader>
                <tr>
                  <TableCell>First Name</TableCell>
                  <TableCell>Last Name</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Role</TableCell>
                </tr>
              </TableHeader>
              <TableBody>
                {users.map((user, i) => (
                  <TableRow key={i}>
                    <TableCell>
                      <div className="flex items-center text-sm">
                        <Avatar
                          className="hidden mr-3 md:block"
                          src={user.avatar || '/default-avatar.png'}
                          alt={`${user.firstName} ${user.lastName}`}
                        />
                        <div>
                          <p className="font-semibold">{user.firstName} {user.lastName}</p>
                          <p className="text-xs text-gray-600 dark:text-gray-400">{user.email}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{user.lastName}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <Badge type={user.role ? 'success' : 'neutral'}>
                        {user.role?.name || 'Unassigned'}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <TableFooter>
              <Pagination
                totalResults={totalResults}
                resultsPerPage={resultsPerPage}
                label="Table navigation"
                onChange={setPage}
              />
            </TableFooter>
          </>
        ) : (
          <p>No users found.</p>
        )}
      </TableContainer>

      <div className="grid gap-6 mb-8 md:grid-cols-2">
        <div>
          <h2 className="text-lg font-bold mb-4">User Distribution</h2>
          <Doughnut data={doughnutData} />
        </div>
        <div>
          <h2 className="text-lg font-bold mb-4">Activity Trends</h2>
          <Line data={lineData} />
        </div>
      </div>
    </div>
    </Layout>
    
    
  );
};
export default Dashboard;
