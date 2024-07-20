package handlers

import (
	"github.com/gofiber/fiber/v2"
	"github.com/pksingh21/pyqbackend/config"
	"github.com/pksingh21/pyqbackend/entity"
	"gorm.io/gorm"
)

// CreateTest godoc
// @Summary Create a new test
// @Description Create a new test with provided details
// @Tags tests
// @Accept application/json
// @Produce application/json
// @Param test body entity.Test true "Test data"
// @Success 201 {object} entity.Test
// @Failure 400 {object} fiber.Map
// @Failure 500 {object} fiber.Map
// @Router /tests [post]
func CreateTest(c *fiber.Ctx) error {
	test := new(entities.Test)

	if err := c.BodyParser(test); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid input", "message": err.Error()})
	}

	if err := config.Database.Create(&test).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to create test", "message": err.Error()})
	}

	return c.Status(fiber.StatusCreated).JSON(test)
}

// GetTest godoc
// @Summary Get a test by ID
// @Description Retrieve a test by its ID
// @Tags tests
// @Produce application/json
// @Param id path int true "Test ID"
// @Success 200 {object} entity.Test
// @Failure 404 {object} fiber.Map
// @Failure 500 {object} fiber.Map
// @Router /tests/{id} [get]
func GetTest(c *fiber.Ctx) error {
	id := c.Params("id")
	var test entities.Test

	if err := config.Database.Preload("UserChoices.Selected").Preload("Paper").First(&test, id).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "Test not found"})
		}
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Database error", "message": err.Error()})
	}

	return c.Status(fiber.StatusOK).JSON(test)
}

// UpdateTest godoc
// @Summary Update a test by ID
// @Description Update an existing test by its ID
// @Tags tests
// @Accept application/json
// @Produce application/json
// @Param id path int true "Test ID"
// @Param test body entity.Test true "Updated test data"
// @Success 200 {object} entity.Test
// @Failure 400 {object} fiber.Map
// @Failure 404 {object} fiber.Map
// @Failure 500 {object} fiber.Map
// @Router /tests/{id} [put]
func UpdateTest(c *fiber.Ctx) error {
	id := c.Params("id")
	var test entities.Test

	if err := config.Database.First(&test, id).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "Test not found"})
		}
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Database error", "message": err.Error()})
	}

	updatedTest := new(entities.Test)
	if err := c.BodyParser(updatedTest); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid input", "message": err.Error()})
	}

	// Update specific fields
	test.Paper = updatedTest.Paper
	test.Duration = updatedTest.Duration
	test.StartTime = updatedTest.StartTime
	test.CreationTime = updatedTest.CreationTime
	test.UserChoices = updatedTest.UserChoices

	if err := config.Database.Save(&test).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to update test", "message": err.Error()})
	}

	return c.Status(fiber.StatusOK).JSON(test)
}

// DeleteTest godoc
// @Summary Delete a test by ID
// @Description Delete a test by its ID
// @Tags tests
// @Produce application/json
// @Param id path int true "Test ID"
// @Success 200 {string} string "OK"
// @Failure 404 {object} fiber.Map
// @Failure 500 {object} fiber.Map
// @Router /tests/{id} [delete]
func DeleteTest(c *fiber.Ctx) error {
	id := c.Params("id")
	var test entities.Test

	if err := config.Database.First(&test, id).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "Test not found"})
		}
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Database error", "message": err.Error()})
	}

	if err := config.Database.Delete(&test).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to delete test", "message": err.Error()})
	}

	return c.SendStatus(fiber.StatusOK)
}

// GetAllTests godoc
// @Summary Get all tests
// @Description Retrieve all tests
// @Tags tests
// @Produce application/json
// @Success 200 {array} entity.Test
// @Failure 500 {object} fiber.Map
// @Router /tests [get]
func GetAllTests(c *fiber.Ctx) error {
	var tests []entities.Test

	if err := config.Database.Preload("UserChoices.Selected").Preload("Paper").Find(&tests).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Database error", "message": err.Error()})
	}

	return c.Status(fiber.StatusOK).JSON(tests)
}
