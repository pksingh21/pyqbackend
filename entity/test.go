package entities

import (
	"time"

	"gorm.io/gorm"
)

// Users can attempt test here
type Test struct {
    // Gorm Model
    gorm.Model
    Paper        Paper   `gorm:"foreignKey:TestID"`    
    Duration     int         
    StartTime    time.Time   
    CreationTime time.Time   
    UserChoices  []UserChoice `gorm:"foreignKey:TestID"`
}

// User's input choice
type UserChoice struct {
    gorm.Model
    TestID   uint     
    QID      uint     
    Selected []Option   `gorm:"foreignKey:UserChoiceID"`    
    Seen     bool     
    Marked   bool     
}
