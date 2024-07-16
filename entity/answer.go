package entities

import "gorm.io/gorm"

type Answer struct {
    gorm.Model
    Text       string `json:"text"`
    IsCorrect  bool   `json:"isCorrect"`
    QuestionID uint   `json:"-"`
}
