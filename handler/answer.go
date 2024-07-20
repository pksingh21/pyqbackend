package handlers

import (
	"github.com/gofiber/fiber/v2"
	"github.com/pksingh21/pyqbackend/config"
	entities "github.com/pksingh21/pyqbackend/entity"
	"gorm.io/gorm"
)

// CreateAnswer creates a new answer
// @Summary Create a new answer
// @Description Create a new answer with the input payload
// @Tags Answer
// @Accept json
// @Produce json
// @Param answer body entities.Answer true "Answer payload"
// @Success 201 {object} entities.Answer
// @Failure 400 {object} fiber.Map
// @Router /answers [post]
func CreateAnswer(c *fiber.Ctx) error {
	answer := new(entities.Answer)

	if err := c.BodyParser(answer); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid input", "message": err.Error()})
	}

	if err := config.Database.Create(&answer).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Database error", "message": err.Error()})
	}

	return c.Status(fiber.StatusCreated).JSON(answer)
}

// GetAnswer godoc
// @Summary Get an answer by ID
// @Description Retrieve an answer by its ID
// @Tags answers
// @Produce json
// @Param id path int true "Answer ID"
// @Success 200 {object} entities.Answer
// @Failure 404 {object} fiber.Map
// @Router /answers/{id} [get]
func GetAnswer(c *fiber.Ctx) error {
	id := c.Params("id")
	var answer entities.Answer

	if err := config.Database.First(&answer, id).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "Answer not found"})
		}
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Database error", "message": err.Error()})
	}

	return c.Status(fiber.StatusOK).JSON(answer)
}

// UpdateAnswer godoc
// @Summary Update an answer by ID
// @Description Update an existing answer by its ID
// @Tags answers
// @Accept json
// @Produce json
// @Param id path int true "Answer ID"
// @Param answer body entities.Answer true "Updated answer data"
// @Success 200 {object} entities.Answer
// @Failure 400 {object} fiber.Map
// @Failure 404 {object} fiber.Map
// @Router /answers/{id} [put]
func UpdateAnswer(c *fiber.Ctx) error {
	id := c.Params("id")
	var answer entities.Answer

	if err := config.Database.First(&answer, id).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "Answer not found"})
		}
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Database error", "message": err.Error()})
	}

	updatedAnswer := new(entities.Answer)
	if err := c.BodyParser(updatedAnswer); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid input", "message": err.Error()})
	}

	if err := config.Database.Model(&answer).Updates(updatedAnswer).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Database error", "message": err.Error()})
	}

	return c.Status(fiber.StatusOK).JSON(answer)
}

// DeleteAnswer godoc
// @Summary Delete an answer by ID
// @Description Delete an answer by its ID
// @Tags answers
// @Produce json
// @Param id path int true "Answer ID"
// @Success 200 {string} string "OK"
// @Failure 404 {object} fiber.Map
// @Router /answers/{id} [delete]
func DeleteAnswer(c *fiber.Ctx) error {
	id := c.Params("id")
	var answer entities.Answer

	if err := config.Database.First(&answer, id).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "Answer not found"})
		}
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Database error", "message": err.Error()})
	}

	if err := config.Database.Delete(&answer).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Database error", "message": err.Error()})
	}

	return c.SendStatus(fiber.StatusOK)
}

// GetAllAnswers godoc
// @Summary Get all answers
// @Description Retrieve all answers
// @Tags answers
// @Produce json
// @Success 200 {array} entities.Answer
// @Failure 500 {object} fiber.Map
// @Router /answers [get]
func GetAllAnswers(c *fiber.Ctx) error {
	var answers []entities.Answer

	if err := config.Database.Find(&answers).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Database error", "message": err.Error()})
	}

	return c.Status(fiber.StatusOK).JSON(answers)
}
