import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';

import router from '^/router';

const app = express();
const { PORT = 3000 } = process.env;

app.use(bodyParser.json());

app.use('/api', router);

app.use((_req: Request, res: Response) => {
  res.status(404).send('<p>Page not found</p>');
});

app.listen(PORT, () => {
  console.log(`server started at http://localhost:${PORT}`);
});

export default app;
