package handlers

import (
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/pksingh21/pyqbackend/config"
	"github.com/pksingh21/pyqbackend/entity"
	"gorm.io/gorm"
)

// CreateUser godoc
// @Summary Create a new user
// @Description Create a new user with provided details
// @Tags users
// @Accept application/json
// @Produce application/json
// @Param user body entity.User true "User data"
// @Success 201 {object} entity.User
// @Failure 400 {object} fiber.Map
// @Failure 500 {object} fiber.Map
// @Router /users [post]
func CreateUser(c *fiber.Ctx) error {
	user := new(entities.User)

	if err := c.BodyParser(user); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid input", "message": err.Error()})
	}

	// Set default values
	user.JoinedDate = time.Now()

	if err := config.Database.Create(&user).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to create user", "message": err.Error()})
	}

	return c.Status(fiber.StatusCreated).JSON(user)
}

// GetUser godoc
// @Summary Get a user by ID
// @Description Retrieve a user by their ID
// @Tags users
// @Produce application/json
// @Param id path int true "User ID"
// @Success 200 {object} entity.User
// @Failure 404 {object} fiber.Map
// @Failure 500 {object} fiber.Map
// @Router /users/{id} [get]
func GetUser(c *fiber.Ctx) error {
	id := c.Params("id")
	var user entities.User

	if err := config.Database.First(&user, id).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "User not found"})
		}
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Database error", "message": err.Error()})
	}

	return c.Status(fiber.StatusOK).JSON(user)
}

// UpdateUser godoc
// @Summary Update a user by ID
// @Description Update an existing user by their ID
// @Tags users
// @Accept application/json
// @Produce application/json
// @Param id path int true "User ID"
// @Param user body entity.User true "Updated user data"
// @Success 200 {object} entity.User
// @Failure 400 {object} fiber.Map
// @Failure 404 {object} fiber.Map
// @Failure 500 {object} fiber.Map
// @Router /users/{id} [put]
func UpdateUser(c *fiber.Ctx) error {
	id := c.Params("id")
	var user entities.User

	if err := config.Database.First(&user, id).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "User not found"})
		}
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Database error", "message": err.Error()})
	}

	updatedUser := new(entities.User)
	if err := c.BodyParser(updatedUser); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid input", "message": err.Error()})
	}

	// Update specific fields
	user.Name = updatedUser.Name
	user.Email = updatedUser.Email
	user.Exams = updatedUser.Exams
	user.OTP = updatedUser.OTP
	user.OtpVerified = updatedUser.OtpVerified

	if err := config.Database.Save(&user).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to update user", "message": err.Error()})
	}

	return c.Status(fiber.StatusOK).JSON(user)
}

// DeleteUser godoc
// @Summary Delete a user by ID
// @Description Delete a user by their ID
// @Tags users
// @Produce application/json
// @Param id path int true "User ID"
// @Success 200 {string} string "OK"
// @Failure 404 {object} fiber.Map
// @Failure 500 {object} fiber.Map
// @Router /users/{id} [delete]
func DeleteUser(c *fiber.Ctx) error {
	id := c.Params("id")
	var user entities.User

	if err := config.Database.First(&user, id).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "User not found"})
		}
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Database error", "message": err.Error()})
	}

	if err := config.Database.Delete(&user).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to delete user", "message": err.Error()})
	}

	return c.SendStatus(fiber.StatusOK)
}

// GetAllUsers godoc
// @Summary Get all users
// @Description Retrieve all users
// @Tags users
// @Produce application/json
// @Success 200 {array} entity.User
// @Failure 500 {object} fiber.Map
// @Router /users [get]
func GetAllUsers(c *fiber.Ctx) error {
	var users []entities.User

	if err := config.Database.Find(&users).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Database error", "message": err.Error()})
	}

	return c.Status(fiber.StatusOK).JSON(users)
}
