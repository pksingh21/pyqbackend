package entities

import (
	"time"

	"gorm.io/gorm"
)

// a Paper Collection
type Paper struct {
    gorm.Model
    Id          uint
    TestID      uint
    Title       string    
    Tags        []Tag     `gorm:"foreignKey:PaperID"`    
    CreationTime time.Time 
    IsModule    bool      
    CreatedBy   string    
    PaperLength int       
    Questions   []Question `gorm:"foreignKey:PaperID"`    
}
