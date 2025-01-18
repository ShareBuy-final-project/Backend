const path = require('path');
const { execSync } = require('child_process');

// Link the models package
execSync('npm link models', { cwd: path.resolve(__dirname, 'services/User') });