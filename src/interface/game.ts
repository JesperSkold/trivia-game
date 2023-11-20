export interface IGame {
  category: string
  correct_answer: string
  difficulty: string
  incorrect_answers: string[]
  question: string
  type: string
  chosenAnswer?: string
}