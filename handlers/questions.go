package entities

import (
	"gorm.io/gorm"
)

type Question struct {
    gorm.Model
    Topic           string   `json:"topic"`
    Tags            []Tag    `json:"tags" gorm:"many2many:question_tags"`
    QuestionData    string   `json:"questionData"`
    // Options         []Option `json:"options"`
    // Answers         []Answer `json:"answers"`
    MultiCorrect    bool     `json:"multiCorrect"`
    CorrectMarks    int      `json:"correctMarks"`
    IncorrectMarks  int      `json:"incorrectMarks"`
    DescriptionText string   `json:"descriptionText"`
    DescImages      []string `json:"descImages"`
}
