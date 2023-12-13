export const getQuickGame = async (sessionToken: string) =>
  (await fetch(`https://opentdb.com/api.php?amount=10&token=${sessionToken}`)).json()
