package config

import (
	"fmt"
	"os"

	"github.com/joho/godotenv"
	"github.com/pksingh21/pyqbackend/entity"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

var Database *gorm.DB

func Connect() error {
    var err error

    // Load environment variables
    err = godotenv.Load()
    if err != nil {
        panic(err)
    }

    // Get PostgreSQL URI from environment
    DATABASE_URI := os.Getenv("POSTGRES_URI")

    // Connect to the database
    Database, err = gorm.Open(postgres.Open(DATABASE_URI), &gorm.Config{
        SkipDefaultTransaction: true,
        PrepareStmt:            true,
    })
    if err != nil {
        panic(err)
    }

    // Auto migrate all entities
    err = AutoMigrateEntities(Database)
    if err != nil {
        panic(err)
    }

    return nil
}

func AutoMigrateEntities(db *gorm.DB) error {
    // List of all entities to migrate
    entities := []interface{}{
        &entities.User{},
        &entities.Test{},
        &entities.Option{},
        &entities.Answer{},
        &entities.Paper{},
        &entities.Question{},
        &entities.Tag{},
    }

    // Auto migrate each entity
    for _, entity := range entities {
        fmt.Println(entity,"entity in use")
        if err := db.AutoMigrate(entity); err != nil {
            return err
        }
    }

    return nil
}
