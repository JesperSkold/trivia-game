export const resetSessionToken = async (sessionToken: string) =>
  (
    await fetch(
      `https://opentdb.com/api_token.php?command=reset&token=${sessionToken}`
    )
  ).json()
