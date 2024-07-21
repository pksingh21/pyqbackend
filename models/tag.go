package models

import (
    "time"
)

type Tag struct {
    ID        uint           `gorm:"primaryKey"`
    Name      string         `gorm:"type:varchar(100);not null"`
    Type      string         `gorm:"type:varchar(50);not null"`
    CreatedAt    time.Time     `gorm:"autoCreateTime"`  
    UpdatedAt    time.Time     `gorm:"autoUpdateTime"` 
    CreatedBy        User           `gorm:"foreignKey:ID"`
}
