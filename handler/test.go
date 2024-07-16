package handlers

import (
	"github.com/gofiber/fiber/v2"
	"github.com/pksingh21/pyqbackend/config"
	entities "github.com/pksingh21/pyqbackend/entity"
)

// CreateTest godoc
// @Summary Create a new test
// @Description Create a new test with provided details
// @Tags tests
// @Accept application/json
// @Produce application/json
// @Param test body entities.Test true "Test data"
// @Success 201 {object} entities.Test
// @Failure 400
// @Router /tests [post]
func CreateTest(c *fiber.Ctx) error {
	test := new(entities.Test)

	if err := c.BodyParser(test); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": err.Error()})
	}

	config.Database.Create(&test)
	return c.Status(fiber.StatusCreated).JSON(test)
}

// GetTest godoc
// @Summary Get a test by ID
// @Description Retrieve a test by its ID
// @Tags tests
// @Produce application/json
// @Param id path int true "Test ID"
// @Success 200 {object} entities.Test
// @Failure 404
// @Router /tests/{id} [get]
func GetTest(c *fiber.Ctx) error {
	id := c.Params("id")
	var test entities.Test

	if err := config.Database.Preload("UserChoices.Selected").Preload("Paper").First(&test, id).Error; err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "Test not found"})
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
// @Param test body entities.Test true "Updated test data"
// @Success 200 {object} entities.Test
// @Failure 400
// @Failure 404
// @Router /tests/{id} [put]
func UpdateTest(c *fiber.Ctx) error {
	id := c.Params("id")
	var test entities.Test

	if err := config.Database.First(&test, id).Error; err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "Test not found"})
	}

	updatedTest := new(entities.Test)
	if err := c.BodyParser(updatedTest); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": err.Error()})
	}

	// Update specific fields
	test.Paper = updatedTest.Paper
	test.Duration = updatedTest.Duration
	test.StartTime = updatedTest.StartTime
	test.CreationTime = updatedTest.CreationTime
	// test.UserChoices = updatedTest.UserChoices

	config.Database.Save(&test)
	return c.Status(fiber.StatusOK).JSON(test)
}

// DeleteTest godoc
// @Summary Delete a test by ID
// @Description Delete a test by its ID
// @Tags tests
// @Produce application/json
// @Param id path int true "Test ID"
// @Success 200 {string} string "OK"
// @Failure 404
// @Router /tests/{id} [delete]
func DeleteTest(c *fiber.Ctx) error {
	id := c.Params("id")
	var test entities.Test

	if err := config.Database.First(&test, id).Error; err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "Test not found"})
	}

	config.Database.Delete(&test)
	return c.SendStatus(fiber.StatusOK)
}

// GetAllTests godoc
// @Summary Get all tests
// @Description Retrieve all tests
// @Tags tests
// @Produce application/json
// @Success 200 {array} entities.Test
// @Router /tests [get]
func GetAllTests(c *fiber.Ctx) error {
	var tests []entities.Test

	config.Database.Preload("UserChoices.Selected").Preload("Paper").Find(&tests)
	return c.Status(fiber.StatusOK).JSON(tests)
}
