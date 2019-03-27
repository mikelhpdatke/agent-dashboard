import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import CssBaseline from '@material-ui/core/CssBaseline';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import { NavLink } from 'react-router-dom';
import Avatar from '@material-ui/core/Avatar';
import SvgIcon from '@material-ui/core/SvgIcon';
import { withToastManager } from 'react-toast-notifications';
import FaceIcon from '@material-ui/icons/Face';
import ViewModuleIcon from '@material-ui/icons/ViewModule';
import { logo } from '../icon/Icon';
// import Table from './Table';
// import Demo from "./DevTable";

function HomeIcon(props) {
  return (
    <SvgIcon {...props}>
      <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
    </SvgIcon>
  );
}

const drawerWidth = 240;

const styles = theme => ({
  root: {
    display: 'flex',
  },
  appBar: {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: drawerWidth,
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
  },
  toolbar: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.default,
    padding: theme.spacing.unit * 3,
  },
  icon: {
    margin: theme.spacing.unit * 2,
  },
  bigAvatar: {
    display: 'block',
    marginLeft: 'auto',
    marginRight: 'auto',
    width: 60,
    height: 60,
  },
  button: {
    display: 'block',
    marginLeft: 'auto',
    marginRight: 'auto',
    marginBottom: '10px',
  },
});

const listTab = [
  {
    title: 'Quản lý người dùng',
    link: '/manageUser',
    Img: FaceIcon,
  },
  {
    title: 'Phân quyền người dùng',
    link: '/manageUser/userTicker',
    Img: ViewModuleIcon,
  },
];
function PermanentDrawerLeft(props) {
  const { classes, toastManager, children } = props;
  return (
    <div className={classes.root}>
      <CssBaseline />
      <AppBar position="fixed" className={classes.appBar}>
        <Toolbar>
          <Typography variant="h6" color="inherit" noWrap>
            ChatBot Web Interface
          </Typography>
        </Toolbar>
      </AppBar>
      <Drawer
        className={classes.drawer}
        variant="permanent"
        classes={{
          paper: classes.drawerPaper,
        }}
        anchor="left"
      >
        <Avatar alt="PTIT" src={logo} className={classes.bigAvatar} />
        <Divider />
        <List>
          {['Trang chủ'].map((text, index) => (
            <NavLink to="/" key={text}>
              <ListItem button key={text}>
                <ListItemIcon>
                  <HomeIcon color="secondary" />
                </ListItemIcon>
                <ListItemText primary={text} />
              </ListItem>
            </NavLink>
          ))}
        </List>
        <Divider />
        <List>
          {listTab.map((obj, index) => (
            <NavLink to={obj.link} key={obj.title}>
              <ListItem button key={obj.title}>
                <ListItemIcon>
                  <obj.Img />
                </ListItemIcon>
                <ListItemText primary={obj.title} />
              </ListItem>
            </NavLink>
          ))}
        </List>
      </Drawer>
      <main className={classes.content}>
        <div className={classes.toolbar} />
        {/*
          <Button
            variant="contained"
            color="secondary"
            className={classes.button}
            onClick={() => {
              toastManager.add('Saved Successfully', { appearance: 'success' });
            }}
          >
            Cập nhật lên cơ sở dữ liệu
          </Button>

          <Demo />
          */}
        {children}
      </main>
    </div>
  );
}

PermanentDrawerLeft.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withToastManager(withStyles(styles)(PermanentDrawerLeft));
