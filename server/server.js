const app = require('./app.js');

const PORT = process.env.PORT || 5000;
require('dotenv').config();
console.log('EMAIL_USER:', process.env.EMAIL_USER);
console.log('EMAIL_PASS:', process.env.EMAIL_PASS);
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
