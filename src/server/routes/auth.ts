import UserHandler from "../../handlers/user";
import { JWT_SECRET, JWT_SESSION_TIMEOUT } from "../../server/config";
import {
    verifyBody,
    verifyToken,
    verifyParams,
} from "../../server/middleware/verify";
import User from "../../server/models/user";
import Admin from "../../server/models/user/admin";
import Session from "../../server/models/user/session";
import IUser, { ProfileRoles } from "../../types_/user";
import { downloadFile } from "../../utils/file";
import Hash from "../../utils/hash";
import { getValue } from "../../utils/object";
import { Router } from "express";
import jwt from "jsonwebtoken";
import { MongooseError } from "mongoose";
import Multer from "multer";

const app = Router();
const multer = Multer();

const handler = new UserHandler();

const registerFields = [
    "name.first",
    "name.last",
    "dob",
    "email",
    "phone",
    "password",
    "role",
];

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: User registration
 *     description: Register a new user.
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: object
 *                 properties:
 *                   first:
 *                     type: string
 *                   last:
 *                     type: string
 *               dob:
 *                 type: string
 *                 format: date
 *               email:
 *                 type: string
 *                 format: email
 *               phone:
 *                 type: string
 *               password:
 *                 type: string
 *               role:
 *                 type: string
 *     responses:
 *       '200':
 *         description: User registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserSession'
 *       '401':
 *         description: Error occurred during registration
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *     security: []
 * components:
 *   schemas:
 *     UserSession:
 *       type: object
 *       properties:
 *         user:
 *           type: string
 *           description: The unique identifier of the registered user.
 *         token:
 *           type: string
 *           description: JWT token for the registered user's session.
 *     Error:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           description: Description of the error occurred during registration.
 */

app.post(
    "/register",
    multer.single("profilePhoto"),
    verifyBody(registerFields, handler),
    async (req, res) => {
        const { keys, values } = res.locals;

        // Create a new user instance
        let user = new User({
            name: {
                first: getValue(keys, values, "name.first"),
                last: getValue(keys, values, "name.last"),
            },
            dob: getValue(keys, values, "dob"),
            email: getValue(keys, values, "email"),
            phone: getValue(keys, values, "phone"),
            password: getValue(keys, values, "password") as string,
            role:
                getValue(keys, values, "role") === "institute"
                    ? ProfileRoles.admin
                    : getValue(keys, values, "role"),
            ...(keys.includes("bio") &&
                getValue(keys, values, "bio").length && {
                    bio: getValue(keys, values, "bio"),
                }),
        } as IUser);

        try {
            // Validate the user object
            await user.validate();

            // Handle profile photo upload if provided
            if (req.file && ["image/png", "image/jpeg"].includes(req.file.mimetype)) {
                const file = req.file;
                const profilePhoto = await downloadFile(
                    "profilePhoto." + file.originalname.split(".").pop(),
                    user._id.toString(),
                    file.buffer
                );
                if (profilePhoto) {
                    user.profilePhoto = profilePhoto;
                }
            }

            // Create an admin record if the role is "institute"
            let admin = null;
            if (getValue(keys, values, "role") === "institute") {
                admin = await Admin.create({
                    role: getValue(keys, values, "role"),
                    createdBy: "656de3f2bdcaade9d49d0f4b", // Example user ID
                });

                if (!admin) {
                    return res.status(404).send(handler.error(handler.STATUS_404));
                }

                // Associate the admin ID with the user
                user.set("admin", admin._id);
            }

            // Save the user
            user = await user.save();

            // Generate a JWT token
            const token = jwt.sign(
                {
                    user: user._id.toString(),
                    createdAt: Date.now(),
                },
                JWT_SECRET,
                { expiresIn: JWT_SESSION_TIMEOUT }
            );

            // Create a session
            const session = await Session.create({ user: user._id, token });

            // Re-fetch the user using `lean` for the final session payload
            const populatedUser = await User.findById(user._id).populate("admin").lean<IUser>();
            if (!populatedUser) {
                throw new Error("User not found after saving.");
            }

            session.user = populatedUser;

            return res.status(200).send(handler.success(session));
        } catch (err: MongooseError | any) {
            return res.status(401).send(handler.error(err.message));
        }
    }
);


/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: User login
 *     description: Login with email and password to authenticate user.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       '200':
 *         description: Successful login. Returns a session token.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/definitions/Session'
 *       '401':
 *         description: Unauthorized. Incorrect email or password.
 *       '404':
 *         description: User not found.
 *       '500':
 *         description: Internal Server Error.
 *     examples:
 *       example1:
 *         summary: Example of login request body
 *         value:
 *           email: example@example.com
 *           password: password123
 * definitions:
 *   Session:
 *     type: object
 *     properties:
 *       _id:
 *         type: string
 *       user:
 *         $ref: '#/definitions/User'
 *       token:
 *         type: string
 *       createdAt:
 *         type: string
 *         format: date-time
 *   User:
 *     type: object
 *
 */

app.post(
    "/login",
    verifyBody(["email", "password"], handler),
    async (_, res) => {
        const { keys, values } = res.locals;
        const user = await User.findOne({ email: getValue(keys, values, "email") }).populate("admin").lean<IUser>();
        if (!user) {
            return res.status(404).send(handler.error(handler.STATUS_404));
        }
        console.log(
            getValue(keys, values, "password") as string,
            user.password
        );
        if (
            !Hash.simpleCompare(
                getValue(keys, values, "password") as string,
                user.password
            )
        ) {
            return res
                .status(401)
                .send(handler.error("Incorrect password, try again."));
        }
        const token = jwt.sign(
            {
                user: user._id.toString(),
                createdAt: Date.now(),
            },
            JWT_SECRET,
            { expiresIn: JWT_SESSION_TIMEOUT }
        );
        const session = await Session.create({ user: user._id, token });
        session.user = user as IUser;
        return res.status(200).send(handler.success(session));
    }
);

app.post("/verify", verifyToken(handler), (_, res) => {
    return res.status(200).send(handler.success(res.locals.session));
});

/**
 * @swagger
 * /api/auth/get-user/{email}:
 *   get:
 *     summary: Get user by email
 *     description: Retrieve user information by email.
 *     parameters:
 *       - in: path
 *         name: email
 *         required: true
 *         schema:
 *           type: string
 *         description: Email address of the user to retrieve.
 *     responses:
 *       '200':
 *         description: User information retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       '404':
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *     security: []
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: The unique identifier of the user.
 *         email:
 *           type: string
 *           format: email
 *           description: The email address of the user.
 *     Error:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           description: Description of the error occurred when user is not found.
 */

app.get("/get-user/:email", verifyParams(["email"]), async (_, res) => {
    const { keys, values } = res.locals;
    const user = await User.findOne({ email: getValue(keys, values, "email") });
    // if (!user) {
    //     return res.status(404).send(handler.error('User not found'));
    // }
    return res.status(200).send(handler.success(user || {}));
});

export default app;
