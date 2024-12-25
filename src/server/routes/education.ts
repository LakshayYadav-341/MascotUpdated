import EducationHandler from "../../handlers/user/education";
import { verifyBody, verifyToken } from "../../server/middleware/verify";
import Education from "../../server/models/user/education";
import Profile from "../../server/models/user/profile";
import { getValue } from "../../utils/object";
import { Router } from "express";

const app = Router();
const handler = new EducationHandler();

/**
 * @swagger
 * /education/create:
 *   post:
 *     summary: Create an education record
 *     description: Endpoint to create a new education record
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               institute:
 *                 type: string
 *               type:
 *                 type: string
 *               joined:
 *                 type: string
 *                 format: date
 *               completion:
 *                 type: object
 *                 properties:
 *                   isCurrent:
 *                     type: boolean
 *               remarks:
 *                 type: string
 *     responses:
 *       '200':
 *         description: Education record created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Profile'
 *       '401':
 *         description: Unauthorized access
 *       '404':
 *         description: Failed to create education record or profile not found
 */

app.post(
    "/create",
    verifyToken(),
    verifyBody(["institute", "type", "joined", "completion.isCurrent", ]),
    async (_, res) => {
        const { keys, values, session } = res.locals;
        const profile = await Profile.findById(session.user?.profile)
        if(!profile) {
            return res.status(404).send(handler.error("Profile not found! Please create your profile first"))
        }
        const education = await Education.create({
            institute: getValue(keys, values, "institute"),
            type: getValue(keys, values, "type"),
            joined: getValue(keys, values, "joined"),
            completion: {
                isCurrent: getValue(keys, values, "completion.isCurrent")
            },
            remarks: getValue(keys, values, "remarks")
        });
        if (!education)      
            return res.status(404).json(handler.error(handler.STATUS_404));
        profile.set("education", [...profile.education, education])
        const updatedProfile = await profile.save()
        if(!updatedProfile) {
            return res.status(404).json(handler.error(handler.STATUS_404));
        }
        return res.status(200).json(handler.success(updatedProfile))
        
    }
);


export default app;