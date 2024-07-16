package handlers

import (
    "github.com/pksingh21/pyqbackend/config"
    "github.com/pksingh21/pyqbackend/entity"
    "github.com/gofiber/fiber/v2"
)

// CreateTag creates a new tag
func CreateTag(c *fiber.Ctx) error {
    tag := new(entities.Tag)

    if err := c.BodyParser(tag); err != nil {
        return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": err.Error()})
    }

    config.Database.Create(&tag)
    return c.Status(fiber.StatusCreated).JSON(tag)
}

// GetTag retrieves a tag by ID
func GetTag(c *fiber.Ctx) error {
    id := c.Params("id")
    var tag entities.Tag

    if err := config.Database.First(&tag, id).Error; err != nil {
        return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "Tag not found"})
    }

    return c.Status(fiber.StatusOK).JSON(tag)
}

// UpdateTag updates a tag by ID
func UpdateTag(c *fiber.Ctx) error {
    id := c.Params("id")
    var tag entities.Tag

    if err := config.Database.First(&tag, id).Error; err != nil {
        return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "Tag not found"})
    }

    updatedTag := new(entities.Tag)
    if err := c.BodyParser(updatedTag); err != nil {
        return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": err.Error()})
    }

    // Update specific fields
    tag.Name = updatedTag.Name
    tag.Type = updatedTag.Type

    config.Database.Save(&tag)
    return c.Status(fiber.StatusOK).JSON(tag)
}

// DeleteTag deletes a tag by ID
func DeleteTag(c *fiber.Ctx) error {
    id := c.Params("id")
    var tag entities.Tag

    if err := config.Database.First(&tag, id).Error; err != nil {
        return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "Tag not found"})
    }

    config.Database.Delete(&tag)
    return c.SendStatus(fiber.StatusOK)
}

// GetAllTags retrieves all tags
func GetAllTags(c *fiber.Ctx) error {
    var tags []entities.Tag

    config.Database.Find(&tags)
    return c.Status(fiber.StatusOK).JSON(tags)
}
