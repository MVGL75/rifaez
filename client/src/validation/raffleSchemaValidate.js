import Joi from 'joi';

const isoDateAfterToday = (value, helpers) => {
    const today = new Date().toISOString().split('T')[0]; 
    if (new Date(value) <= new Date(today)) {
      return helpers.error('any.invalid');
    }
    return value; 
};
function getDate30DaysFromNow() {
  const today = new Date(); // Get the current date
  today.setDate(today.getDate() + 30); // Add 30 days to the current date
  return today.toISOString(); // Convert the updated date to ISO format
}
const colors = ['red', 'blue', 'yellow', 'green', 'purple']

export const methodSchema = Joi.object({
  _id: Joi.string().optional(),
  id: Joi.string().optional(),
  enabled: Joi.optional(),
  bank: Joi.string().required(),
  person: Joi.string().required(),
  number: Joi.string()
    .pattern(/^\d{16}$/)
    .required()
    .messages({
      'string.pattern.base': 'Card number must be exactly 16 digits.',
      'string.empty': 'Card number is required.',
    }),
});

export const raffleValidationSchema = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().required(),
  price: Joi.number().greater(0).required(),
  maxParticipants: Joi.number().greater(0).required(),
 isActive: Joi.boolean().default(true),
    participants: Joi.string().optional(),      
    additionalPrizes: Joi.array().items(
        Joi.object({
        place: Joi.number().required(),  
        prize: Joi.string().required()   
        })
    ).default([]),
    template: Joi.string().valid('classic', 'modern', 'minimalist').required(),
    colorPalette: Joi.string().valid(...colors).required(),
    font: Joi.string().valid('xs', 's', 'm', 'l', 'xl').required(),
    logo_position: Joi.string().valid('left', 'center', 'right').required(),
    header: Joi.string().valid('on', 'off').required(),
    nightMode: Joi.boolean().required(),
    maxTpT: Joi.number().greater(0).required(),
    timeLimitPay: Joi.number().greater(0).required(),
    fileCounter: Joi.number().greater(0).required(),
    paymentMethods: Joi.array().items(methodSchema.required()).max(3).required(),
    
    payment_instructions: Joi.string().when('paymentMethods', {
      is: Joi.array().has('custom'),
      then: Joi.required(), // Make it required if "custom" is in paymentMethods
      otherwise: Joi.optional() 
    }),
    endDate: Joi.string()
        .isoDate()
        .custom(isoDateAfterToday, 'Date must be after today') 
        .default(getDate30DaysFromNow()),
    extraInfo: Joi.string().max(500).optional(),

});