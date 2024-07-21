package models

import (
    "time"
)
// represent user's choice
type TestQuestionStatus struct {
    ID           uint           `gorm:"primaryKey"`
    Test         Test           `gorm:"foreignKey:ID"`
    Question     Question       `gorm:"foreignKey:ID"`
    Status       string         `gorm:"type:varchar(50);not null"`
    ChosenChoices []QuestionChoice       `gorm:"foreignKey:ID"`
    CreatedAt    time.Time     `gorm:"autoCreateTime"`  
    UpdatedAt    time.Time     `gorm:"autoUpdateTime"` 
    CreatedBy        User           `gorm:"foreignKey:ID"`
}
