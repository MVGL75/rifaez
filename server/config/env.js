import path from 'path';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

// Set up __dirname for ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load the .env file from /server
dotenv.config({ path: path.join(__dirname, '.env') });

// Test
console.log('STRIPE KEY:', process.env.STRIPE_SECRET_KEY);

