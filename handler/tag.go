package handlers

import (
	"github.com/gofiber/fiber/v2"
	"github.com/pksingh21/pyqbackend/config"
	"github.com/pksingh21/pyqbackend/entity"
	"gorm.io/gorm"
)

// CreateTag godoc
// @Summary Create a new tag
// @Description Create a new tag with provided details
// @Tags tags
// @Accept application/json
// @Produce application/json
// @Param tag body entity.Tag true "Tag data"
// @Success 201 {object} entity.Tag
// @Failure 400 {object} fiber.Map
// @Failure 500 {object} fiber.Map
// @Router /tags [post]
func CreateTag(c *fiber.Ctx) error {
	tag := new(entities.Tag)

	if err := c.BodyParser(tag); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid input", "message": err.Error()})
	}

	if err := config.Database.Create(&tag).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to create tag", "message": err.Error()})
	}

	return c.Status(fiber.StatusCreated).JSON(tag)
}

// GetTag godoc
// @Summary Get a tag by ID
// @Description Retrieve a tag by its ID
// @Tags tags
// @Produce application/json
// @Param id path int true "Tag ID"
// @Success 200 {object} entity.Tag
// @Failure 404 {object} fiber.Map
// @Failure 500 {object} fiber.Map
// @Router /tags/{id} [get]
func GetTag(c *fiber.Ctx) error {
	id := c.Params("id")
	var tag entities.Tag

	if err := config.Database.First(&tag, id).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "Tag not found"})
		}
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Database error", "message": err.Error()})
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
// @Param tag body entity.Tag true "Updated tag data"
// @Success 200 {object} entity.Tag
// @Failure 400 {object} fiber.Map
// @Failure 404 {object} fiber.Map
// @Failure 500 {object} fiber.Map
// @Router /tags/{id} [put]
func UpdateTag(c *fiber.Ctx) error {
	id := c.Params("id")
	var tag entities.Tag

	if err := config.Database.First(&tag, id).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "Tag not found"})
		}
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Database error", "message": err.Error()})
	}

	updatedTag := new(entities.Tag)
	if err := c.BodyParser(updatedTag); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid input", "message": err.Error()})
	}

	// Update specific fields
	tag.Name = updatedTag.Name
	tag.Type = updatedTag.Type

	if err := config.Database.Save(&tag).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to update tag", "message": err.Error()})
	}

	return c.Status(fiber.StatusOK).JSON(tag)
}

// DeleteTag godoc
// @Summary Delete a tag by ID
// @Description Delete a tag by its ID
// @Tags tags
// @Produce application/json
// @Param id path int true "Tag ID"
// @Success 200 {string} string "OK"
// @Failure 404 {object} fiber.Map
// @Failure 500 {object} fiber.Map
// @Router /tags/{id} [delete]
func DeleteTag(c *fiber.Ctx) error {
	id := c.Params("id")
	var tag entities.Tag

	if err := config.Database.First(&tag, id).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "Tag not found"})
		}
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Database error", "message": err.Error()})
	}

	if err := config.Database.Delete(&tag).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to delete tag", "message": err.Error()})
	}

	return c.SendStatus(fiber.StatusOK)
}

// GetAllTags godoc
// @Summary Get all tags
// @Description Retrieve all tags
// @Tags tags
// @Produce application/json
// @Success 200 {array} entity.Tag
// @Failure 500 {object} fiber.Map
// @Router /tags [get]
func GetAllTags(c *fiber.Ctx) error {
	var tags []entities.Tag

	if err := config.Database.Find(&tags).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Database error", "message": err.Error()})
	}

	return c.Status(fiber.StatusOK).JSON(tags)
}
