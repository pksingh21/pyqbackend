package entities

import (
    "gorm.io/gorm"
    "time"
)

type Test struct {
    gorm.Model
    Paper      Paper     `json:"paper"`
    Duration   int       `json:"duration"`
    StartTime  time.Time `json:"startTime"`
    CreationTime time.Time `json:"creationTime"`
    UserChoices []UserChoice `json:"userChoices"`
}

type UserChoice struct {
    QID     uint `json:"qId"`
    // Selected []Option `json:"selected"`
    Seen    bool `json:"seen"`
    Marked  bool `json:"marked"`
}

