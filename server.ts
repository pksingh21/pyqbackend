import app from './app'; // Importing the app module
import dotenv from 'dotenv';

// Load environment variables from .env file, where PORT might be defined
dotenv.config();

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
