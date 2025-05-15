import Joi from 'joi';

const isoDateAfterToday = (value, helpers) => {
    const today = new Date().toISOString().split('T')[0]; 
    if (new Date(value) <= new Date(today)) {
      return helpers.error('any.invalid');
    }
    return value; 
};

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
    images: Joi.array().items( Joi.object({
      url: Joi.string().required(),  
      public_id: Joi.string().required()   
    })).required(),
    colorPalette: Joi.string().valid('blue', 'green', 'purple').required(),
    font: Joi.string().valid('xs', 's', 'm', 'l', 'xl').required(),
    logo_position: Joi.string().valid('left', 'center', 'right').required(),
    header: Joi.string().valid('on', 'off').required(),
    nightMode: Joi.boolean().required(),
    maxTpT: Joi.number().required(),
    timeLimitPay: Joi.number().required(),
    paymentMethods: Joi.array().items(Joi.string().valid('stripe', 'paypal', 'custom').required()).required(),
    payment_instructions: Joi.string().when('paymentMethods', {
      is: Joi.array().items(Joi.string().valid('custom')).required(),
      then: Joi.required(), // Make it required if "custom" is in paymentMethods
      otherwise: Joi.optional() 
    }),
    endDate: Joi.string()
        .isoDate()
        .custom(isoDateAfterToday, 'Date must be after today') 
        .default("12-12-25"),
    extraInfo: Joi.string().max(500).optional(),

});