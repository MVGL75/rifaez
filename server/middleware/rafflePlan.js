import { User } from "../models/Users.js"
import plans from "../seed/plans.js"
import AppError from "../utils/AppError.js";
const rafflePlan = async (req, res, next) => {
    const user = await User.findById(req.user._id)
    const activePermission = plans[user?.planId]?.permissions?.find(perm => perm.split(":")[0] === "active_raffles");
    if (activePermission) {
        const amount = activePermission.split(":")[1]
        if(amount !== "unlimited"){
            const amountNum = Number(amount);
      
            const userWithRaffles = await user.populate('raffles');
            const activeRaffles = userWithRaffles.raffles?.filter(r => r.isActive);
            const extraActiveRaffle = (req.body.isActive === false) ? 0 : 1;
            if (activeRaffles?.length >= amountNum) {
              const diff = activeRaffles.length - amountNum + extraActiveRaffle;
          
              for (let i = 0; i < diff; i++) {
                activeRaffles[i].isActive = false;
                await activeRaffles[i].save();
              }
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