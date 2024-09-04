/* eslint-disable no-useless-escape */
import log from '../lib/logger';
import app from './app';

const PORT = process.env.SERVER_PORT || 3000;
const INTRO = `PC BEE Business Management System:
 ________  ________          ________  _______   _______      
|\\   __  \\|\\   ____\\        |\\   __  \\|\\  ___ \\ |\\  ___ \\     
\\ \\  \\|\\  \\ \\  \\___|        \\ \\  \\|\\ \\ \\   __/|\\ \\   __/|    
 \\ \\   ____\\ \\  \\            \\ \\   __  \\ \\  \\_|/_\\ \\  \\_|/__  
  \\ \\  \\___|\\ \\  \\____        \\ \\  \\|\\  \\ \\  \\_|\\ \\ \\  \\_|\ \\
   \\ \\__\\    \\ \\_______\\       \\ \\_______\\ \\_______\\ \\_______\\
    \\|__|     \\|_______|        \\|_______|\\|_______|\\|_______|
`;

app.listen(PORT, () => {
  const url = `http://localhost:${PORT}`;
  log.info(`Server Running at: ${url}`);
  log.info(`Docs available at: ${url}/docs`);
  log.info(INTRO);
});
