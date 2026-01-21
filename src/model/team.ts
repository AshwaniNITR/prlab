import mongoose, { Document, Schema } from "mongoose";

export interface Team extends Document {
    name: string;
    image: string;
    designation: string;
    enrolledDate: Date;
    graduatedDate?: Date;
    Description: String;
}

const TeamSchema: Schema<Team> = new Schema(
    {
        name: {
            type: String,
            index: true,
            trim: true
        },
        image: {
            type: String,
            index: true,
            trim: true
        },
        designation: {
            type: String,
            index: true,
            trim: true,
            enum:["B.Tech","M.Tech","Ph.D","Assistant Professor","Associate Professor","Professor","HOD"]
        },
        enrolledDate: {
            type: Date,
            index: true,
            trim: true
        },
        graduatedDate: {
            type: Date,
            index: true,
            trim: true
        },
        Description: {
            type: String,
            index: true,
            trim: true
        },
    },
    {
        timestamps:true
    }
)

const TeamModel =(mongoose.models.Team as mongoose.Model<Team>) || mongoose.model<Team>("Team", TeamSchema);

export default TeamModel;