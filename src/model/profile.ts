import mongoose, { Document, Schema } from "mongoose";

export interface IProfile extends Document {
  id: number;
  content: string[];         
}

const ProfileSchema: Schema<IProfile> = new Schema({
  id: {
    type: Number,
    required: true,
    unique: true,
  },
  content: {
    type: [String],
    required: true,
  },
});

const ProfileModel =
  (mongoose.models.Profile as mongoose.Model<IProfile>) ||
  mongoose.model("Profile", ProfileSchema);

export default ProfileModel;