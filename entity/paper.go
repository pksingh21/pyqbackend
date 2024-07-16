package entities

import (
    "gorm.io/gorm"
    "time"
)

type Paper struct {
    gorm.Model
    Title       string    `json:"title"`
    Tags        []Tag     `json:"tags" gorm:"many2many:paper_tags"`
    CreationTime time.Time `json:"creationTime"`
    IsModule    bool      `json:"isModule"`
    CreatedBy   string    `json:"createdBy"`
    PaperLength int       `json:"paperLength"`
    Questions   []Question `json:"questions" gorm:"many2many:paper_questions"`
}
