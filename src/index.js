import express from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import stkRoutes from "./routes/stkRoutes.js";
import cors from "cors";

dotenv.config({ path: "./src/.env" });
const whitelist = ["https://kilonzocorp.vercel.app/"];
const corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
};

const app = express();
const PORT = process.env.PORT;
app.use(cors());

// Middleware
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Use the routes
app.use("/api", stkRoutes); // Prefix routes with '/api' if desired

// Simple route to check if server is up
app.get("/", (req, res) => {
  res.status(200).json({ message: "Server is up and running!" });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export { app, PORT };
