package entities

import "gorm.io/gorm"

type Tag struct {
    gorm.Model
    Name string `json:"name"`
    Type string `json:"type"`
}
