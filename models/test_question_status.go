package models

import (
	"time"
)

// represent user's choice
type TestQuestionStatus struct {
	UID           uint             `gorm:"primaryKey"`
	Test          Test             `gorm:"foreignKey: UID"`
	Question      Question         `gorm:"foreignKey: UID"`
	Status        string           `gorm:"type:varchar(50);not null"`
	ChosenChoices []QuestionChoice `gorm:"foreignKey: UID"`
	CreatedAt     time.Time        `gorm:"autoCreateTime"`
	UpdatedAt     time.Time        `gorm:"autoUpdateTime"`
	CreatedBy     User             `gorm:"foreignKey: UID"`
}
