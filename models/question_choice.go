package models

import (
	"time"
)

// options for a question
type QuestionChoice struct {
	UID         uint      `gorm:"primaryKey"`
	Question    Question  `gorm:"foreignKey: UID"`
	Text        string    `gorm:"type:text;not null"`
	IsAnswer    bool      `gorm:"not null"`
	ChoiceOrder int       `gorm:"not null"`
	CreatedAt   time.Time `gorm:"autoCreateTime"`
	UpdatedAt   time.Time `gorm:"autoUpdateTime"`
	CreatedBy   User      `gorm:"foreignKey: UID"`
}
