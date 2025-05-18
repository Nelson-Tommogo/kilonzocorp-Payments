import express from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import stkRoutes from "./routes/stkRoutes.js";
import cors from "cors";

dotenv.config({ path: "./src/.env" });

// Configure allowed origins
const whitelist = [
  "http://kilonzocorp.com",
  "https://kilonzocorp.com",
  "http://localhost:3000",
  "https://localhost:3000",
  "http://localhost:5000",
  "https://localhost:5000",
  /\.vercel\.app$/,
  "https://kilonzocorp.vercel.app",
  "http://kilonzocorp.vercel.app"
];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    
    if (
      whitelist.some(allowedOrigin => {
        if (typeof allowedOrigin === 'string') {
          return origin === allowedOrigin || 
                origin.startsWith(allowedOrigin);
        } else if (allowedOrigin instanceof RegExp) {
          return allowedOrigin.test(origin);
        }
        return false;
      })
    ) {
      callback(null, true);
    } else {
      callback(new Error(`Origin '${origin}' not allowed by CORS`));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
};

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors(corsOptions));

// Middleware
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
app.use("/api", stkRoutes);

// Health check
app.get("/", (req, res) => {
  res.status(200).json({ 
    message: "Server is up and running!",
    allowedOrigins: whitelist
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log("Allowed origins:", whitelist);
});

export { app, PORT };