const path = require('path');
const dotenv = require('dotenv');

// Load environment variables from the server directory
const serverDir = path.join(__dirname, 'llano-selecta-frontend', 'server');
dotenv.config({ path: path.join(serverDir, '.env') });

// Launch backend server
import('./llano-selecta-frontend/server/index.js');
