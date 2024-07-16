package handlers

import (
	"github.com/gofiber/fiber/v2"
	"github.com/pksingh21/pyqbackend/config"
	entities "github.com/pksingh21/pyqbackend/entity"
)

// CreateAnswer creates a new answer
// @Summary Create a new answer
// @Description Create a new answer with the input payload
// @Tags Answer
// @Accept json
// @Produce json
// @Param answer body entities.Answer true "Answer payload"
// @Success 201 {object} entities.Answer
// @Failure 400  
// @Router /answers [post]
func CreateAnswer(c *fiber.Ctx) error {
	answer := new(entities.Answer)

	if err := c.BodyParser(answer); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": err.Error()})
	}

	config.Database.Create(&answer)
	return c.Status(fiber.StatusCreated).JSON(answer)
}

// GetAnswer godoc
// @Summary Get an answer by ID
// @Description Retrieve an answer by its ID
// @Tags answers
// @Produce json
// @Param id path int true "Answer ID"
// @Success 200 {object} entities.Answer
// @Failure 404 
// @Router /answers/{id} [get]
func GetAnswer(c *fiber.Ctx) error {
	id := c.Params("id")
	var answer entities.Answer

	if err := config.Database.First(&answer, id).Error; err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "Answer not found"})
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
// @Failure 400 
// @Failure 404 
// @Router /answers/{id} [put]
func UpdateAnswer(c *fiber.Ctx) error {
	id := c.Params("id")
	var answer entities.Answer

	if err := config.Database.First(&answer, id).Error; err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "Answer not found"})
	}

	updatedAnswer := new(entities.Answer)
	if err := c.BodyParser(updatedAnswer); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": err.Error()})
	}

	config.Database.Model(&answer).Updates(updatedAnswer)
	return c.Status(fiber.StatusOK).JSON(answer)
}

// DeleteAnswer godoc
// @Summary Delete an answer by ID
// @Description Delete an answer by its ID
// @Tags answers
// @Produce json
// @Param id path int true "Answer ID"
// @Success 200 {string} string "OK"
// @Failure 404 
// @Router /answers/{id} [delete]
func DeleteAnswer(c *fiber.Ctx) error {
	id := c.Params("id")
	var answer entities.Answer

	if err := config.Database.First(&answer, id).Error; err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "Answer not found"})
	}

	config.Database.Delete(&answer)
	return c.SendStatus(fiber.StatusOK)
}

// GetAllAnswers godoc
// @Summary Get all answers
// @Description Retrieve all answers
// @Tags answers
// @Produce json
// @Success 200 {array} entities.Answer
// @Router /answers [get]
func GetAllAnswers(c *fiber.Ctx) error {
	var answers []entities.Answer

	config.Database.Find(&answers)
	return c.Status(fiber.StatusOK).JSON(answers)
}
