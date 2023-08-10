require('dotenv').config();
import mongoose ,{ConnectOptions} from 'mongoose';

async function connectDB(){
    try{
        const url:string = process.env.DATABASE_URL!;
        await mongoose.connect(url, {
        });
        console.log("Connected to MongoDB Atlas");
    } catch(error){
        console.error('Failed to connect to MongoDB Atlas', error);
        process.exit(1);
    }
}

export default connectDB;
