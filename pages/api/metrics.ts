import { NextApiRequest, NextApiResponse } from 'next';

export default (req: NextApiRequest, res: NextApiResponse) => {
  const metrics = { totalUsers: 100, activeRoles: 5 };
  res.status(200).json(metrics);
};