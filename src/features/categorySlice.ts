import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import { getCategories } from "../api/getCategories"
import { TriviaCategory, TriviaCategories } from "../interface/category"

export const fetchCategories = createAsyncThunk(
  "categories/fetchCategories",
  async () => {
    return await getCategories()
  }
)

interface CategoryState {
  allCategories: TriviaCategories
  singleCategory: TriviaCategory[]
  multiCategory: TriviaCategory[]
  multiCategoryTitle: string[]
  nestedCategories: any
  loading: "idle" | "pending" | "succeeded" | "rejected"
}

const initialState: CategoryState = {
  allCategories: { trivia_categories: [] },
  singleCategory: [],
  multiCategory: [],
  multiCategoryTitle: [],
  nestedCategories: [],
  loading: "idle",
}

export const categorySlice = createSlice({
  name: "categories",
  initialState,
  reducers: {
    setNestedCategory: (state, action) => {
      state.nestedCategories = state.multiCategory.filter((category) => category.name.includes(action.payload));
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchCategories.fulfilled, (state, action) => {
      state.allCategories = action.payload
      const multi: TriviaCategory[] = []
      const single: TriviaCategory[] = []
      
      action.payload.trivia_categories.forEach((cat: TriviaCategory) =>
        /:/.test(cat.name) ? multi.push({name: cat.name, id: cat.id}) : single.push({name: cat.name, id: cat.id})
      )
      state.singleCategory = single
      state.multiCategory = multi
      
      const category = multi.map((cat) => cat.name.slice(0, cat.name.indexOf(":")))
      state.multiCategoryTitle = [...new Set(category)]
      
      state.loading = "succeeded"
    })
  },
})

export const { setNestedCategory } = categorySlice.actions

export default categorySlice.reducer
