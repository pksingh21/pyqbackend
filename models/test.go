package models

import (
	"time"
)

type Test struct {
	UID         uint `gorm:"primaryKey"`
	Duration    int  `gorm:"not null"`
	StartTime   time.Time
	ElapsedTime int
	Paper       Paper     `gorm:"foreignKey: UID"`
	CreatedAt   time.Time `gorm:"autoCreateTime"`
	UpdatedAt   time.Time `gorm:"autoUpdateTime"`
	CreatedBy   User      `gorm:"foreignKey: UID"`
}
