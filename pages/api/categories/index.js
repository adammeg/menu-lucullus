import { withApiHandler, getDb } from '@/lib/apiHandler';

async function handler(req, res) {
  if (req.method !== 'GET') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const db = await getDb();
  const categories = await db.collection('categories')
    .find({})
    .sort({ order_index: 1 })
    .toArray();

  res.status(200).json(categories);
}

export default withApiHandler(handler);
