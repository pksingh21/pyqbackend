package handlers

import (
	"github.com/gofiber/fiber/v2"
	"github.com/pksingh21/pyqbackend/config"
	entities "github.com/pksingh21/pyqbackend/entity"
)

// CreateTag godoc
// @Summary Create a new tag
// @Description Create a new tag with provided details
// @Tags tags
// @Accept application/json
// @Produce application/json
// @Param tag body entities.Tag true "Tag data"
// @Success 201 {object} entities.Tag
// @Failure 400
// @Router /tags [post]
func CreateTag(c *fiber.Ctx) error {
	tag := new(entities.Tag)

	if err := c.BodyParser(tag); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": err.Error()})
	}

	config.Database.Create(&tag)
	return c.Status(fiber.StatusCreated).JSON(tag)
}

// GetTag godoc
// @Summary Get a tag by ID
// @Description Retrieve a tag by its ID
// @Tags tags
// @Produce application/json
// @Param id path int true "Tag ID"
// @Success 200 {object} entities.Tag
// @Failure 404
// @Router /tags/{id} [get]
func GetTag(c *fiber.Ctx) error {
	id := c.Params("id")
	var tag entities.Tag

	if err := config.Database.First(&tag, id).Error; err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "Tag not found"})
	}

	return c.Status(fiber.StatusOK).JSON(tag)
}

// UpdateTag godoc
// @Summary Update a tag by ID
// @Description Update an existing tag by its ID
// @Tags tags
// @Accept application/json
// @Produce application/json
// @Param id path int true "Tag ID"
// @Param tag body entities.Tag true "Updated tag data"
// @Success 200 {object} entities.Tag
// @Failure 400
// @Failure 404
// @Router /tags/{id} [put]
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

// DeleteTag godoc
// @Summary Delete a tag by ID
// @Description Delete a tag by its ID
// @Tags tags
// @Produce application/json
// @Param id path int true "Tag ID"
// @Success 200 {string} string "OK"
// @Failure 404
// @Router /tags/{id} [delete]
func DeleteTag(c *fiber.Ctx) error {
	id := c.Params("id")
	var tag entities.Tag

	if err := config.Database.First(&tag, id).Error; err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "Tag not found"})
	}

	config.Database.Delete(&tag)
	return c.SendStatus(fiber.StatusOK)
}

// GetAllTags godoc
// @Summary Get all tags
// @Description Retrieve all tags
// @Tags tags
// @Produce application/json
// @Success 200 {array} entities.Tag
// @Router /tags [get]
func GetAllTags(c *fiber.Ctx) error {
	var tags []entities.Tag

	config.Database.Find(&tags)
	return c.Status(fiber.StatusOK).JSON(tags)
}
