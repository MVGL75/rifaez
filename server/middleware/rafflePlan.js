import { User } from "../models/Users.js";
import { v2 as cloudinary } from 'cloudinary';
import plans from "../seed/plans.js";
import AppError from "../utils/AppError.js";

const rafflePlan = (type) => {
  return async (req, res, next) => {
    const user = await User.findById(req.user._id);
    const plan = plans[user?.planId];

    if (!plan) throw new AppError({ message: "Invalid planId" });

    const isActive = req.body.isActive === "true" || req.body.isActive === true;
    const activeRaffleLimit = plan.activeRaffles;

    if (activeRaffleLimit && activeRaffleLimit !== "unlimited") {
      const populatedUser = await user.populate("raffles");
      const activeRaffles = populatedUser.raffles.filter(r => r.isActive);

      let isNotAllowed = false;

      if (type === "create") {
        isNotAllowed = activeRaffles.length >= activeRaffleLimit;
      }

      if (type === "edit") {
        const raffleEdited = populatedUser.raffles.find(r => r._id.toString() === req.params.id);
        if (raffleEdited && raffleEdited.isActive !== isActive && isActive) {
          isNotAllowed = activeRaffles.length >= activeRaffleLimit;
        }
      }

      if (isNotAllowed) {
        const publicIds = req.files?.map(file => file.filename) || [];
        for (const public_id of publicIds) {
          await cloudinary.uploader.destroy(public_id);
        }

        return res.status(403).json({
          message: "Has alcanzado tu límite de rifas activas. Mejora tu plan para crear más o desactiva otra rifa.",
          status: 403,
        });
      }
    }

    if (!plan.templates.includes(req.body.template)) {
      req.body.template = "classic";
    }

    req.session.redirectAfterPayment = undefined;
    next();
  };
};

export default rafflePlan;
