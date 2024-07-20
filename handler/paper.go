package handlers

import (
	"github.com/gofiber/fiber/v2"
	"github.com/pksingh21/pyqbackend/config"
	"github.com/pksingh21/pyqbackend/entity"
	"gorm.io/gorm"
)

// CreatePaper godoc
// @Summary Create a new paper
// @Description Create a new paper with provided details
// @Tags papers
// @Accept application/json
// @Produce application/json
// @Param paper body entities.Paper true "Paper data"
// @Success 201 {object} entities.Paper
// @Failure 400 {object} fiber.Map
// @Failure 500 {object} fiber.Map
// @Router /papers [post]
func CreatePaper(c *fiber.Ctx) error {
	paper := new(entities.Paper)

	if err := c.BodyParser(paper); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid input", "message": err.Error()})
	}
	
	if err := config.Database.Create(&paper).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to create paper", "message": err.Error()})
	}

	return c.Status(fiber.StatusCreated).JSON(paper)
}

// GetPaper godoc
// @Summary Get a paper by ID
// @Description Retrieve a paper by its ID
// @Tags papers
// @Produce application/json
// @Param id path int true "Paper ID"
// @Success 200 {object} entities.Paper
// @Failure 404 {object} fiber.Map
// @Failure 500 {object} fiber.Map
// @Router /papers/{id} [get]
func GetPaper(c *fiber.Ctx) error {
	id := c.Params("id")
	var paper entities.Paper

	if err := config.Database.First(&paper, id).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "Paper not found"})
		}
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Database error", "message": err.Error()})
	}

	return c.Status(fiber.StatusOK).JSON(paper)
}

// UpdatePaper godoc
// @Summary Update a paper by ID
// @Description Update an existing paper by its ID
// @Tags papers
// @Accept application/json
// @Produce application/json
// @Param id path int true "Paper ID"
// @Param paper body entities.Paper true "Updated paper data"
// @Success 200 {object} entities.Paper
// @Failure 400 {object} fiber.Map
// @Failure 404 {object} fiber.Map
// @Failure 500 {object} fiber.Map
// @Router /papers/{id} [put]
func UpdatePaper(c *fiber.Ctx) error {
	id := c.Params("id")
	var paper entities.Paper

	if err := config.Database.First(&paper, id).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "Paper not found"})
		}
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Database error", "message": err.Error()})
	}

	updatedPaper := new(entities.Paper)
	if err := c.BodyParser(updatedPaper); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid input", "message": err.Error()})
	}

	// Update specific fields
	paper.Title = updatedPaper.Title
	paper.CreationTime = updatedPaper.CreationTime
	paper.IsModule = updatedPaper.IsModule
	paper.CreatedBy = updatedPaper.CreatedBy
	paper.PaperLength = updatedPaper.PaperLength

	if err := config.Database.Save(&paper).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to update paper", "message": err.Error()})
	}

	return c.Status(fiber.StatusOK).JSON(paper)
}

// DeletePaper godoc
// @Summary Delete a paper by ID
// @Description Delete a paper by its ID
// @Tags papers
// @Produce application/json
// @Param id path int true "Paper ID"
// @Success 200 {string} string "OK"
// @Failure 404 {object} fiber.Map
// @Failure 500 {object} fiber.Map
// @Router /papers/{id} [delete]
func DeletePaper(c *fiber.Ctx) error {
	id := c.Params("id")
	var paper entities.Paper

	if err := config.Database.First(&paper, id).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "Paper not found"})
		}
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Database error", "message": err.Error()})
	}

	if err := config.Database.Delete(&paper).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to delete paper", "message": err.Error()})
	}

	return c.SendStatus(fiber.StatusOK)
}

// GetAllPapers godoc
// @Summary Get all papers
// @Description Retrieve all papers
// @Tags papers
// @Produce application/json
// @Success 200 {array} entities.Paper
// @Failure 500 {object} fiber.Map
// @Router /papers [get]
func GetAllPapers(c *fiber.Ctx) error {
	var papers []entities.Paper

	if err := config.Database.Find(&papers).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Database error", "message": err.Error()})
	}

	return c.Status(fiber.StatusOK).JSON(papers)
}
