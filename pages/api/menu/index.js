import { ObjectId } from 'mongodb';
import { connectToDatabase } from '@/lib/mongodb';

export default async function handler(req, res) {
  try {
    const { db } = await connectToDatabase();
    const { id } = req.query;

    if (req.method === 'GET') {
      // Get all menu items with categories
      const menuItems = await db.collection('menu_items')
        .aggregate([
          {
            $lookup: {
              from: 'categories',
              localField: 'category_id',
              foreignField: '_id',
              as: 'category'
            }
          },
          { $unwind: '$category' },
          { $sort: { 'category.order_index': 1, name: 1 } }
        ])
        .toArray();

      res.status(200).json(menuItems);
    } else if (req.method === 'POST') {
      // Create menu item (admin only)
      const { category_id, name, description, price, image_url } = req.body;

      const newItem = {
        category_id: new ObjectId(category_id),
        name,
        description,
        price: parseFloat(price),
        image_url: image_url || null,
        created_at: new Date(),
        updated_at: new Date()
      };

      const result = await db.collection('menu_items').insertOne(newItem);
      res.status(201).json({ id: result.insertedId, ...newItem });
    } else if (req.method === 'PUT' && id) {
      // Update menu item
      const { name, description, price, image_url } = req.body;

      const result = await db.collection('menu_items').updateOne(
        { _id: new ObjectId(id) },
        {
          $set: {
            name,
            description,
            price: parseFloat(price),
            image_url: image_url || null,
            updated_at: new Date()
          }
        }
      );

      res.status(200).json({ success: result.modifiedCount > 0 });
    } else if (req.method === 'DELETE' && id) {
      // Delete menu item
      const result = await db.collection('menu_items').deleteOne({
        _id: new ObjectId(id)
      });

      res.status(200).json({ success: result.deletedCount > 0 });
    } else {
      res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Menu API Error:', error);
    res.status(500).json({ error: error.message });
  }
}
