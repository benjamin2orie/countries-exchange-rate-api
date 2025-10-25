

import app from './app.js';
import dotenv from 'dotenv';
import {sequelize} from './config/db.js'

dotenv.config();


sequelize.sync().then(() => {
  console.log('Database synced');
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});