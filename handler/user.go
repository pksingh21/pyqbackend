package handlers

import (
    "github.com/pksingh21/pyqbackend/config"
    "github.com/pksingh21/pyqbackend/entity"
    "github.com/gofiber/fiber/v2"
    "time"
)

//{
// "phoneNumber": "1234567890", // Phone number (string)
// "name": "John Doe", // User's name
// "email": "johndoe@example.com", // User's email address
// "joinedDate": "2024-07-16T00:00:00Z", // ISO 8601 formatted date and time
// "exams": ["AIIMS", "Exam2", "Exam3"], // Array of exams interested in
// "otp": "123456", // OTP code (string)
// "otpVerified": true // OTP verification status (boolean)
//   }
// CreateUser creates a new user
func CreateUser(c *fiber.Ctx) error {
    user := new(entities.User)

    if err := c.BodyParser(user); err != nil {
        return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": err.Error()})
    }

    // Set default values
    user.JoinedDate = time.Now()

    config.Database.Create(&user)
    return c.Status(fiber.StatusCreated).JSON(user)
}

// GetUser retrieves a user by ID
func GetUser(c *fiber.Ctx) error {
    id := c.Params("id")
    var user entities.User

    if err := config.Database.First(&user, id).Error; err != nil {
        return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "User not found"})
    }

    return c.Status(fiber.StatusOK).JSON(user)
}

// UpdateUser updates a user by ID
func UpdateUser(c *fiber.Ctx) error {
    id := c.Params("id")
    var user entities.User

    if err := config.Database.First(&user, id).Error; err != nil {
        return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "User not found"})
    }

    updatedUser := new(entities.User)
    if err := c.BodyParser(updatedUser); err != nil {
        return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": err.Error()})
    }

    // Update specific fields
    user.Name = updatedUser.Name
    user.Email = updatedUser.Email
    user.Exams = updatedUser.Exams
    user.OTP = updatedUser.OTP
    user.OtpVerified = updatedUser.OtpVerified

    config.Database.Save(&user)
    return c.Status(fiber.StatusOK).JSON(user)
}

// DeleteUser deletes a user by ID
func DeleteUser(c *fiber.Ctx) error {
    id := c.Params("id")
    var user entities.User

    if err := config.Database.First(&user, id).Error; err != nil {
        return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "User not found"})
    }

    config.Database.Delete(&user)
    return c.SendStatus(fiber.StatusOK)
}

// GetAllUsers retrieves all users
func GetAllUsers(c *fiber.Ctx) error {
    var users []entities.User

    config.Database.Find(&users)
    return c.Status(fiber.StatusOK).JSON(users)
}
