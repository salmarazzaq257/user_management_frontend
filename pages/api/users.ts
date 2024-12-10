import { NextApiRequest, NextApiResponse } from 'next';

const users = [
  { id: 1, firstName: 'John', lastName: 'Doe', email: 'john@example.com', role: 'Admin', avatar: '', job: 'Developer', isActive: true },
  { id: 2, firstName: 'Jane', lastName: 'Doe', email: 'jane@example.com', role: 'Editor', avatar: '', job: 'Designer', isActive: false },
  // Add more users as needed
];

export default (req: NextApiRequest, res: NextApiResponse) => {
  const { page = 1, resultsPerPage = 10 } = req.query;
  const startIndex = (Number(page) - 1) * Number(resultsPerPage);
  const endIndex = startIndex + Number(resultsPerPage);
  const paginatedUsers = users.slice(startIndex, endIndex);

  res.status(200).json({ results: paginatedUsers, total: users.length });
};
