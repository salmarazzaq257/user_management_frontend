import { NextApiRequest, NextApiResponse } from 'next';

const roles = [
  { id: 1, name: 'Admin', isActive: true },
  { id: 2, name: 'Editor' , isActive: true },
  { id: 3, name: 'Viewer', isActive: true },
];

export default (req: NextApiRequest, res: NextApiResponse) => {
  const { page = 1, resultsPerPage = 10 } = req.query;
  const startIndex = (Number(page) - 1) * Number(resultsPerPage);
  const endIndex = startIndex + Number(resultsPerPage);
  const paginatedUsers = roles.slice(startIndex, endIndex);

  res.status(200).json({ results: paginatedUsers, total: roles.length });
};