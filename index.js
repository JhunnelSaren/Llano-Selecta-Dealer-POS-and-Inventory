const path = require('path');
const fs = require('fs');
const dotenv = require('dotenv');

// Check possible locations for .env
const candidateEnvPaths = [
  path.join(__dirname, '.env'),
  path.join(__dirname, 'llano-selecta-frontend', 'server', '.env'),
  path.join(__dirname, 'server', '.env'),
  path.join(__dirname, 'llano-selecta-frontend', '.env')
];

for (const envPath of candidateEnvPaths) {
  if (fs.existsSync(envPath)) {
    dotenv.config({ path: envPath });
  }
}

// Launch backend server
import('./llano-selecta-frontend/server/index.js');
