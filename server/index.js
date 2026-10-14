const path = require('path');
const fs = require('fs');
const dotenv = require('dotenv');

// Check possible locations for .env
const envPaths = [
  path.join(__dirname, '.env'),
  path.join(__dirname, '..', 'llano-selecta-frontend', 'server', '.env'),
  path.join(__dirname, '..', '.env')
];

for (const envPath of envPaths) {
  if (fs.existsSync(envPath)) {
    dotenv.config({ path: envPath });
    break;
  }
}

// Forward to the backend implementation
import('../llano-selecta-frontend/server/index.js');
