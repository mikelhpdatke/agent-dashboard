import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
// import { Link } from 'react-router-dom';
import Button from '@material-ui/core/Button';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import TextField from '@material-ui/core/TextField';
// import TextareaAutosize from 'react-textarea-autosize';
// eslint-disable-next-line import/no-unresolved
import openSocket from 'socket.io-client';
import CircularProgress from '@material-ui/core/CircularProgress';
import Snackbar from '@material-ui/core/Snackbar';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import { homeActions } from '_actions/index';
// import { servicesActions } from '../../_actions';
import { PostApi, ip } from '_helpers/Utils';
import { Typography, Grid, Divider } from '@material-ui/core';
import Card from "components/Card/Card.jsx";
import CardHeader from "components/Card/CardHeader.jsx";
import CardBody from "components/Card/CardBody.jsx";
import CardFooter from "components/Card/CardFooter.jsx";

const socket = openSocket(ip.server);
function subscribeToTimer(cb) {
  socket.on('timer', res => cb(null, res));
}

const styles = theme => ({
  cardCategoryWhite: {
    "&,& a,& a:hover,& a:focus": {
      color: "rgba(255,255,255,.62)",
      margin: "0",
      fontSize: "14px",
      marginTop: "0",
      marginBottom: "0"
    },
    "& a,& a:hover,& a:focus": {
      color: "#FFFFFF"
    }
  },
  cardTitleWhite: {
    color: "#FFFFFF",
    marginTop: "0px",
    minHeight: "auto",
    fontWeight: "300",
    fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
    marginBottom: "3px",
    textDecoration: "none",
    "& small": {
      color: "#777",
      fontSize: "65%",
      fontWeight: "400",
      lineHeight: "1"
    }
  },
  root: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: theme.palette.background.paper,
  },
  progress: {
    margin: theme.spacing.unit * 2,
  },
  h1: {
    textAlign: 'center',
    backgroundColor: 'rgba(45, 45, 45, 0.1)',
    padding: '2px',
    color: 'red',
    fontSize: '40px',
    marginTop: '3px',
  },
  contrainer: {
    marginTop: '50px',
    display: 'flex',
    justifyContent: 'center',
  },
  close: {
    padding: theme.spacing.unit / 2,
  },
  card: {
    minWidth: 275,
    border: '3px solid rgb(131, 167, 233)',
    borderRadius: '20px',
    margin: '5px 5px',
    padding: '4px',
  },
});

const options = [
  'Get PID and MD5 data',
  'Get network data',
  'Get syscall data',
];

class Services extends Component {
  constructor(props) {
    super(props);
    this.state = {
      anchorEl: null,
      selectedIndex: 1,
      pid: 0,
      dataRecevied: '',
      sendding: false,
      openSnackBar: false,
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleClickSnackBar = this.handleClickSnackBar.bind(this);
    this.handleCloseSnackBar = this.handleCloseSnackBar.bind(this);

    subscribeToTimer((err, res) => {
      this.setState(state => {
        let newData = state.dataRecevied;
        newData += res;
        if (newData.length > 10) {
          newData = 'hello';
        }
        return { dataRecevied: newData, sendding: false, openSnackBar: true };
      });
    });
  }

  handleClickSnackBar = () => {
    this.setState({ openSnackBar: true });
  };

  handleCloseSnackBar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    this.setState({ openSnackBar: false });
  };

  handleClickListItem = event => {
    this.setState({ anchorEl: event.currentTarget });
  };

  handleMenuItemClick = (event, index) => {
    this.setState({ selectedIndex: index, anchorEl: null, dataRecevied: '' });
  };

  handleClose = () => {
    this.setState({ anchorEl: null });
  };

  handleChange(e) {
    const { name } = e.target;
    const { value } = e.target;
    if (name === 'pid') {
      console.log('in HanleChane pid');
      this.setState({ pid: value }, () => {
        console.log(this.state);
      });
    }
  }

  render() {
    const { classes } = this.props;
    const { anchorEl } = this.state;
    let sendState;
    const { sendding, pid, selectedIndex, openSnackBar } = this.state;
    const { message } = this.props;
    if (sendding === true) {
      sendState = (
        <div className="col-1">
          <CircularProgress className={classes.progress} />
        </div>
      );
    } else {
      sendState = (
        <div className="col-1">
          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              // console.log(this.state);
              // this.setState({ dataRecevied: "Hello" });
              const data = {
                id: message.id,
                task: selectedIndex + 1,
                pid,
              };
              this.setState({ sendding: true }, () => {
                PostApi('api/fetch', data).then(() => {
                  console.log('Run send_cmd ok!!!');
                  // setInterval(() => {
                  //  this.setState({ sendding: false, openSnackBar:true });
                  // }, 5000);
                });
              });
            }}
          >
            Send
          </Button>
        </div>
      );
    }
    // console.log(this.props.title); this.props.message.card
    return (
      <React.Fragment>
        <Snackbar
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
          open={openSnackBar}
          autoHideDuration={5000}
          onClose={this.handleCloseSnackBar}
          ContentProps={{
            'aria-describedby': 'message-id',
          }}
          message={<span id="message-id">Successfully received</span>}
          action={[
            <Button
              key="undo"
              color="secondary"
              size="small"
              onClick={this.handleCloseSnackBar}
            >
              UNDO
            </Button>,
            <IconButton
              key="close"
              aria-label="Close"
              color="inherit"
              className={classes.close}
              onClick={this.handleCloseSnackBar}
            >
              <CloseIcon />
            </IconButton>,
          ]}
        />
        <Card>
          <CardHeader color='primary'>
            <Typography variant='h3' className={classes.cardTitleWhite}>
              {`${message.name}`}
            </Typography>
          </CardHeader>
          <CardBody>
            <Grid
              container
              spacing={24}
            >
              <Grid
                item
                md={1}
                xs={0}
              ></Grid>
              <Grid
                item
                md={selectedIndex === 2 ? 5 : 10}
                xs={12}
              >
                <List component="nav">
                  <ListItem
                    button
                    aria-haspopup="true"
                    aria-controls="lock-menu"
                    aria-label="Function"
                    onClick={this.handleClickListItem}
                  >
                    <ListItemText
                      primary="Function"
                      secondary={options[selectedIndex]}
                    />
                  </ListItem>
                </List>
                <Menu
                  id="lock-menu"
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={this.handleClose}
                >
                  {options.map((option, index) => (
                    <MenuItem
                      key={option}
                      selected={index === selectedIndex}
                      onClick={event => this.handleMenuItemClick(event, index)}
                    >
                      {option}
                    </MenuItem>
                  ))}
                </Menu>
              </Grid>
              <Grid
                item
                md={selectedIndex === 2 ? 5 : 0}
                xs={selectedIndex === 2 ? 12 : 0}
              >
                {selectedIndex === 2 ? (
                  <TextField
                    id="outlined-uncontrolled"
                    label="PID"
                    name="pid"
                    value={pid}
                    className={classes.textField}
                    onChange={this.handleChange}
                    margin="normal"
                    variant="outlined"
                    fullWidth
                  />
                ) : null}
              </Grid>
              <Grid
                item
                md={1}
                xs={0}
              >
              </Grid>
            </Grid>
            <Divider></Divider>
          </CardBody>
          <CardFooter>
            {sendState}
          </CardFooter>
        </Card>
      </React.Fragment>
    );
  }
}

Services.propTypes = {
  classes: PropTypes.object.isRequired,
  message: PropTypes.object.isRequired,
};

const mapDispatchToProps = dispatch => ({
  active: newStatus => {
    dispatch(homeActions.active(newStatus));
  },
  inactive: newStatus => {
    dispatch(homeActions.inactive(newStatus));
  },
});

function mapStateToProps(state) {
  const { message } = state.services;
  return {
    message,
  };
}

const ConnectedServices = connect(
  mapStateToProps,
  mapDispatchToProps
)(Services);

export default withStyles(styles)(ConnectedServices);
