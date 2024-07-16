package entities

import (
	// "github.com/lib/pq"
	"gorm.io/gorm"

)

// A Question in a Paper or a test
type Question struct {
    gorm.Model
    Id              uint
    PaperID uint
    Topic           string   
    Tags            []Tag     `gorm:"foreignKey:QuestionID"`    
    QuestionData    string   
    Options         []Option   `gorm:"foreignKey:QuestionID"`    
    Answers         []Answer   `gorm:"foreignKey:QuestionID"`    
    MultiCorrect    bool     
    CorrectMarks    int      
    IncorrectMarks  int      
    DescriptionText string   
    DescImages      []DescriptionImagesURL `gorm:"foreignKey:QuestionID"`
}

type DescriptionImagesURL struct {
    gorm.Model
    QuestionID uint
    URLLink    string
}
