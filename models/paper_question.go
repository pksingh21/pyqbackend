package models

import (
	"time"
)

// array of questions in a paper
type PaperQuestion struct {
	UID           uint      `gorm:"primaryKey"`
	Paper         Paper     `gorm:"foreignKey: UID"`
	Question      Question  `gorm:"foreignKey: UID"`
	QuestionOrder int       `gorm:"not null"`
	CreatedAt     time.Time `gorm:"autoCreateTime"`
	UpdatedAt     time.Time `gorm:"autoUpdateTime"`
	CreatedBy     User      `gorm:"foreignKey: UID"`
}
