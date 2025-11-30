import mongoose, { Document, Schema } from "mongoose";

export interface Journal extends Document {
    title: string;
    author?: string;
    journal?: string;
    year?: number;
    volume?: string;
    issue?: string;
    pages?: string;
    type?: string;
    status?: string;
}

const JournalSchema: Schema<Journal> = new Schema({
    title: {
        type: String,
        index: true,
        trim: true
    },
    author: {
        type: String,
        trim: true,
        index: true
    },
    journal: {
        type: String,
        trim: true,
        index: true
    },
    year: {
        type: Number,
        index: true
    },
    volume: {
        type: String
    },
    issue: {
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

const JournalModel = (mongoose.models.Journal as mongoose.Model<Journal>) || mongoose.model("Journal", JournalSchema)

export default JournalModel