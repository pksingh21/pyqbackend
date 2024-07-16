package handlers

import (
    "github.com/pksingh21/pyqbackend/config"
    "github.com/pksingh21/pyqbackend/entity"
    "github.com/gofiber/fiber/v2"
)

// CreateOption creates a new option
func CreateOption(c *fiber.Ctx) error {
    option := new(entities.Option)

    if err := c.BodyParser(option); err != nil {
        return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": err.Error()})
    }

    config.Database.Create(&option)
    return c.Status(fiber.StatusCreated).JSON(option)
}

// GetOption retrieves an option by ID
func GetOption(c *fiber.Ctx) error {
    id := c.Params("id")
    var option entities.Option

    if err := config.Database.First(&option, id).Error; err != nil {
        return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "Option not found"})
    }

    return c.Status(fiber.StatusOK).JSON(option)
}

// UpdateOption updates an option by ID
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

// DeleteOption deletes an option by ID
func DeleteOption(c *fiber.Ctx) error {
    id := c.Params("id")
    var option entities.Option

    if err := config.Database.First(&option, id).Error; err != nil {
        return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "Option not found"})
    }

    config.Database.Delete(&option)
    return c.SendStatus(fiber.StatusOK)
}

// GetAllOptions retrieves all options
func GetAllOptions(c *fiber.Ctx) error {
    var options []entities.Option

    config.Database.Find(&options)
    return c.Status(fiber.StatusOK).JSON(options)
}
