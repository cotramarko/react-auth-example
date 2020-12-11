import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'
import IconButton from '@material-ui/core/IconButton'
import MenuIcon from '@material-ui/icons/Menu'
import { useHistory } from 'react-router-dom'

import clsx from 'clsx'
import SwipeableDrawer from '@material-ui/core/SwipeableDrawer'
import List from '@material-ui/core/List'
import Divider from '@material-ui/core/Divider'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import SportsTennisIcon from '@material-ui/icons/SportsTennis'
import ListIcon from '@material-ui/icons/List'
import ShowChartIcon from '@material-ui/icons/ShowChart'
import PersonOutlineIcon from '@material-ui/icons/PersonOutline'
import MeetingRoomIcon from '@material-ui/icons/MeetingRoom'

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1
  },
  menuButton: {
    marginRight: theme.spacing(2)
  },
  title: {
    flexGrow: 1
  },
  list: {
    width: 250
  },
  fullList: {
    width: 'auto'
  }
}))

export default function ButtonAppBar () {
  const classes = useStyles()
  const history = useHistory()

  function handleClickAddResults () {
    history.push('/save')
  }

  function handleClickBadmini () {
    history.push('/')
  }

  const [open, setOpen] = React.useState(false)

  const toggleDrawer = (isOpen) => (event) => {
    if (event && event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return
    }

    setOpen(isOpen)
  }

  const list = (anchor) => (
    <div
      className="left"
      role="presentation"
      onClick={toggleDrawer(anchor, false)}
      onKeyDown={toggleDrawer(anchor, false)}
    >
      <List>
        {[
          { name: 'Leaderboard', icon: <ListIcon/> },
          { name: 'Add Results', icon: <SportsTennisIcon/> },
          { name: 'Statistics', icon: <ShowChartIcon /> }
        ].map(s => (
          <ListItem button key={s.name}>
            <ListItemIcon>
              {s.icon}
            </ListItemIcon>
            <ListItemText primary={s.name} />
          </ListItem>
        ))}
        <Divider />
        <ListItem button key='My Account'>
          <ListItemIcon>
            <PersonOutlineIcon />
          </ListItemIcon>
          <ListItemText primary='My Account' />
        </ListItem>
        <ListItem button key='Logout'>
          <ListItemIcon>
            <MeetingRoomIcon />
          </ListItemIcon>
          <ListItemText primary='Logout' />
        </ListItem>

      </List>
      {/*
      <List>
        {['All mail', 'Trash', 'Spam'].map((text, index) => (
          <ListItem button key={text}>
            <ListItemIcon>{index % 2 === 0 ? <InboxIcon /> : <MailIcon />}</ListItemIcon>
            <ListItemText primary={text} />
          </ListItem>
        ))}
      </List>
      */}
    </div>
  )

  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            edge="start"
            className={classes.menuButton}
            color="inherit"
            aria-label="menu"
            onClick={toggleDrawer(true)}>
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" className={classes.title} onClick={handleClickBadmini}>
            Badmini
          </Typography>
          <Button color="inherit" onClick={handleClickAddResults}>Add Results</Button>
        </Toolbar>
      </AppBar>
      <SwipeableDrawer
        anchor='left'
        open={open}
        onClose={toggleDrawer(false)}
        onOpen={toggleDrawer(true)}
      >
        {list()}
      </SwipeableDrawer>
    </div>
  )
}
