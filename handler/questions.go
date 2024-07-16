package handlers

import (
    "github.com/pksingh21/pyqbackend/config"
    "github.com/pksingh21/pyqbackend/entity"
    "github.com/gofiber/fiber/v2"
)

// CreateQuestion creates a new question
func CreateQuestion(c *fiber.Ctx) error {
    question := new(entities.Question)

    if err := c.BodyParser(question); err != nil {
        return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": err.Error()})
    }

    config.Database.Create(&question)
    return c.Status(fiber.StatusCreated).JSON(question)
}

// GetQuestion retrieves a question by ID
func GetQuestion(c *fiber.Ctx) error {
    id := c.Params("id")
    var question entities.Question

    if err := config.Database.Preload("Tags").First(&question, id).Error; err != nil {
        return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "Question not found"})
    }

    return c.Status(fiber.StatusOK).JSON(question)
}

// UpdateQuestion updates a question by ID
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
    question.DescImages = updatedQuestion.DescImages
    question.Tags = updatedQuestion.Tags

    config.Database.Save(&question)
    return c.Status(fiber.StatusOK).JSON(question)
}

// DeleteQuestion deletes a question by ID
func DeleteQuestion(c *fiber.Ctx) error {
    id := c.Params("id")
    var question entities.Question

    if err := config.Database.First(&question, id).Error; err != nil {
        return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "Question not found"})
    }

    config.Database.Delete(&question)
    return c.SendStatus(fiber.StatusOK)
}

// GetAllQuestions retrieves all questions
func GetAllQuestions(c *fiber.Ctx) error {
    var questions []entities.Question

    config.Database.Preload("Tags").Find(&questions)
    return c.Status(fiber.StatusOK).JSON(questions)
}
