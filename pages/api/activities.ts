import { NextApiRequest, NextApiResponse } from 'next';

const activities = [
  { action: 'Login', timestamp: '2023-10-01T12:00:00Z', user: 'John Doe' },
  { action: 'Logout', timestamp: '2023-10-01T12:30:00Z', user: 'Jane Doe' },
  // Add more activities as needed
];

export default (req: NextApiRequest, res: NextApiResponse) => {
  res.status(200).json(activities);
};