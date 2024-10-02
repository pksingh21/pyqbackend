import * as requestDTO from './schema';

const userValidator = {
  // Create a user
  createUser: {
    body: requestDTO.CreateUserDTO,
  },
  // Get a single user by ID (route param)
  getUser: {
    params: requestDTO.GetUserParamsDTO,
  },
  // Update user profile (auth user)
  updateProfile: {
    body: requestDTO.UpdateProfileBodyDTO,
  },
  // Update a user by ID (admin)
  updateUser: {
    params: requestDTO.UpdateUserParamsDTO,
    body: requestDTO.UpdateUserBodyDTO,
  },
  // Delete a user by ID (admin)
  deleteUser: {
    params: requestDTO.DeleteUserParamsDTO,
  },
  // Update user's tags (auth user or admin)
  updateTagsForUser: {
    params: requestDTO.UpdateUserParamsDTO,
    body: requestDTO.UpdateUserTagsDTO,
  },
};

export default userValidator;
