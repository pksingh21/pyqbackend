package handlers

import (
	"github.com/gofiber/fiber/v2"
	"github.com/pksingh21/pyqbackend/config"
	entities "github.com/pksingh21/pyqbackend/entity"
)

// CreateOption godoc
// @Summary Create a new option
// @Description Create a new option with provided details
// @Tags options
// @Accept application/json
// @Produce application/json
// @Param option body entities.Option true "Option data"
// @Success 201 {object} entities.Option
// @Failure 400
// @Router /options [post]
func CreateOption(c *fiber.Ctx) error {
	option := new(entities.Option)

	if err := c.BodyParser(option); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": err.Error()})
	}

	config.Database.Create(&option)
	return c.Status(fiber.StatusCreated).JSON(option)
}

// GetOption godoc
// @Summary Get an option by ID
// @Description Retrieve an option by its ID
// @Tags options
// @Produce application/json
// @Param id path int true "Option ID"
// @Success 200 {object} entities.Option
// @Failure 404
// @Router /options/{id} [get]
func GetOption(c *fiber.Ctx) error {
	id := c.Params("id")
	var option entities.Option

	if err := config.Database.First(&option, id).Error; err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "Option not found"})
	}

	return c.Status(fiber.StatusOK).JSON(option)
}

// UpdateOption godoc
// @Summary Update an option by ID
// @Description Update an existing option by its ID
// @Tags options
// @Accept application/json
// @Produce application/json
// @Param id path int true "Option ID"
// @Param option body entities.Option true "Updated option data"
// @Success 200 {object} entities.Option
// @Failure 400
// @Failure 404
// @Router /options/{id} [put]
func UpdateOption(c *fiber.Ctx) error {
	id := c.Params("id")
	var option entities.Option

	if err := config.Database.First(&option, id).Error; err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "Option not found"})
	}

	updatedOption := new(entities.Option)
	if err := c.BodyParser(updatedOption); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": err.Error()})
	}

	// Update specific fields
	option.Text = updatedOption.Text
	option.IsCorrect = updatedOption.IsCorrect

	config.Database.Save(&option)
	return c.Status(fiber.StatusOK).JSON(option)
}

// DeleteOption godoc
// @Summary Delete an option by ID
// @Description Delete an option by its ID
// @Tags options
// @Produce application/json
// @Param id path int true "Option ID"
// @Success 200 {string} string "OK"
// @Failure 404
// @Router /options/{id} [delete]
func DeleteOption(c *fiber.Ctx) error {
	id := c.Params("id")
	var option entities.Option

	if err := config.Database.First(&option, id).Error; err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "Option not found"})
	}

	config.Database.Delete(&option)
	return c.SendStatus(fiber.StatusOK)
}

// GetAllOptions godoc
// @Summary Get all options
// @Description Retrieve all options
// @Tags options
// @Produce application/json
// @Success 200 {array} entities.Option
// @Router /options [get]
func GetAllOptions(c *fiber.Ctx) error {
	var options []entities.Option

	config.Database.Find(&options)
	return c.Status(fiber.StatusOK).JSON(options)
}
