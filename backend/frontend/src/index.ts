import log from '../lib/logger';
import app from './app';

const PORT = process.env.SERVER_PORT || 3000;

app.listen(PORT, () => {
  const url = `localhost:${PORT}`;
  log.info('');
  log.info(`Server Running: ${url}`);
  log.info(`Docs available at : ${url}/api/docs`);
});
