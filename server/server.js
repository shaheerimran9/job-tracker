require('dotenv').config();
const app = require('./app');
const connectDB = require('./config/db');

const PORT = process.env.PORT || 5000

const startServer = async() => {
    try {
        await connectDB(process.env.MONGO_URI);
        app.listen(PORT, () => console.log(`Sever running on PORT ${PORT}`))
    } catch (err) {
        console.log(err);
        process.exit(1);
    }
};

startServer();


