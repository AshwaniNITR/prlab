import mongoose, { Document, Schema } from "mongoose";

export interface Event extends Document {
    title: string;
    description: string;
    date: Date;
    time: string;
    location: string;
    image: string;
}

const EventSchema: Schema<Event> = new Schema(
    {
        title: {
            type: String,
            required: true
        },
        description: {
            type: String,
            required: true
        },
        date: {
            type: Date,
            required: true
        },
        time: {
            type: String,
            required: true
        },
        location: {
            type: String,
            required: true
        },
        image: {
            type: String,
            required: true
        }
    },
    {
        timestamps: true
    }
)

const EventModel = (mongoose.models.Event as mongoose.Model<Event>) || mongoose.model<Event>("Event", EventSchema);

export default EventModel;