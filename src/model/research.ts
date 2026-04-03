import mongoose, { Document, Schema } from "mongoose";

export interface Research extends Document {
    title: string;
    image: string;
    description: string;
}

const ResearchSchema: Schema<Research> = new Schema(
    {
        title: {
            type: String,
            index: true,
            required: true
        },
        image: {
            type: String,
            required:true
        },
        description: {
            type: String,
            required:true
        },
    },
    {
        timestamps:true
    }
)

const ResearchModel =(mongoose.models.Research as mongoose.Model<Research>) || mongoose.model<Research>("Research", ResearchSchema);

export default ResearchModel;