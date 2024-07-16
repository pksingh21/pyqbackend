package entities

//Options for a given Question
type Option struct {
    Id         uint
    UserChoiceID uint
    QuestionID uint
    Text       string 
    IsCorrect  bool   
}
