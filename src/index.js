import connectDB from "./db/index.js";
import dotenv from "dotenv";
import app from "./app.js";

dotenv.config({
    path: "../.env"
});

connectDB()
    .then(() => {
        console.log("MongoDB connected");
        app.listen(process.env.PORT || 8000, () => {
            console.log(`Server running on port ${process.env.PORT || 8000}`);
        });
    })
    .catch((error) => {
        console.log("MongoDB connection error", error);
        process.exit(1);
    });

// async function connectDB() {
//     try {
//         await mongoose.connect(`${process.env.MONGO_URI}/${DB_NAME}`);
//         console.log("MongoDB connected");
//     } catch (error) {
//         console.log(error);
//     }
// }