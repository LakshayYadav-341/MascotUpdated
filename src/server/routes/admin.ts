import AdminHandler from "../../handlers/user/admin";
import { verifyAdmin, verifyParams, verifyToken } from "../../server/middleware/verify";
import Institute from "../../server/models/institute";
import User from "../../server/models/user";
import ConnectionRequest from "../../server/models/user/connection-request";
import IUser, { ProfileRoles } from "../../types_/user";
import { ConnectionTypes } from "../../types_/user/connection-request";
import { getValue } from "../../utils/object";
import { Router } from "express";

const app = Router();
const handler = new AdminHandler();

app.put(
  "/connection-request/:request/:status",
  verifyToken(),
  verifyAdmin(),
  verifyParams(["request", "status"]),
  async (_, res) => {
    try {
      const { keys, values } = res.locals;

      const status = getValue(keys, values, "status") as string;
      if (!["reject", "accept"].includes(status)) {
        return res
          .status(400)
          .json(handler.error(handler.fieldInvalid("status", "The value can be either 'accept' or 'reject'.")));
      }

      const requestId = getValue(keys, values, "request");
      const connectionRequest = await ConnectionRequest.findByIdAndDelete(requestId);

      if (!connectionRequest) {
        return res
          .status(404)
          .json(handler.error("Connection Request not found. Please provide a valid request ID."));
      }

      if (status === "reject") {
        return res
          .status(200)
          .json(handler.success({ request: connectionRequest, message: "Successfully rejected the request." }));
      }

      const user = await User.findById(connectionRequest.from);

      if (!user) {
        return res.status(404).json(handler.error("User not found for the provided request."));
      }

      user.role = ProfileRoles.alumni;
      const updatedUser = await user.save();

      if (!updatedUser) {
        return res.status(500).json(handler.error("Failed to update the user role."));
      }

      return res
        .status(200)
        .json(handler.success({ user: updatedUser, message: "Updated the user from student to alumni." }));
    } catch (error) {
      console.error("Error processing connection request:", error);
      return res
        .status(500)
        .json(handler.error("An unexpected error occurred while processing the connection request."));
    }
  }
);

app.get("/alumni-requests", verifyToken(), verifyAdmin(), async (_, res) => {
  try {
    const { session } = res.locals;
    const userId = (session.user as IUser)._id;

    const connectionRequests =
      (await ConnectionRequest.find({ type: ConnectionTypes.alumniRequest, to: userId })
        .populate({
          path: "from",
          select: "-password",
        })
        .exec()) || [];

    return res.status(200).json(handler.success(connectionRequests));
  } catch (error) {
    console.error("Error retrieving alumni requests:", error);
    return res
      .status(500)
      .json(handler.error("An unexpected error occurred while retrieving alumni connection requests."));
  }
});

app.get("/institutes", verifyToken(), async (_, res) => {
  try {
    const institutes = await Institute.find({ admin: { $exists: true } }).populate({
      path: "admin",
      populate: {
        path: "admin",
        select: {
          role: "institute",
        },
      },
    });

    if (!institutes) {
      return res.status(404).json(handler.error("No institutes found with associated admins."));
    }

    return res.status(200).json(handler.success(institutes));
  } catch (error) {
    console.error("Error retrieving institutes:", error);
    return res
      .status(500)
      .json(handler.error("An unexpected error occurred while retrieving institutes."));
  }
});

export default app;
