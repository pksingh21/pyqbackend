package models

import (
	"time"
)

// actual paper
type Paper struct {
	UID       uint      `gorm:"primaryKey"`
	Title     string    `gorm:"type:varchar(255);not null"`
	Tags      []Tag     `gorm:"many2many:paper_tags;foreignKey: UID;joinForeignKey:UserRefer UID;References: UID;joinReferences:ProfileRefer"`
	IsModule  bool      `gorm:"default:false"`
	Duration  int       `gorm:"not null"`
	CreatedAt time.Time `gorm:"autoCreateTime"`
	UpdatedAt time.Time `gorm:"autoUpdateTime"`
	CreatedBy User      `gorm:"foreignKey: UID"`
}
