import { Box, Card, CardActions, CardContent, CardHeader, CircularProgress, TextField, Typography, useTheme } from '@mui/material'
import { useState } from 'react'

import ArrowCircleUpRoundedIcon from '@mui/icons-material/ArrowCircleUpRounded'
import axios from 'axios'
import ReactMarkdown from 'react-markdown'
import { v4 as uuidv4 } from 'uuid'

import { useEffect } from 'react'

const Chat = () => {
  const [chat, setChat] = useState('')
  const [loading, setLoading] = useState(false)
  const theme = useTheme()
  const [messages, setMessages] = useState([
    {
      uuid: uuidv4(),
      content:
        'Hi, I am your Jefferies Policy Chatbot Assistant. You can ask me anything about Jefferies company policies like HR, Compensation, Leave, Work-from-home, Benefits etc',
      type: 'AI',
    },
  ])

  const onEnter = async (e) => {
    const messageId = uuidv4()
    try {
      if (e.key === 'Enter') {
        setLoading(true)
        e.preventDefault()
        setMessages((prevMessages) => [...prevMessages, { uuid: uuidv4(), content: chat, type: 'You' }])
        setChat('')
        const headers = {
          'X-API-Key': process.env.REACT_APP_API_KEY,
        }

        const response = await axios.post(
          `${process.env.REACT_APP_API_HOST}/chat`,
          {
            userid: 'ssahoo1',
            sessionid: '938840d0938dmdi',
            question: chat,
          },
          {
            headers,
          }
        )
        const res = response.data.body.answer
        setMessages((prevMessages) => [...prevMessages, { uuid: messageId, content: res, type: 'AI' }])
        setLoading(false)
      }
    } catch (e) {
      console.error(e)
      setMessages((prevMessages) => [...prevMessages, { uuid: messageId, content: 'Something went wrong', type: 'AI' }])
      setLoading(false)
    }
  }

  useEffect(() => {
   // console.log(messages)
  }, [messages])

  const handleChange = (e) => {
    setChat(e.target.value)
  }

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
                      {message.type === 'AI' ? (
                        <>
                          <img height={30} width={30} src='./ai.png' alt='ai_bot.png'/>
                          <Typography variant='body1'>{message.type}</Typography>
                        </>
                      ) : (
                        <>
                          <img height={30} width={30} src='./human.png' alt='human.png'/>
                          <Typography variant='body1'>{message.type}</Typography>
                        </>
                      )}
                    </Box>
                  }></CardHeader>
                <CardContent sx={{ pl: 2, pt: 0, pb: 0 }}>{message.type === 'You' && message.content}</CardContent>
                <CardContent sx={{ justifyContent: 'right' }}>
                  {message.type === 'AI' && (
                    <>
                      <ReactMarkdown>{message.content}</ReactMarkdown>
                    </>
                  )}
                </CardContent>
              </Card>
          ))}
        </CardContent>
        <CardActions>
          <TextField
            onKeyDown={onEnter}
            disabled={loading}
            value={chat}
            fullWidth
            onChange={handleChange}
            variant='outlined'
            placeholder='Type here....'
            InputProps={{
              endAdornment: loading ? <CircularProgress /> : <ArrowCircleUpRoundedIcon color='primary' fontSize='large'></ArrowCircleUpRoundedIcon>,
            }}
          />
        </CardActions>
      </Card>
    </Box>
  )
}

export default Chat
