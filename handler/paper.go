package handlers

import (
    "github.com/pksingh21/pyqbackend/config"
    "github.com/pksingh21/pyqbackend/entity"
    "github.com/gofiber/fiber/v2"
)

// CreatePaper creates a new paper
func CreatePaper(c *fiber.Ctx) error {
    paper := new(entities.Paper)

    if err := c.BodyParser(paper); err != nil {
        return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": err.Error()})
    }

    config.Database.Create(&paper)
    return c.Status(fiber.StatusCreated).JSON(paper)
}

// GetPaper retrieves a paper by ID
func GetPaper(c *fiber.Ctx) error {
    id := c.Params("id")
    var paper entities.Paper

    if err := config.Database.First(&paper, id).Error; err != nil {
        return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "Paper not found"})
    }

    return c.Status(fiber.StatusOK).JSON(paper)
}

// UpdatePaper updates a paper by ID
func UpdatePaper(c *fiber.Ctx) error {
    id := c.Params("id")
    var paper entities.Paper

    if err := config.Database.First(&paper, id).Error; err != nil {
        return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "Paper not found"})
    }

    updatedPaper := new(entities.Paper)
    if err := c.BodyParser(updatedPaper); err != nil {
        return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": err.Error()})
    }

    // Update specific fields
    paper.Title = updatedPaper.Title
    paper.Tags = updatedPaper.Tags
    paper.CreationTime = updatedPaper.CreationTime
    paper.IsModule = updatedPaper.IsModule
    paper.CreatedBy = updatedPaper.CreatedBy
    paper.PaperLength = updatedPaper.PaperLength

    config.Database.Save(&paper)
    return c.Status(fiber.StatusOK).JSON(paper)
}

// DeletePaper deletes a paper by ID
func DeletePaper(c *fiber.Ctx) error {
    id := c.Params("id")
    var paper entities.Paper

    if err := config.Database.First(&paper, id).Error; err != nil {
        return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "Paper not found"})
    }

    config.Database.Delete(&paper)
    return c.SendStatus(fiber.StatusOK)
}

// GetAllPapers retrieves all papers
func GetAllPapers(c *fiber.Ctx) error {
    var papers []entities.Paper

    config.Database.Find(&papers)
    return c.Status(fiber.StatusOK).JSON(papers)
}
