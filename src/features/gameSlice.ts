import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import { getCategories } from "../api/getCategories"
import { getGame } from "../api/getCustomGame"
import { TriviaCategory, TriviaCategories } from "../interface/category"
import { getQuickGame } from "../api/getQuickGame"

export const fetchCategories = createAsyncThunk(
  "categories/fetchCategories",
  async () => {
    return await getCategories()
  }
)
export const fetchCusomGame = createAsyncThunk(
  "game/fetchGame",
  async (settings: any) => {
    return await getGame(settings)
  }
)
export const fetchQuickGame = createAsyncThunk(
  "game/fetchQuickGame",
  async () => {
    return await getQuickGame()
  }
)

type LoadingState = "idle" | "pending" | "succeeded" | "rejected"

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
  responseCode: number

  loadingCategories: LoadingState
  loadingCustomGame: LoadingState
  loadingQuickGame: LoadingState
}

const initialState: InitState = {
  allCategories: { trivia_categories: [] },
  singleCategory: [],
  multiCategory: [],
  multiCategoryTitle: [],

  currentCategory: { name: "", id: 0 },
  difficulty: "random",
  questions: "5",
  type: "random",
  step: 0,

  currentGame: [],
  responseCode: 0,

  loadingCategories: "idle",
  loadingCustomGame: "idle",
  loadingQuickGame: "idle",
}

export const gameSlice = createSlice({
  name: "game",
  initialState,
  reducers: {
    setCurrentCategory: (state, action) => {
      state.currentCategory = action.payload
      state.step = 1
    },
    setDifficulty: (state, action) => {
      state.difficulty = action.payload
      console.log(state.difficulty)
    },
    setQuestions: (state, action) => {
      state.questions = action.payload
      console.log(state.questions)
    },
    setType: (state, action) => {
      state.type = action.payload
    },
    startGame: (state) => {
      state.step = 2
    },
    resetGame: (state) => {
      state.step = 0
      state.currentGame = []
    },
    goBack: (state) => {
      if (state.step > 0) {
        state.responseCode = 0
        state.currentGame = []
        if (state.currentCategory.name) {
          state.step -= 1
        } else {
          state.step = 0
        }
      }
    },
    emptyCurrentGame: (state) => {
      state.currentGame = []
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchCategories.pending, (state) => {
      state.loadingCategories = "pending"
    })
    builder.addCase(fetchQuickGame.pending, (state) => {
      state.loadingQuickGame = "pending"
    })
    builder.addCase(fetchCusomGame.pending, (state) => {
      state.loadingCustomGame = "pending"
    })
    builder.addCase(fetchCategories.rejected, (state) => {
      state.loadingCategories = "rejected"
    })
    builder.addCase(fetchQuickGame.rejected, (state) => {
      state.loadingQuickGame = "rejected"
    })
    builder.addCase(fetchCusomGame.rejected, (state) => {
      state.loadingCustomGame = "rejected"
    })
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
    builder.addCase(fetchCusomGame.fulfilled, (state, action) => {
        console.log(action.payload, "currentgame from slice")
        state.currentGame = action.payload.results
        state.responseCode = action.payload.response_code
        state.loadingCustomGame = "succeeded"
    })

    builder.addCase(fetchQuickGame.fulfilled, (state, action) => {
      state.currentCategory.name = ""
      state.currentGame = action.payload.results
      state.responseCode = action.payload.response_code
      state.step = 2
      state.loadingQuickGame = "succeeded"
    })
  },
})

export const {
  setCurrentCategory,
  setDifficulty,
  setQuestions,
  setType,
  startGame,
  resetGame,
  goBack,
  emptyCurrentGame,
} = gameSlice.actions

export default gameSlice.reducer
