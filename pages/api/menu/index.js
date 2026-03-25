import { ObjectId } from 'mongodb';
import { withApiHandler, getDb, validateRequired } from '@/lib/apiHandler';

async function handler(req, res) {
  const method = req.method?.toUpperCase();

  switch (method) {
    case 'GET':
      return await handleGetMenu(req, res);
    case 'POST':
      return await handlePostMenu(req, res);
    case 'PUT':
      return await handlePutMenu(req, res);
    case 'DELETE':
      return await handleDeleteMenu(req, res);
    default:
      res.status(405).json({ error: 'Method not allowed' });
  }
}

async function handleGetMenu(req, res) {
  const db = await getDb();
  const items = await db.collection('menu')
    .find({})
    .sort({ category_name: 1, name: 1 })
    .toArray();
  
  res.status(200).json(items);
}

async function handlePostMenu(req, res) {
  validateRequired(req.body, ['category_id', 'name', 'price']);
  
  const db = await getDb();
  
  // Get category name
  const category = await db.collection('categories').findOne({ _id: new ObjectId(req.body.category_id) });
  const categoryName = category?.name || 'Unknown';
  
  const result = await db.collection('menu').insertOne({
    category_id: new ObjectId(req.body.category_id),
    category_name: categoryName,
    name: req.body.name,
    description: req.body.description || '',
    price: parseFloat(req.body.price),
    unit: req.body.unit || 'portion',
    image: req.body.image || '',
    available: true,
    created_at: new Date(),
    updated_at: new Date()
  });

  res.status(201).json({ id: result.insertedId });
}

async function handlePutMenu(req, res) {
  const { id } = req.query;
  if (!id) {
    const err = new Error('Item ID required');
    err.status = 400;
    throw err;
  }

  const db = await getDb();
  const updateData = {};
  if (req.body.name) updateData.name = req.body.name;
  if (req.body.price) updateData.price = parseFloat(req.body.price);
  if (req.body.description) updateData.description = req.body.description;
  if (req.body.unit) updateData.unit = req.body.unit;
  if (req.body.image) updateData.image = req.body.image;
  updateData.updated_at = new Date();

  const result = await db.collection('menu').updateOne(
    { _id: new ObjectId(id) },
    { $set: updateData }
  );

  if (result.matchedCount === 0) {
    const err = new Error('Item not found');
    err.status = 404;
    throw err;
  }

  res.status(200).json({ success: true });
}

async function handleDeleteMenu(req, res) {
  const { id } = req.query;
  if (!id) {
    const err = new Error('Item ID required');
    err.status = 400;
    throw err;
  }

  const db = await getDb();
  const result = await db.collection('menu').deleteOne({
    _id: new ObjectId(id)
  });

  if (result.deletedCount === 0) {
    const err = new Error('Item not found');
    err.status = 404;
    throw err;
  }

  res.status(200).json({ success: true });
}

export default withApiHandler(handler);
