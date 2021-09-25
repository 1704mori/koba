import mongoose, { Mongoose } from "mongoose";

class DatabaseService {
  private connection: Mongoose;

  public async initialize() {
    console.log("init database");
    this.connection = await mongoose.connect(process.env.MONGO_DNS, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  }

  public getConnection() {
    return this.connection;
  }
}

export default DatabaseService;
