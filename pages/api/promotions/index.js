import { ObjectId } from 'mongodb';
import { withApiHandler, getDb, validateRequired } from '@/lib/apiHandler';

function authMiddleware(req) {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    const err = new Error('Unauthorized');
    err.status = 401;
    throw err;
  }

  const expectedToken = Buffer.from(process.env.ADMIN_PASSWORD || '').toString('base64');
  const token = authHeader.substring(7);
  
  if (token !== expectedToken) {
    const err = new Error('Forbidden');
    err.status = 403;
    throw err;
  }
}

async function handler(req, res) {
  const method = req.method?.toUpperCase();

  switch (method) {
    case 'GET':
      return await handleGetPromotions(req, res);
    case 'POST':
      authMiddleware(req);
      return await handlePostPromotion(req, res);
    case 'PUT':
      authMiddleware(req);
      return await handlePutPromotion(req, res);
    case 'DELETE':
      authMiddleware(req);
      return await handleDeletePromotion(req, res);
    default:
      res.status(405).json({ error: 'Method not allowed' });
  }
}

async function handleGetPromotions(req, res) {
  const db = await getDb();
  const promotions = await db.collection('promotions')
    .find({ is_active: 1 })
    .toArray();
  
  res.status(200).json(promotions);
}

async function handlePostPromotion(req, res) {
  validateRequired(req.body, ['title']);

  const db = await getDb();
  const result = await db.collection('promotions').insertOne({
    item_id: req.body.item_id ? new ObjectId(req.body.item_id) : null,
    category_id: req.body.category_id ? new ObjectId(req.body.category_id) : null,
    title: req.body.title,
    description: req.body.description || null,
    discount_percent: req.body.discount_percent ? parseFloat(req.body.discount_percent) : null,
    discount_amount: req.body.discount_amount ? parseFloat(req.body.discount_amount) : null,
    image_url: req.body.image_url || null,
    start_date: req.body.start_date ? new Date(req.body.start_date) : null,
    end_date: req.body.end_date ? new Date(req.body.end_date) : null,
    is_active: 1,
    created_at: new Date()
  });

  res.status(201).json({ id: result.insertedId });
}

async function handlePutPromotion(req, res) {
  const { id } = req.query;
  if (!id) {
    const err = new Error('Promotion ID required');
    err.status = 400;
    throw err;
  }

  const db = await getDb();
  const updateData = { updated_at: new Date() };

  if (req.body.item_id) updateData.item_id = new ObjectId(req.body.item_id);
  if (req.body.category_id) updateData.category_id = new ObjectId(req.body.category_id);
  if (req.body.title) updateData.title = req.body.title;
  if (req.body.description !== undefined) updateData.description = req.body.description;
  if (req.body.discount_percent) updateData.discount_percent = parseFloat(req.body.discount_percent);
  if (req.body.discount_amount) updateData.discount_amount = parseFloat(req.body.discount_amount);
  if (req.body.image_url !== undefined) updateData.image_url = req.body.image_url;
  if (req.body.is_active !== undefined) updateData.is_active = req.body.is_active;

  const result = await db.collection('promotions').updateOne(
    { _id: new ObjectId(id) },
    { $set: updateData }
  );

  if (result.matchedCount === 0) {
    const err = new Error('Promotion not found');
    err.status = 404;
    throw err;
  }

  res.status(200).json({ success: true });
}

async function handleDeletePromotion(req, res) {
  const { id } = req.query;
  if (!id) {
    const err = new Error('Promotion ID required');
    err.status = 400;
    throw err;
  }

  const db = await getDb();
  const result = await db.collection('promotions').deleteOne({
    _id: new ObjectId(id)
  });

  if (result.deletedCount === 0) {
    const err = new Error('Promotion not found');
    err.status = 404;
    throw err;
  }

  res.status(200).json({ success: true });
}

export default withApiHandler(handler);
