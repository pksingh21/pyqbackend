package handlers

import (
	"github.com/gofiber/fiber/v2"
	"github.com/pksingh21/pyqbackend/config"
	entities "github.com/pksingh21/pyqbackend/entity"
)

// CreateQuestion godoc
// @Summary Create a new question
// @Description Create a new question with provided details
// @Tags questions
// @Accept application/json
// @Produce application/json
// @Param question body entities.Question true "Question data"
// @Success 201 {object} entities.Question
// @Failure 400
// @Router /questions [post]
func CreateQuestion(c *fiber.Ctx) error {
	question := new(entities.Question)

	if err := c.BodyParser(question); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": err.Error()})
	}

	config.Database.Create(&question)
	return c.Status(fiber.StatusCreated).JSON(question)
}

// GetQuestion godoc
// @Summary Get a question by ID
// @Description Retrieve a question by its ID
// @Tags questions
// @Produce application/json
// @Param id path int true "Question ID"
// @Success 200 {object} entities.Question
// @Failure 404
// @Router /questions/{id} [get]
func GetQuestion(c *fiber.Ctx) error {
	id := c.Params("id")
	var question entities.Question

	if err := config.Database.Preload("Tags").First(&question, id).Error; err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "Question not found"})
	}

	return c.Status(fiber.StatusOK).JSON(question)
}

// UpdateQuestion godoc
// @Summary Update a question by ID
// @Description Update an existing question by its ID
// @Tags questions
// @Accept application/json
// @Produce application/json
// @Param id path int true "Question ID"
// @Param question body entities.Question true "Updated question data"
// @Success 200 {object} entities.Question
// @Failure 400
// @Failure 404
// @Router /questions/{id} [put]
func UpdateQuestion(c *fiber.Ctx) error {
	id := c.Params("id")
	var question entities.Question

	if err := config.Database.First(&question, id).Error; err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "Question not found"})
	}

	updatedQuestion := new(entities.Question)
	if err := c.BodyParser(updatedQuestion); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": err.Error()})
	}

	// Update specific fields
	question.Topic = updatedQuestion.Topic
	question.QuestionData = updatedQuestion.QuestionData
	question.Options = updatedQuestion.Options
	question.Answers = updatedQuestion.Answers
	question.MultiCorrect = updatedQuestion.MultiCorrect
	question.CorrectMarks = updatedQuestion.CorrectMarks
	question.IncorrectMarks = updatedQuestion.IncorrectMarks
	question.DescriptionText = updatedQuestion.DescriptionText
	// question.DescImages = updatedQuestion.DescImages
	question.Tags = updatedQuestion.Tags

	config.Database.Save(&question)
	return c.Status(fiber.StatusOK).JSON(question)
}

// DeleteQuestion godoc
// @Summary Delete a question by ID
// @Description Delete a question by its ID
// @Tags questions
// @Produce application/json
// @Param id path int true "Question ID"
// @Success 200 {string} string "OK"
// @Failure 404
// @Router /questions/{id} [delete]
func DeleteQuestion(c *fiber.Ctx) error {
	id := c.Params("id")
	var question entities.Question

	if err := config.Database.First(&question, id).Error; err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "Question not found"})
	}

	config.Database.Delete(&question)
	return c.SendStatus(fiber.StatusOK)
}

// GetAllQuestions godoc
// @Summary Get all questions
// @Description Retrieve all questions
// @Tags questions
// @Produce application/json
// @Success 200 {array} entities.Question
// @Router /questions [get]
func GetAllQuestions(c *fiber.Ctx) error {
	var questions []entities.Question

	config.Database.Preload("Tags").Find(&questions)
	return c.Status(fiber.StatusOK).JSON(questions)
}
