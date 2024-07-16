package entities

import "gorm.io/gorm"

// Question tag like chemistry , biology etc
type Tag struct {
    gorm.Model
    Id   uint
    PaperID uint
    QuestionID uint
    Name string 
    Type string 
}
