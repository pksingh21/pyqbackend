package models

import (
	"time"
)

// question db
type Question struct {
	UID            uint      `gorm:"primaryKey"`
	Text           string    `gorm:"type:text;not null"`
	Tags           []Tag     `gorm:"many2many:question_tags;"`
	Images         []string  `gorm:"type:text[]"`
	IsMultiCorrect bool      `gorm:"default:false"`
	CorrectMarks   int       `gorm:"not null"`
	IncorrectMarks int       `gorm:"not null"`
	CreatedAt      time.Time `gorm:"autoCreateTime"`
	UpdatedAt      time.Time `gorm:"autoUpdateTime"`
	CreatedBy      User      `gorm:"foreignKey: UID"`
}
