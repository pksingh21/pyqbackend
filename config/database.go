package config

import (
    // "github.com/pksingh21/pyqbackend/entity"
    "gorm.io/driver/postgres"
    "gorm.io/gorm"
	"github.com/joho/godotenv"
	"os"
)

var Database *gorm.DB

func Connect() error {
    var err error

	err = godotenv.Load()
	if err != nil {
        panic(err)
    }
	var DATABASE_URI string = os.Getenv("POSTGRES_URI")
    Database, err = gorm.Open(postgres.Open(DATABASE_URI), &gorm.Config{
        SkipDefaultTransaction: true,
        PrepareStmt:            true,
    })

    if err != nil {
        panic(err)
    }

    // Database.AutoMigrate(&entities.Dog{})

    return nil
}