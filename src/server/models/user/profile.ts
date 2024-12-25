import IProfile from "../../../types_/user/profile";
import { Models } from "../../../utils/models";
import { Schema, model } from "mongoose";


const profileSchema = new Schema<IProfile>({
    education: [{
        type: Schema.Types.ObjectId,
        ref: Models.education,
        default: []
    }],
    achievements: [{
        type: Schema.Types.ObjectId,
        ref: Models.achievement,
        default: []
    }],
    skills: [{
        type: Schema.Types.ObjectId,
        ref: Models.skill,
        default: []
    }],
    address: {
        type: Schema.Types.ObjectId,
        ref: Models.address
    },
    workExperience: [{
        type: Schema.Types.ObjectId,
        ref: Models.work,
        default: []
    }]
})

const Profile = model(Models.profile, profileSchema)
export default Profile