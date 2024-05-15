import { Box, Card, CardActions, CardContent, CardHeader, CircularProgress, TextField, Typography, useTheme } from '@mui/material'
import { useState } from 'react'

import ArrowCircleUpRoundedIcon from '@mui/icons-material/ArrowCircleUpRounded'
import ReactMarkdown from 'react-markdown'
import { v4 as uuidv4 } from 'uuid'

import { useEffect } from 'react'
import { chatSync, getUserSessionHistory } from './api'

const defaultMessages = [
  {
    uuid: uuidv4(),
    content:
      'Hi, I am your Jefferies Policy Chatbot Assistant. You can ask me anything about Jefferies company policies like HR, Compensation, Leave, Work-from-home, Benefits etc',
    type: 'AI',
  },
]

const Chat = ({ userSessionId }) => {
  const [sessionId, setSessionId] = useState('new')
  const [chat, setChat] = useState('')
  const [loading, setLoading] = useState(false)
  const theme = useTheme()
  const [messages, setMessages] = useState(defaultMessages)

  const onEnter = async (e) => {
    const messageId = uuidv4()
    try {
      if (e.key === 'Enter') {
        setLoading(true)
        e.preventDefault()
        // add the message to the chat
        setMessages((prevMessages) => [...prevMessages, { uuid: uuidv4(), content: chat, type: 'human' }])
        setChat('')
        // Call the api
        const response = await chatSync(sessionId, chat)
        // Set the new session id
        if (!sessionId || sessionId === 'new') {
          setSessionId(response.body.sessionid)
        }
        // add the ai bot response to the chat
        setMessages((prevMessages) => [...prevMessages, { uuid: messageId, content: response?.body?.answer || '', type: 'ai' }])
        setLoading(false)
      }
    } catch (e) {
      console.error(e)
      setMessages((prevMessages) => [...prevMessages, { uuid: messageId, content: 'Something went wrong', type: 'ai' }])
      setLoading(false)
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      // get all the conversation id
      const userSessionHistory = await getUserSessionHistory(userSessionId)
      if (userSessionHistory.length) {
        const messages = userSessionHistory[0]?.History?.L?.map((messageHistory) => {
          const validMessage = messageHistory?.M
          return {
            uuid: uuidv4(),
            content: validMessage?.data?.M?.content?.S ?? '',
            type: validMessage?.type?.S ?? '',
          }
        })
        setMessages(messages)
      }
      setSessionId(userSessionId)
    }
    // If existing sesion id is present then fetch the data or else start new session
    if (userSessionId) {
      fetchData()
    } else {
      setSessionId('new')
      setMessages(defaultMessages)
    }
  }, [userSessionId])

  
  return (
    <Box justifyContent='space-between' display='flex' flexDirection='column' height='100%'>
      <Card>
        <CardContent style={{ height: '75vh', overflowY: 'scroll' }}>
          {messages.map((message, index) => (
            <Card sx={{ background: theme.palette.common.black }} elevation={24} display={'flex'} key={index}>
              <CardHeader
                sx={{ p: 1 }}
                title={
                  <Box display='flex' gap={1}>
                    {message.type.toLowerCase() === 'ai' ? (
                      <>
                        <img height={30} width={30} src='./ai.png' alt='ai_bot.png' />
                        <Typography variant='body1'>AI Bot</Typography>
                      </>
                    ) : (
                      <>
                        <img height={30} width={30} src='./human.png' alt='human.png' />
                        <Typography variant='body1'>You</Typography>
                      </>
                    )}
                  </Box>
                }
              />
              <CardContent sx={{ pl: 2, pt: 0, pb: 0 }}>
                {(message.type.toLowerCase() === 'you' || message.type.toLowerCase() === 'human') && message.content}
              </CardContent>
              <CardContent sx={{ justifyContent: 'right' }}>
                {message.type.toLowerCase() === 'ai' && <ReactMarkdown>{message.content}</ReactMarkdown>}
              </CardContent>
            </Card>
          ))}
        </CardContent>
        <CardActions>
          <TextField
            onKeyDown={onEnter}
            onChange={(e) => setChat(e.target.value)}
            disabled={loading}
            value={chat}
            fullWidth
            variant='outlined'
            placeholder='Type here....'
            InputProps={{
              endAdornment: loading ? <CircularProgress /> : <ArrowCircleUpRoundedIcon color='primary' fontSize='large' />,
            }}
          />
        </CardActions>
      </Card>
    </Box>
  )
}

export default Chat
