import Joi from 'joi';

export const registerSchema = Joi.object({
  name: Joi.string().required().messages({
    'string.empty': 'Name is required',
  }),

  email: Joi.string()
    .email({ tlds: { allow: false } }) // disable TLD check for flexibility
    .required()
    .messages({
      'string.empty': 'Email is required',
      'string.email': 'Must be a valid email address',
    }),

  password: Joi.string()
    .min(8)
    .pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).+$')) // at least one lowercase, one uppercase, and one number
    .required()
    .messages({
      'string.empty': 'Password is required',
      'string.min': 'Password must be at least 8 characters',
      'string.pattern.base': 'Password must include uppercase, lowercase, and a number',
    }),
});

export const workerSchema = Joi.object({
  _id: Joi.any().optional(), // allow it, or Joi.string().optional()
  email: Joi.string().email({ tlds: { allow: false } }).required(),
  password: Joi.string()
      .min(8)
      .pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).+$')) // at least one lowercase, one uppercase, and one number
      .required()
      .messages({
      'string.empty': 'Se requiere la contraseña',
      'string.min': 'La contraseña debe tener al menos 8 caracteres',
      'string.pattern.base': 'La contraseña debe incluir mayúsculas, minúsculas y un número',
  }),
  role: Joi.string().valid('editor', 'admin', 'viewer').optional()
})

export const saveSchema = Joi.object({
  name: Joi.string().optional(),
  email: Joi.string()
    .email({ tlds: { allow: false } }) // disable TLD check for flexibility
    .required()
    .messages({
      'string.empty': 'Email is required',
      'string.email': 'Must be a valid email address',
  }),
  companyName: Joi.string().optional(),

  logo: Joi.string().uri().allow(null, '').optional(),

  workers: Joi.array().items(workerSchema).optional(),

  currentPlan: Joi.string().valid('basic', 'premium', 'pro').optional(), 

  facebook: Joi.string().uri().allow('', null).optional(),

  phone: Joi.string().required()
      .pattern(/^[0-9]{10}$/)
      .messages({
      'string.base': 'El teléfono debe ser un texto.',
      'string.empty': 'El teléfono es obligatorio.',
      'string.pattern.base': 'El teléfono debe tener 10 dígitos numéricos',
      'any.required': 'El teléfono es obligatorio.'
  }),

  // Do NOT allow updating 'raffles' from this route to prevent injection
});

