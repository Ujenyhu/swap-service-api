import express from 'express';
import cors from 'cors';
import router from './routes';
import { setupSwagger } from './swagger';

const app = express();
app.use(express.json())
  .use("/api", router)
  .use(cors());
  

setupSwagger(app);

// Start the server
const PORT = process.env.PORT || 6500;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}/api`);
});
