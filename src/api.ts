import axios from 'axios'

const HEADERS = {
  'X-API-Key': `${process.env.REACT_APP_API_KEY}`,
}

export const getUserSessions = async () => {
  const endpoint = `${process.env.REACT_APP_API_HOST}/userSessions`
  const payload = {
    UserId: `${process.env.REACT_APP_USER_ID}`,
  }

  return axios
    .post(endpoint, payload, { headers: HEADERS })
    .then((response) => {
      return response.data?.data
    })
    .catch((error) => {
      console.error(error)
      return []
    })
}

export const getUserSessionHistory = async (sessionId: string) => {
  const endpoint = `${process.env.REACT_APP_API_HOST}/sessionHistory`
  const payload = {
    SessionId: sessionId,
  }

  return axios
    .post(endpoint, payload, { headers: HEADERS })
    .then((response) => {
      return response.data?.data
    })
    .catch((error) => {
      console.error(error)
      return []
    })
}
