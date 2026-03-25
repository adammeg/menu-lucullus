import { connectToDatabase } from '@/lib/mongodb';

export default async function handler(req, res) {
  try {
    const { db } = await connectToDatabase();

    if (req.method === 'GET') {
      // Get all categories
      const categories = await db.collection('categories')
        .find({})
        .sort({ order_index: 1 })
        .toArray();

      res.status(200).json(categories);
    } else {
      res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Categories API Error:', error);
    res.status(500).json({ error: error.message });
  }
}
