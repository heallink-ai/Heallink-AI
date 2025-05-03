import express from 'express';
import { validateEmail, User, formatDate } from '@heallink/common';

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

// Example endpoint using shared code from common package
app.post('/users', (req, res) => {
  const { name, email } = req.body;
  
  if (!name || !email) {
    return res.status(400).json({ error: 'Name and email are required' });
  }
  
  if (!validateEmail(email)) {
    return res.status(400).json({ error: 'Invalid email format' });
  }
  
  const user: User = {
    id: Date.now().toString(),
    name,
    email
  };
  
  return res.status(201).json({
    user,
    createdDate: formatDate(new Date())
  });
});

app.listen(port, () => {
  console.log(`API server running at http://localhost:${port}`);
});