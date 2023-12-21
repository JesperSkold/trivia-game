export interface TriviaCategories {
  trivia_categories: TriviaCategory[]
}

export interface TriviaCategory {
  id: number
  name: string
}

export interface CategoryQuestionCount {
  [id: number]: {
    total_question_count: number
    total_easy_question_count: number
    total_medium_question_count: number
    total_hard_question_count: number
  }
}