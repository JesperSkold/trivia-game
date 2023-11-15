import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import { getCategories } from "../api/getCategories"
import { getGame } from "../api/getGame"
import { TriviaCategory, TriviaCategories } from "../interface/category"
import { getQuickGame } from "../api/getQuickGame"

export const fetchCategories = createAsyncThunk(
  "categories/fetchCategories",
  async () => {
    return await getCategories()
  }
)
// export const fetchGame = createAsyncThunk(
//   "game/fetchGame",
//   async (settings: any) => {
//     return await getGame(settings)
//   }
// )
// export const fetchQuickGame = createAsyncThunk(
//   "game/fetchQuickGame",
//   async () => {
//     return await getQuickGame()
//   }
// )
// Mock data structure similar to actual API response
const mockGameResponse = [
  {
    question: "What is 2+2?",
    correct_answer: "4",
    incorrect_answers: ["3", "5", "6"]
  },
  {
    question: "Who is the president of the USA?",
    correct_answer: "Joe Biden",
    incorrect_answers: ["Donald Trump", "Barack Obama", "George Washington"]
  },
  // Add more mock questions as needed
];

const mockQuickGameResponse = [
  {
    question: "What is the capital of France?",
    correct_answer: "Paris",
    incorrect_answers: ["London", "Berlin", "Rome"]
  },
  // Add more mock questions as needed
];

// ... (existing code)

export const fetchGame = createAsyncThunk(
  "game/fetchGame",
  async (settings: any) => {
    try {
      // Simulating the API call with a delay
      // You can replace this with actual API call when available
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return { results: mockGameResponse }; // Return mock data
    } catch (error) {
      // Handle error if needed
      console.error("Error fetching game:", error);
      throw error;
    }
  }
);

export const fetchQuickGame = createAsyncThunk(
  "game/fetchQuickGame",
  async () => {
    try {
      // Simulating the API call with a delay
      // You can replace this with actual API call when available
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return { results: mockQuickGameResponse }; // Return mock data
    } catch (error) {
      // Handle error if needed
      console.error("Error fetching quick game:", error);
      throw error;
    }
  }
);
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
  difficulty: "easy",
  questions: "10",
  type: "multiple",
  step: 0,

  currentGame: [],

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
      console.log(state.type)
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
    builder.addCase(fetchGame.pending, (state) => {
      state.loadingCustomGame = "pending"
    })
    builder.addCase(fetchCategories.rejected, (state) => {
      state.loadingCategories = "rejected"
    })
    builder.addCase(fetchQuickGame.rejected, (state) => {
      state.loadingQuickGame = "rejected"
    })
    builder.addCase(fetchGame.rejected, (state) => {
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
    builder.addCase(fetchGame.fulfilled, (state, action) => {
      // if (action.payload.response_code === 0) {
        console.log(action.payload, "currentgame from slice")
        state.currentGame = action.payload.results
        state.loadingCustomGame = "succeeded"
      // }
    })

    builder.addCase(fetchQuickGame.fulfilled, (state, action) => {
      state.currentCategory.name = ""
      state.currentGame = action.payload.results
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
