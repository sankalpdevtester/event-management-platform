import express, { Request, Response } from 'express';
import { MongoClient } from 'mongodb';
import { environment } from '../environments/environment';

const router = express.Router();
const mongoUrl = environment.mongoUrl;
const dbName = environment.dbName;
const collectionName = environment.collectionName;

router.post('/register', async (req: Request, res: Response) => {
  try {
    const client = new MongoClient(mongoUrl);
    const db = client.db(dbName);
    const collection = db.collection(collectionName);
    const userData = req.body;
    const existingUser = await collection.findOne({ email: userData.email });
    if (existingUser) {
      res.status(400).send({ error: 'Email already exists' });
    } else {
      const result = await collection.insertOne(userData);
      res.send({ success: true, userId: result.insertedId });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: 'Internal Server Error' });
  }
});

router.post('/login', async (req: Request, res: Response) => {
  try {
    const client = new MongoClient(mongoUrl);
    const db = client.db(dbName);
    const collection = db.collection(collectionName);
    const userData = req.body;
    const user = await collection.findOne({ email: userData.email, password: userData.password });
    if (user) {
      res.send({ success: true, userId: user._id });
    } else {
      res.status(401).send({ error: 'Invalid credentials' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: 'Internal Server Error' });
  }
});

export default router;