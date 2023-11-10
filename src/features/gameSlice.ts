import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import { getCategories } from "../api/getCategories"
import { getGame } from "../api/getGame"
import { TriviaCategory, TriviaCategories } from "../interface/category"

export const fetchCategories = createAsyncThunk(
  "categories/fetchCategories",
  async () => {
    return await getCategories()
  }
)
export const fetchGame = createAsyncThunk(
  "game/fetchGame",
  async (settings: any) => {
    console.log(settings, "yo");
    
    return await getGame(settings)
  }
)

interface InitState {
  allCategories: TriviaCategories
  singleCategory: TriviaCategory[]
  multiCategory: TriviaCategory[]
  multiCategoryTitle: string[]

  currentCategory: TriviaCategory
  difficulty: string
  questions: string
  type: string
  step: number

  currentGame: any

  loadingCategories: "idle" | "pending" | "succeeded" | "rejected"
  loadingQuestions: "idle" | "pending" | "succeeded" | "rejected"


}

const initialState: InitState = {
  allCategories: { trivia_categories: [] },
  singleCategory: [],
  multiCategory: [],
  multiCategoryTitle: [],

  currentCategory: { name: "", id: 0 },
  difficulty: "easy",
  questions: "10",
  type: "multiple",
  step: 0,

  currentGame: [],

  loadingCategories: "idle",
  loadingQuestions: "idle"
}

export const gameSlice = createSlice({
  name: "game",
  initialState,
  reducers: {
    setCurrentCategory: (state, action) => {
      state.currentCategory = action.payload
      state.step = 1
      console.log(state.currentCategory, "gamestting")
    },
    setDifficulty: (state, action) => {
      state.difficulty = action.payload
      console.log(state.difficulty);
      
    },
    setQuestions: (state, action) => {
      state.questions = action.payload
      console.log(state.questions);
      
    },
    setType: (state, action) => {
      state.type = action.payload
      console.log(state.type);
    },
    startGame: (state) => {
      state.step = 2
    },
    restartGame: (state) => {
      state.step = 0
    },
    goBack: (state) => {
      if (state.step > 0) {
        state.step -= 1
      }
    }
  },
  extraReducers: (builder) => {
    builder.addCase(fetchCategories.fulfilled, (state, action) => {
      state.allCategories = action.payload
      const multi: TriviaCategory[] = []
      const single: TriviaCategory[] = []

      action.payload.trivia_categories.forEach((cat: TriviaCategory) =>
        /:/.test(cat.name)
          ? multi.push({ name: cat.name, id: cat.id })
          : single.push({ name: cat.name, id: cat.id })
      )
      state.singleCategory = single
      state.multiCategory = multi

      const category = multi.map((cat) =>
        cat.name.slice(0, cat.name.indexOf(":"))
      )
      state.multiCategoryTitle = [...new Set(category)]

      state.loadingCategories = "succeeded"
    })
    builder.addCase(fetchGame.fulfilled, (state, action) => {
      if (action.payload.response_code === 0) {
        console.log(action.payload, "currentgame from slice");
        state.currentGame = action.payload.results
        state.loadingQuestions = "succeeded"
      }
      
    })
  },
})

export const { setCurrentCategory, setDifficulty, setQuestions, setType, startGame, restartGame, goBack } = gameSlice.actions

export default gameSlice.reducer
