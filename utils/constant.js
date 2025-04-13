const path = require('path');

const JWT_SECRET = 'qwertyuiopasdfghjklzxcvbnm';
const folderPath = path.join(__dirname, '../public/uploads');
const filePath = path.join(__dirname, '../public');

module.exports = {
    JWT_SECRET,
    filePath,
    folderPath
}