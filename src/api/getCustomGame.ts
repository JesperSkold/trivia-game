export const getGame = async (payload: any) => {
  const difficulty = payload.difficulty === "random" ? "" : `&difficulty=${payload.difficulty}`
  const type = payload.type === "random" ? "" : `&type=${payload.type}`
  return (
    await fetch(
      `https://opentdb.com/api.php?amount=${payload.questions}&category=${payload.currentCategory.id}${difficulty}${type}`
    )
  ).json()
}
