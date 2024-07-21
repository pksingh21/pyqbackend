package models

import (
	"time"
)

type User struct {
	UID          uint      `gorm:"primaryKey"`
	PhoneNumber  string    `gorm:"type:varchar(15);not null"`
	Name         string    `gorm:"type:varchar(100);not null"`
	Email        string    `gorm:"type:varchar(100);not null"`
	InterestedIn []Tag     `gorm:"many2many:user_interested_tags;"`
	CreatedAt    time.Time `gorm:"autoCreateTime"`
	UpdatedAt    time.Time `gorm:"autoUpdateTime"`
}
