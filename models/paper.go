package models

import (
    "time"
)
// actual paper
type Paper struct {
    ID          uint           `gorm:"primaryKey"`
    Title       string         `gorm:"type:varchar(255);not null"`
    Tags        []Tag          `gorm:"many2many:paper_tags;foreignKey:ID;joinForeignKey:UserReferID;References:ID;joinReferences:ProfileRefer"`
    IsModule    bool           `gorm:"default:false"`
    Duration    int            `gorm:"not null"`
    CreatedAt    time.Time     `gorm:"autoCreateTime"`  
    UpdatedAt    time.Time     `gorm:"autoUpdateTime"` 
    CreatedBy        User           `gorm:"foreignKey:ID"`
}
