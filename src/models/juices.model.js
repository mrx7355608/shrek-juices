import mongoose from "mongoose";

const juiceSchema = new mongoose.Schema({
  name: String,
  imageURL: String,
  description: String,
  price: String,
  type: String,
});

const JuiceModel = mongoose.model("Juices", juiceSchema);
export default JuiceModel;
