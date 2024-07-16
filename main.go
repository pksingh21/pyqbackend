package main

import (
    "log"
    "github.com/pksingh21/pyqbackend/config"
    "github.com/gofiber/fiber/v2"
    "github.com/pksingh21/pyqbackend/handler"
)



func main() {
    app := fiber.New()
    config.Connect();
    api := app.Group("/api")
    {
        v1 := api.Group("/v1")
        {
            // User APIs
            v1.Post("/users", handlers.CreateUser)
            v1.Get("/users/:id", handlers.GetUser)
            v1.Put("/users/:id", handlers.UpdateUser)
            v1.Delete("/users/:id", handlers.DeleteUser)
            v1.Get("/users", handlers.GetAllUsers)

            // Test APIs
            v1.Post("/tests", handlers.CreateTest)
            v1.Get("/tests/:id", handlers.GetTest)
            v1.Put("/tests/:id", handlers.UpdateTest)
            v1.Delete("/tests/:id", handlers.DeleteTest)
            v1.Get("/tests", handlers.GetAllTests)

            // Option APIs
            v1.Post("/options", handlers.CreateOption)
            v1.Get("/options/:id", handlers.GetOption)
            v1.Put("/options/:id", handlers.UpdateOption)
            v1.Delete("/options/:id", handlers.DeleteOption)
            v1.Get("/options", handlers.GetAllOptions)

            // Answer APIs
            v1.Post("/answers", handlers.CreateAnswer)
            v1.Get("/answers/:id", handlers.GetAnswer)
            v1.Put("/answers/:id", handlers.UpdateAnswer)
            v1.Delete("/answers/:id", handlers.DeleteAnswer)
            v1.Get("/answers", handlers.GetAllAnswers)

            // Paper APIs
            v1.Post("/papers", handlers.CreatePaper)
            v1.Get("/papers/:id", handlers.GetPaper)
            v1.Put("/papers/:id", handlers.UpdatePaper)
            v1.Delete("/papers/:id", handlers.DeletePaper)
            v1.Get("/papers", handlers.GetAllPapers)

            // Question APIs
            v1.Post("/questions", handlers.CreateQuestion)
            v1.Get("/questions/:id", handlers.GetQuestion)
            v1.Put("/questions/:id", handlers.UpdateQuestion)
            v1.Delete("/questions/:id", handlers.DeleteQuestion)
            v1.Get("/questions", handlers.GetAllQuestions)

            // Tag APIs
            v1.Post("/tags", handlers.CreateTag)
            v1.Get("/tags/:id", handlers.GetTag)
            v1.Put("/tags/:id", handlers.UpdateTag)
            v1.Delete("/tags/:id", handlers.DeleteTag)
            v1.Get("/tags", handlers.GetAllTags)
        }
    }

    log.Fatal(app.Listen(":9999"))
}

