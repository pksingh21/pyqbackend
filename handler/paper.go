package handlers

import (
	"github.com/gofiber/fiber/v2"
	"github.com/pksingh21/pyqbackend/config"
	entities "github.com/pksingh21/pyqbackend/entity"
)

// CreatePaper godoc
// @Summary Create a new paper
// @Description Create a new paper with provided details
// @Tags papers
// @Accept application/json
// @Produce application/json
// @Param paper body entities.Paper true "Paper data"
// @Success 201 {object} entities.Paper
// @Failure 400
// @Router /papers [post]
func CreatePaper(c *fiber.Ctx) error {
	paper := new(entities.Paper)

	if err := c.BodyParser(paper); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": err.Error()})
	}

	config.Database.Create(&paper)
	return c.Status(fiber.StatusCreated).JSON(paper)
}

// GetPaper godoc
// @Summary Get a paper by ID
// @Description Retrieve a paper by its ID
// @Tags papers
// @Produce application/json
// @Param id path int true "Paper ID"
// @Success 200 {object} entities.Paper
// @Failure 404
// @Router /papers/{id} [get]
func GetPaper(c *fiber.Ctx) error {
	id := c.Params("id")
	var paper entities.Paper

	if err := config.Database.First(&paper, id).Error; err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "Paper not found"})
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
// @Failure 400
// @Failure 404
// @Router /papers/{id} [put]
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
	// paper.Tags = updatedPaper.Tags
	paper.CreationTime = updatedPaper.CreationTime
	paper.IsModule = updatedPaper.IsModule
	paper.CreatedBy = updatedPaper.CreatedBy
	paper.PaperLength = updatedPaper.PaperLength

	config.Database.Save(&paper)
	return c.Status(fiber.StatusOK).JSON(paper)
}

// DeletePaper godoc
// @Summary Delete a paper by ID
// @Description Delete a paper by its ID
// @Tags papers
// @Produce application/json
// @Param id path int true "Paper ID"
// @Success 200 {string} string "OK"
// @Failure 404
// @Router /papers/{id} [delete]
func DeletePaper(c *fiber.Ctx) error {
	id := c.Params("id")
	var paper entities.Paper

	if err := config.Database.First(&paper, id).Error; err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "Paper not found"})
	}

	config.Database.Delete(&paper)
	return c.SendStatus(fiber.StatusOK)
}

// GetAllPapers godoc
// @Summary Get all papers
// @Description Retrieve all papers
// @Tags papers
// @Produce application/json
// @Success 200 {array} entities.Paper
// @Router /papers [get]
func GetAllPapers(c *fiber.Ctx) error {
	var papers []entities.Paper

	config.Database.Find(&papers)
	return c.Status(fiber.StatusOK).JSON(papers)
}
