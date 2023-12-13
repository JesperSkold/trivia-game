import { Settings } from "../interface/settings"

export const getGame = async (payload: Settings, sessionToken: string) => {
  const difficulty =
    payload.difficulty === "random" ? "" : `&difficulty=${payload.difficulty}`
  const type = payload.type === "random" ? "" : `&type=${payload.type}`
  const token = `&token=${sessionToken}` || ""
  return (
    await fetch(
      `https://opentdb.com/api.php?amount=${payload.nQuestions}&category=${payload.currentCategory.id}${difficulty}${type}${token}`
    )
  ).json()
}
