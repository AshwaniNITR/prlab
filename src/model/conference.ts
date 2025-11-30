import mongoose, { Document, Schema } from "mongoose";

export interface Conference extends Document {
    title: string;
    authors?: string;
    conference?: string;
    year?: number;
    month?: string;
    pages?: string;
    location?: string;
    type?: string;
    status?: string;
}

const ConferenceSchema: Schema<Conference> = new Schema({
    
    title: {
        type: String,
        index: true,
        trim: true
    },
    authors: {
        type: String,
        trim: true,
        index: true
    },
    conference: {
        type: String,
        trim: true,
        index: true
    },
    year: {
        type: Number,
        index: true
    },
    month: {
        type: String
    },
    location: {
        tyope: String
    },
    pages: {
        type: String
    },
    type: {
        type: String
    },
    status: {
        type: String
    }
})

const ConferenceModel = (mongoose.models.Conference as mongoose.Model<Conference>) || mongoose.model("Conference", ConferenceSchema)

export default ConferenceModel