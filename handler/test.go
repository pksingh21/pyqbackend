package handlers

import (
    "github.com/pksingh21/pyqbackend/config"
    "github.com/pksingh21/pyqbackend/entity"
    "github.com/gofiber/fiber/v2"
)


// what the request body should contain : 
// {
// 	"paper": {
// 	  // Paper object fields here
// 	},
// 	"duration": 120, // Duration in minutes, for example
// 	"startTime": "2024-07-16T12:00:00Z", // ISO 8601 formatted date and time
// 	"creationTime": "2024-07-16T10:00:00Z", // ISO 8601 formatted date and time
// 	"userChoices": [
// 	  {
// 		"qId": 1, // Question ID
// 		"selected": [
// 		  {
// 			// Option object fields here
// 		  }
// 		],
// 		"seen": false,
// 		"marked": true
// 	  }
// 	  // Add more UserChoice objects as needed
// 	]
//}
  


// CreateTest creates a new test
func CreateTest(c *fiber.Ctx) error {
    test := new(entities.Test)

    if err := c.BodyParser(test); err != nil {
        return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": err.Error()})
    }

    config.Database.Create(&test)
    return c.Status(fiber.StatusCreated).JSON(test)
}

// GetTest retrieves a test by ID
func GetTest(c *fiber.Ctx) error {
    id := c.Params("id")
    var test entities.Test

    if err := config.Database.Preload("UserChoices.Selected").Preload("Paper").First(&test, id).Error; err != nil {
        return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "Test not found"})
    }

    return c.Status(fiber.StatusOK).JSON(test)
}

// UpdateTest updates a test by ID
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
    test.UserChoices = updatedTest.UserChoices

    config.Database.Save(&test)
    return c.Status(fiber.StatusOK).JSON(test)
}

// DeleteTest deletes a test by ID
func DeleteTest(c *fiber.Ctx) error {
    id := c.Params("id")
    var test entities.Test

    if err := config.Database.First(&test, id).Error; err != nil {
        return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "Test not found"})
    }

    config.Database.Delete(&test)
    return c.SendStatus(fiber.StatusOK)
}

// GetAllTests retrieves all tests
func GetAllTests(c *fiber.Ctx) error {
    var tests []entities.Test

    config.Database.Preload("UserChoices.Selected").Preload("Paper").Find(&tests)
    return c.Status(fiber.StatusOK).JSON(tests)
}
