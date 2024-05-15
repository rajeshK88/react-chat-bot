import axios from 'axios'

export const getUserSessions = async () => {
  const endpoint = `${process.env.REACT_APP_API_HOST}/userSessions`
  const headers = {
    'X-API-Key': `${process.env.REACT_APP_API_KEY}`,
  }
  const payload = {
    UserId: `${process.env.REACT_APP_USER_ID}`,
  }

  return axios
    .post(endpoint, payload, { headers })
    .then((response) => {
      return response.data?.data
    })
    .catch((error) => {
      console.error(error)
      return [] as string[]
    })
}
