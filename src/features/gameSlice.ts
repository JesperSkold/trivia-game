import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import { getCategories } from "../api/getCategories"
import { getGame } from "../api/getCustomGame"
import { getQuickGame } from "../api/getQuickGame"
import {
  TriviaCategory,
  TriviaCategories,
  CategoryQuestionCount,
} from "../interface/category"
import { Settings } from "../interface/settings"
import { IGame } from "../interface/game"
import { getSessionToken } from "../api/getSessionToken"
import { RootState } from "../store/store"
import { resetSessionToken } from "../api/resetSessionToken"
import { getCategoryQuestionCount } from "../api/getCategoryQuestionCount"

export const fetchCategories = createAsyncThunk(
  "categories/fetchCategories",
  async () => {
    return await getCategories()
  }
)

export const fetchCategoryQuestionCount = createAsyncThunk(
  "categories/fetchCategoryQuestionCount",
  async (categoryID: number) => {
    return await getCategoryQuestionCount(categoryID)
  }
)

export const fetchCustomGame = createAsyncThunk(
  "game/fetchGame",
  async (settings: Settings, { getState }) => {
    const state = getState() as RootState
    const sessionToken = state.game.sessionToken
    return await getGame(settings, sessionToken)
  }
)

export const fetchQuickGame = createAsyncThunk(
  "game/fetchQuickGame",
  async (_, { getState }) => {
    const state = getState() as RootState
    const sessionToken = state.game.sessionToken
    return await getQuickGame(sessionToken)
  }
)

export const fetchSessionToken = createAsyncThunk(
  "game/fetchSessionToken",
  async () => {
    return await getSessionToken()
  }
)

export const fetchResetSessionToken = createAsyncThunk(
  "game/fetchResetSessionToken",
  async (_, { getState }) => {
    const state = getState() as RootState
    const sessionToken = state.game.sessionToken
    return await resetSessionToken(sessionToken)
  }
)

type LoadingState = "idle" | "pending" | "succeeded" | "rejected"

interface InitState {
  allCategories: TriviaCategories
  singleCategory: TriviaCategory[]
  multiCategory: TriviaCategory[]
  multiCategoryTitle: string[]

  currentCategory: TriviaCategory
  categoryQuestionCount: CategoryQuestionCount
  difficulty: string
  nQuestions: string
  type: string
  timer: string
  timerSeconds: string
  timesUp: boolean
  step: number
  showRecap: boolean

  currentGame: IGame[]
  nRightAnswers: number
  nWrongAnswers: number
  gameRecapAnswers: IGame[]
  responseCode: number

  loadingCategories: LoadingState
  loadingCustomGame: LoadingState
  loadingQuickGame: LoadingState
  loadingCategoryCount: LoadingState
  sessionToken: string
}

const initialState: InitState = {
  allCategories: { trivia_categories: [] },
  singleCategory: [],
  multiCategory: [],
  multiCategoryTitle: [],

  currentCategory: { name: "", id: 0 },
  categoryQuestionCount: {
    total_question_count: 0,
    total_easy_question_count: 0,
    total_medium_question_count: 0,
    total_hard_question_count: 0,
  },
  difficulty: "random",
  nQuestions: "5",
  type: "random",
  timer: "on",
  timerSeconds: "30",
  timesUp: false,
  step: 0,
  showRecap: false,

  currentGame: [],
  nRightAnswers: 0,
  nWrongAnswers: 0,
  gameRecapAnswers: [],
  responseCode: 0,

  loadingCategories: "idle",
  loadingCustomGame: "idle",
  loadingQuickGame: "idle",
  loadingCategoryCount: "idle",
  sessionToken: "",
}

export const gameSlice = createSlice({
  name: "game",
  initialState,
  reducers: {
    setCurrentCategory: (state, action) => {
      state.currentCategory = action.payload
      state.step = 1
    },
    addToGameRecapAnswers: (state, action) => {
      state.gameRecapAnswers.push({
        ...action.payload.gameMeta,
        chosenAnswer: action.payload.chosenAnswer,
        timeSpent: action.payload.timeSpent,
      })
    },
    setDifficulty: (state, action) => {
      state.difficulty = action.payload
    },
    setNQuestions: (state, action) => {
      state.nQuestions = action.payload
    },
    setTimerSeconds: (state, action) => {
      state.timerSeconds = action.payload
    },
    setTimer: (state, action) => {
      state.timer = action.payload
    },
    setTimesUp: (state, action) => {
      state.timesUp = action.payload
    },
    setType: (state, action) => {
      state.type = action.payload
    },
    setNRightAnswers: (state) => {
      state.nRightAnswers += 1
    },
    setNWrongAnswers: (state) => {
      state.nWrongAnswers += 1
    },
    setShowRecap: (state, action) => {
      state.showRecap = action.payload
    },
    resetStep: (state) => {
      state.step = 0
      state.currentGame = []
    },
    resetGameData: (state) => {
      state.gameRecapAnswers = []
      state.step = 2
      state.showRecap = false
      state.timesUp = false
      state.nRightAnswers = 0
      state.nWrongAnswers = 0
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
  },
  extraReducers: (builder) => {
    builder.addCase(fetchCategories.pending, (state) => {
      state.loadingCategories = "pending"
    })
    builder.addCase(fetchQuickGame.pending, (state) => {
      state.loadingQuickGame = "pending"
    })
    builder.addCase(fetchCustomGame.pending, (state) => {
      state.loadingCustomGame = "pending"
    })
    builder.addCase(fetchCategoryQuestionCount.pending, (state) => {
      state.loadingCategoryCount = "pending"
    })
    builder.addCase(fetchCategories.rejected, (state) => {
      state.loadingCategories = "rejected"
    })
    builder.addCase(fetchQuickGame.rejected, (state) => {
      state.loadingQuickGame = "rejected"
    })
    builder.addCase(fetchCustomGame.rejected, (state) => {
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

    builder.addCase(fetchCustomGame.fulfilled, (state, action) => {
      state.currentGame = action.payload.results
      state.responseCode = action.payload.response_code
      state.loadingCustomGame = "succeeded"
      gameSlice.caseReducers.resetGameData(state)
    })

    builder.addCase(fetchQuickGame.fulfilled, (state, action) => {
      state.currentCategory.name = ""
      state.currentCategory.id = -1
      state.currentGame = action.payload.results
      state.responseCode = action.payload.response_code
      state.loadingQuickGame = "succeeded"
      gameSlice.caseReducers.resetGameData(state)
    })

    builder.addCase(fetchCategoryQuestionCount.fulfilled, (state, action) => {
      state.categoryQuestionCount = action.payload.category_question_count
      state.loadingCategoryCount = "succeeded"
    })

    builder.addCase(fetchSessionToken.fulfilled, (state, action) => {
      state.responseCode = action.payload.response_code
      state.sessionToken = action.payload.token
    })

    builder.addCase(fetchResetSessionToken.fulfilled, (state, action) => {
      state.sessionToken = action.payload.token
    })
  },
})

export const {
  setCurrentCategory,
  setDifficulty,
  setNQuestions,
  setTimerSeconds,
  setTimer,
  setTimesUp,
  setType,
  setNRightAnswers,
  setNWrongAnswers,
  setShowRecap,
  resetStep,
  goBack,
  addToGameRecapAnswers,
} = gameSlice.actions

export default gameSlice.reducer
