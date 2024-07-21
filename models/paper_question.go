package models

import (
    "time"
)

// array of questions in a paper
type PaperQuestion struct {
    ID            uint           `gorm:"primaryKey"`
    Paper         Paper          `gorm:"foreignKey:ID"`
    Question      Question       `gorm:"foreignKey:ID"`
    QuestionOrder int            `gorm:"not null"`
    CreatedAt    time.Time     `gorm:"autoCreateTime"`  
    UpdatedAt    time.Time     `gorm:"autoUpdateTime"` 
    CreatedBy        User           `gorm:"foreignKey:ID"`
}
