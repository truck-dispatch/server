import mongoose, { ConnectOptions } from 'mongoose';
import { MONGO_DB_URL } from '../common/privateKeys';

const options: ConnectOptions = {
    // useNewUrlParser: true,
    // useUnifiedTopology: true,
};
mongoose.connect(MONGO_DB_URL, options).then(() => {
    console.log("database connected successfully")
});
