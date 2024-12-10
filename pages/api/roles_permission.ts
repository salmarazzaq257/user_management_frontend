import { NextApiRequest, NextApiResponse } from 'next';

const roles = [
  { id: 1, name: 'Admin', isActive: true },
  { id: 2, name: 'Editor', isActive: true },
  { id: 3, name: 'Viewer', isActive: true },
];

const rolePermissions = [
  { role_id: 1, main_module: 'Dashboard', module_name: 'Admin Panel', view_access: true, create_access: true, update_access: true, delete_access: true },
  { role_id: 1, main_module: 'User Management', module_name: 'Users', view_access: true, create_access: true, update_access: true, delete_access: true },
  { role_id: 2, main_module: 'Dashboard', module_name: 'Editor Panel', view_access: true, create_access: true, update_access: false, delete_access: false },
  { role_id: 2, main_module: 'User Management', module_name: 'Users', view_access: true, create_access: true, update_access: false, delete_access: false },
  { role_id: 3, main_module: 'Dashboard', module_name: 'Viewer Panel', view_access: true, create_access: false, update_access: false, delete_access: false },
  { role_id: 3, main_module: 'User Management', module_name: 'Users', view_access: true, create_access: false, update_access: false, delete_access: false },
];

export default (req: NextApiRequest, res: NextApiResponse) => {
  const { page = 1, resultsPerPage = 10, roleId } = req.query;

  // Validate the inputs
  const pageNumber = Math.max(1, parseInt(page as string, 10));  // Ensure a positive page number
  const itemsPerPage = Math.max(1, parseInt(resultsPerPage as string, 10));  // Ensure positive items per page

  const startIndex = (pageNumber - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  let filteredPermissions = rolePermissions;

  // Filter by roleId if provided
  if (roleId) {
    const roleIdNumber = parseInt(roleId as string, 10);
    if (isNaN(roleIdNumber)) {
      return res.status(400).json({ error: 'Invalid roleId parameter' });
    }
    filteredPermissions = rolePermissions.filter(permission => permission.role_id === roleIdNumber);
  }

  // Paginate the filtered data
  const paginatedPermissions = filteredPermissions.slice(startIndex, endIndex);

  // Respond with paginated permissions
  res.status(200).json({ results: paginatedPermissions, total: filteredPermissions.length });
};
