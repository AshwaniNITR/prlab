import mongoose, { Document, Schema } from "mongoose";
 
export interface AboutUs extends Document {
  id: number;
  missionVision: string;
  coreObjectives: string;
  capabilities: string;
  contributions: string[];
  researchFields: string[];
}
 
const AboutUsSchema: Schema<AboutUs> = new Schema({
  id: {
    type: Number,
    required: true,
    unique: true,
  },
  missionVision: {
    type: String,
    trim: true,
  },
  coreObjectives: {
    type: String,
    trim: true,
  },
  capabilities: {
    type: String,
    trim: true,
  },
  contributions: {
    type: [String],
  },
  researchFields: {
    type: [String],
  },
});
 
const AboutUsModel =
  (mongoose.models.AboutUs as mongoose.Model<AboutUs>) ||
  mongoose.model("AboutUs", AboutUsSchema);
 
export default AboutUsModel;