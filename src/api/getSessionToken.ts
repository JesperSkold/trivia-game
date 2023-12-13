export const getSessionToken = async () =>
  (await fetch("https://opentdb.com/api_token.php?command=request")).json()
