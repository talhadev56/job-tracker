import "dotenv/config";

// console.log("CLIENT_URL:", process.env.CLIENT_URL);

import connectDB from "./src/config/db.js";
import app from "./src/app.js";

connectDB();

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
