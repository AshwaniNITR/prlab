import mongoose, { Document, Schema } from "mongoose";

export interface Patent extends Document {
    title: string;
    Applno?: string;
    Status?: string;
    Inventors?: string;
    FilingDate?: Date;
    GrantDate?: Date;
}

const PatentSchema: Schema<Patent> = new Schema({
    title:{
        type: String,
        index: true,
        trim: true
    },
    Applno:{
        type:String,
        trim:true,
        unique:true
    },
    Status:{
        type:String,
        enum:['Granted' , 'Pending' , 'First Evaluation Report Submitted']
    },
    Inventors:{
        type:String,
        trim:true
    },
    FilingDate:{
        type:Date
    },
    GrantDate:{
        type:Date
    }
})

const PatentModel = (mongoose.models.Patent as mongoose.Model<Patent>) || mongoose.model<Patent>("Patent", PatentSchema)

export default PatentModel