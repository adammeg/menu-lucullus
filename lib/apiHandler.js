import { connectToDatabase } from './mongodb';

const TIMEOUT_MS = 20000; // 20 seconds

export function withApiHandler(handler) {
  return async (req, res) => {
    const timeoutId = setTimeout(() => {
      if (!res.headersSent) {
        res.status(504).json({ error: 'Request timeout' });
      }
    }, TIMEOUT_MS);

    try {
      await handler(req, res);
    } catch (error) {
      console.error('API Error:', error);
      if (!res.headersSent) {
        const statusCode = getStatusCode(error);
        res.status(statusCode).json({
          error: error.message || 'Internal server error'
        });
      }
    } finally {
      clearTimeout(timeoutId);
    }
  };
}

export async function getDb() {
  try {
    const { db } = await connectToDatabase();
    return db;
  } catch (error) {
    console.error('MongoDB connection error details:', error.message, error.code);
    if (error.type === 'MONGODB_CONNECTION_ERROR') {
      const err = new Error(`Database connection failed: ${error.message}`);
      err.status = 503;
      throw err;
    }
    throw error;
  }
}

function getStatusCode(error) {
  if (error.status) return error.status;
  if (error.code === 'ECONNREFUSED') return 503;
  if (error.message?.includes('MONGODB')) return 503;
  if (error.message?.includes('Unauthorized')) return 401;
  if (error.message?.includes('Forbidden')) return 403;
  return 500;
}

export function validateRequired(obj, fields) {
  for (const field of fields) {
    if (obj[field] === undefined || obj[field] === null || obj[field] === '') {
      const err = new Error(`Missing required field: ${field}`);
      err.status = 400;
      throw err;
    }
  }
}
