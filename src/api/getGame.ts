export const getGame = async(payload: any) => (await fetch(`https://opentdb.com/api.php?amount=${payload.questions}&category=${payload.currentCategory.id}&difficulty=${payload.difficulty}&type=${payload.type}`)).json()