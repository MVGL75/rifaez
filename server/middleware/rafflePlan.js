import { User } from "../models/Users.js"
import { v2 as cloudinary } from 'cloudinary';
import plans from "../seed/plans.js"
import AppError from "../utils/AppError.js";
const rafflePlan = async (req, res, next) => {
    const isActive = JSON.parse(req.body.isActive);
    const user = await User.findById(req.user._id)
    const activeRaffleAmount = plans[user?.planId].activeRaffles;
    if (activeRaffleAmount) {
        if(activeRaffleAmount !== "unlimited"){
            const userRaffles = await user.populate("raffles");
            const activeRaffles = userRaffles.raffles.filter(r => r.isActive);
            const notAllowed = activeRaffles.length >= activeRaffleAmount;
            if(isActive && notAllowed){
                const publicIds = req.files?.map(file => file.filename) || [];
                for (const public_id of publicIds) {
                    await cloudinary.uploader.destroy(public_id);
                }
                return res.json({message: "Has alcanzado tu límite de rifas activas. Mejora tu plan para crear más o desactiva otra rifa.", status: 808})
            }
        }
        if(!plans[user.planId].templates.includes(req.body.template)){
            req.body.template = "classic";
        }
        req.session.redirectAfterPayment = undefined;
        return next();
    } else {
        throw new AppError({message: "invalid planId"})
    }
      
}


export default rafflePlan