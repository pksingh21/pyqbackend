import Joi from 'joi';

export const UserDTO = Joi.object({
  id: Joi.string().required(),
  uid: Joi.string().required(),
  phoneNumber: Joi.string().required(),
  firstName: Joi.string().allow(null, '').required(),
  lastName: Joi.string().allow(null, '').required(),
  email: Joi.string().allow(null, '').required(),
  lastUpdatedAt: Joi.any().strip(),
  createdAt: Joi.any().strip(),
  password: Joi.any(),
  isAdmin: Joi.boolean().required(),
  isEmailVerified: Joi.boolean(),
});

// Schema for creating a user (body)
export const CreateUserDTO = Joi.object({
  phoneNumber: Joi.string().required(),
  firstName: Joi.string().optional().allow(null, ''),
  lastName: Joi.string().optional().allow(null, ''),
  email: Joi.string().email().optional().allow(null, ''),
  password: Joi.string().min(8).required(),
});

// Schema for getting a user by ID (route param)
export const GetUserParamsDTO = Joi.object({
  id: Joi.string().uuid().required(),
});

export const UpdateProfileBodyDTO = Joi.object({
  user: UserDTO.required(),
});

// Schema for updating a user (body)
export const UpdateUserParamsDTO = Joi.object({
  id: Joi.string().uuid().required(),
});

export const UpdateUserBodyDTO = Joi.object({
  phoneNumber: Joi.string().optional(),
  firstName: Joi.string().optional().allow(null, ''),
  lastName: Joi.string().optional().allow(null, ''),
  email: Joi.string().email().optional().allow(null, ''),
  password: Joi.string().min(8).optional(),
});

// Schema for updating user tags (body)
export const UpdateUserTagsDTO = Joi.object({
  tagIds: Joi.array().items(Joi.string().uuid()).min(1).optional(),
});

// Schema for deleting a user by ID (route param)
export const DeleteUserParamsDTO = Joi.object({
  id: Joi.string().uuid().required(),
});
