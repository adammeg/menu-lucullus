import { ObjectId } from 'mongodb';
import { connectToDatabase } from '@/lib/mongodb';

export default async function handler(req, res) {
  try {
    const { db } = await connectToDatabase();
    const { id } = req.query;

    if (req.method === 'GET') {
      // Get active promotions
      const promotions = await db.collection('promotions')
        .find({ is_active: 1 })
        .toArray();

      res.status(200).json(promotions);
    } else if (req.method === 'POST') {
      // Create promotion (admin only)
      const {
        item_id,
        category_id,
        title,
        description,
        discount_percent,
        discount_amount,
        image_url,
        start_date,
        end_date
      } = req.body;

      // Validate authentication token
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      // Simple password auth for MVP
      const token = authHeader.substring(7);
      if (token !== Buffer.from(process.env.ADMIN_PASSWORD).toString('base64')) {
        return res.status(403).json({ error: 'Forbidden' });
      }

      const newPromotion = {
        item_id: item_id ? new ObjectId(item_id) : null,
        category_id: category_id ? new ObjectId(category_id) : null,
        title,
        description: description || null,
        discount_percent: discount_percent ? parseFloat(discount_percent) : null,
        discount_amount: discount_amount ? parseFloat(discount_amount) : null,
        image_url: image_url || null,
        start_date: start_date ? new Date(start_date) : null,
        end_date: end_date ? new Date(end_date) : null,
        is_active: 1,
        created_at: new Date()
      };

      const result = await db.collection('promotions').insertOne(newPromotion);
      res.status(201).json({ id: result.insertedId, ...newPromotion });
    } else if (req.method === 'PUT' && id) {
      // Update promotion
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const token = authHeader.substring(7);
      if (token !== Buffer.from(process.env.ADMIN_PASSWORD).toString('base64')) {
        return res.status(403).json({ error: 'Forbidden' });
      }

      const updateData = { ...req.body, updated_at: new Date() };
      
      // Convert IDs if present
      if (updateData.item_id && typeof updateData.item_id === 'string') {
        updateData.item_id = new ObjectId(updateData.item_id);
      }
      if (updateData.category_id && typeof updateData.category_id === 'string') {
        updateData.category_id = new ObjectId(updateData.category_id);
      }

      const result = await db.collection('promotions').updateOne(
        { _id: new ObjectId(id) },
        { $set: updateData }
      );

      res.status(200).json({ success: result.modifiedCount > 0 });
    } else if (req.method === 'DELETE' && id) {
      // Delete promotion
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const token = authHeader.substring(7);
      if (token !== Buffer.from(process.env.ADMIN_PASSWORD).toString('base64')) {
        return res.status(403).json({ error: 'Forbidden' });
      }

      const result = await db.collection('promotions').deleteOne({
        _id: new ObjectId(id)
      });

      res.status(200).json({ success: result.deletedCount > 0 });
    } else {
      res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Promotions API Error:', error);
    res.status(500).json({ error: error.message });
  }
}
