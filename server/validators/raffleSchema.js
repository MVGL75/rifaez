import Joi from 'joi';

const isoDateAfterToday = (value, helpers) => {
    const today = new Date().toISOString().split('T')[0]; 
    if (new Date(value) <= new Date(today)) {
      return helpers.error('any.invalid');
    }
    return value; 
};

const colors = ['red', 'blue', 'yellow', 'green', 'purple', 'white', 'black']

export const methodSchema = Joi.object({
  bank: Joi.string().required(),
  person: Joi.string().required(),
  number: Joi.string()
    .pattern(/^\d{16}$/)
    .required()
    .messages({
      'string.pattern.base': 'Card number must be exactly 16 digits.',
      'string.empty': 'Card number is required.',
    }),
  clabe: Joi.string()
    .pattern(/^\d{18}$/)
    .required()
    .messages({
      'string.pattern.base': 'Cuenta clabe must be exactly 18 digits.',
      'string.empty': 'Cuenta clabe is required.',
    }),
  instructions: Joi.string().optional(),
});


const fonts = [
  "Inter",
  "Roboto",
  "Open Sans",
  "Manrope",
  "IBM Plex Sans",
  "Work Sans",
  "Source Sans 3",
  "Noto Sans",
  "Lato",
  "DM Sans"
];



export const raffleValidationSchema = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().required(),
  price: Joi.number().greater(0).required(),
  logo: Joi.object({
    url: Joi.string().required(),  
    public_id: Joi.string().required()   
  }).optional(),
  phone: Joi.string().optional()
      .pattern(/^[0-9]{10}$/)
      .messages({
      'string.base': 'El teléfono debe ser un texto.',
      'string.empty': 'El teléfono es obligatorio.',
      'string.pattern.base': 'El teléfono debe tener 10 dígitos numéricos',
      'any.required': 'El teléfono es obligatorio.'
  }),
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
    template: Joi.string().valid('classic', 'modern', 'minimalist').required(),
    colorPalette: Joi.object({
      header: Joi.string().valid(...colors).required(),
      background: Joi.string().valid(...colors).required(),
      accent: Joi.string().valid(...colors).required(),
      borders: Joi.string().valid(...colors).required(),
      color: Joi.string().valid(...colors).required(),
    }).required(),
    font: Joi.string().valid(...fonts).required(),
    logo_position: Joi.string().valid('left', 'center', 'right').required(),
    header: Joi.string().valid('on', 'off').required(),
    countdown: Joi.string().valid('on', 'off').required(),
    // nightMode: Joi.boolean().required(),
    // maxTpT: Joi.number().required(),
    timeLimitPay: Joi.number().required(),
    paymentMethods: Joi.array().items(methodSchema.required()).max(3).required(),
    endDate: Joi.string()
        .isoDate()
        .custom(isoDateAfterToday, 'Date must be after today') 
        .default("12-12-25"),
    extraInfo: Joi.string().max(500).allow('').optional(),

});