package handlers

import (
    "github.com/pksingh21/pyqbackend/config"
    "github.com/pksingh21/pyqbackend/entity"
    "github.com/gofiber/fiber/v2"
)

// CreateAnswer creates a new answer
func CreateAnswer(c *fiber.Ctx) error {
    answer := new(entities.Answer)

    if err := c.BodyParser(answer); err != nil {
        return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": err.Error()})
    }

    config.Database.Create(&answer)
    return c.Status(fiber.StatusCreated).JSON(answer)
}

// GetAnswer retrieves an answer by ID
func GetAnswer(c *fiber.Ctx) error {
    id := c.Params("id")
    var answer entities.Answer

    if err := config.Database.First(&answer, id).Error; err != nil {
        return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "Answer not found"})
    }

    return c.Status(fiber.StatusOK).JSON(answer)
}

// UpdateAnswer updates an answer by ID
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


// DeleteAnswer deletes an answer by ID
func DeleteAnswer(c *fiber.Ctx) error {
    id := c.Params("id")
    var answer entities.Answer

    if err := config.Database.First(&answer, id).Error; err != nil {
        return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "Answer not found"})
    }

    config.Database.Delete(&answer)
    return c.SendStatus(fiber.StatusOK)
}

// GetAllAnswers retrieves all answers
func GetAllAnswers(c *fiber.Ctx) error {
    var answers []entities.Answer

    config.Database.Find(&answers)
    return c.Status(fiber.StatusOK).JSON(answers)
}
