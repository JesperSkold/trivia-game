export const getCategoryQuestionCount = async (categoryID: number) =>
  (
    await fetch(`https://opentdb.com/api_count.php?category=${categoryID}`)
  ).json()
