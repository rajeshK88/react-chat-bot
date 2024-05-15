import QuestionAnswerIcon from '@mui/icons-material/QuestionAnswer'
import AppBar from '@mui/material/AppBar'
import Box from '@mui/material/Box'
import CssBaseline from '@mui/material/CssBaseline'
import Divider from '@mui/material/Divider'
import Drawer from '@mui/material/Drawer'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import * as React from 'react'
import Chat from './Chat'
import { getUserSessions } from './api'

const drawerWidth = 240

export default function ChatDashboard() {
  const [userSessions, setUserSessions] = React.useState([])
  const [userSessionId, setUserSessionId] = React.useState('')

  React.useEffect(() => {
    const fetchData = async () => {
      // get all the conversation id
      const sessions = await getUserSessions()      
      setUserSessions(sessions)
    }

    fetchData()
  }, [])

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar position='fixed' sx={{ width: `calc(100% - ${drawerWidth}px)`, ml: `${drawerWidth}px` }}>
        <Toolbar>
          <Typography variant='h5' noWrap component='div'>
            Jefferies Policy Chatbot
          </Typography>
        </Toolbar>
      </AppBar>
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
          },
        }}
        variant='permanent'
        anchor='left'>
        <Toolbar />

        <Divider />
        <List>
          {userSessions.map((session, index) => (
            <ListItem key={index} disablePadding onClick={() => setUserSessionId(session[0]?.SessionId?.S)}>
              <ListItemButton>
                <ListItemIcon>
                  <QuestionAnswerIcon />
                </ListItemIcon>
                <ListItemText primary={JSON.parse(session[0]?.chatTitleMessage?.S || '')}/>
              </ListItemButton>
            </ListItem>
          ))}
        </List>
        <Divider />
      </Drawer>
      <Box component='main' sx={{ flexGrow: 1, bgcolor: 'background.default', p: 3 }}>
        <Toolbar />
        <Chat userSessionId={userSessionId} />
      </Box>
    </Box>
  )
}
