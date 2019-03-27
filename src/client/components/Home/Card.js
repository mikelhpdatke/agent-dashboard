/* eslint-disable react/prop-types */
/* eslint-disable react/destructuring-assignment */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import Card from 'components/Card/Card.jsx';
import CardHeader from 'components/Card/CardHeader.jsx';
import CardBody from 'components/Card/CardBody.jsx';
import CardFooter from 'components/Card/CardFooter.jsx';
import { Grid } from '@material-ui/core';
import { verifiedIcon, warningIcon } from './icon/Icon';
import ConnectedAlertDialogSlide from './Dialogs';
import { homeActions, servicesActions, dialogsActions } from '../../_actions';

const styles = theme => ({
  cardCategoryWhite: {
    '&,& a,& a:hover,& a:focus': {
      color: 'rgba(255,255,255,.62)',
      margin: '0',
      fontSize: '14px',
      marginTop: '0',
      marginBottom: '0',
    },
    '& a,& a:hover,& a:focus': {
      color: '#FFFFFF',
    },
  },
  cardTitleWhite: {
    textTransform: 'none',
    color: '#FFFFFF',
    marginTop: '0px',
    minHeight: 'auto',
    fontWeight: '300',
    fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
    marginBottom: '3px',
    textDecoration: 'none',
    '& small': {
      color: '#777',
      fontSize: '65%',
      fontWeight: '400',
      lineHeight: '1',
    },
  },
  roundOkIcon: {
    boxSizing: 'border',
    width: 25,
    height: 25,
    borderRadius: '50%',
    backgroundColor: 'green',
  },
  roundErrIcon: {
    boxSizing: 'border',
    width: 25,
    height: 25,
    borderRadius: '50%',
    backgroundColor: 'red',
  },
});
class SimpleCard extends Component {
  render() {
    // console.log(this.props.status);
    const { classes, status, send, openDialogs, ip } = this.props;
    // let status = "ACTIVE";
    // console.log(this.props.card);
    // console.log(this.props.message[this.props.card]+'??????wtf');
    // if (this.props.message[this.props.card] == false) status = "INACTIVE";
    // const textModal = "Connect";
    // console.log(this.props.status, this.props.status == 'INACTIVE');
    let button;
    let statusButton;
    if (!status) {
      button = (
        <Button
          onClick={() => {
            console.log('openedddddddddd');
            openDialogs(true, ip);
          }}
          component={Link}
          to="#"
          variant="contained"
        >
          Kết nối
        </Button>
      );
      statusButton = <div className={classes.roundErrIcon} />;
    } else {
      button = (
        <Button
          onClick={() => {
            send({ name: this.props.name, id: this.props.card });
          }}
          component={Link}
          to="/services"
          variant="contained"
        >
          Phân tích
        </Button>
      );
      statusButton = <div className={classes.roundOkIcon} />;
    }

    return (
      <React.Fragment>
        <Card>
          <CardHeader color={status ? 'success' : 'danger'}>
            <Typography variant="h6" className={classes.cardTitleWhite}>
              {`Client: ${this.props.name}`}
            </Typography>
            <Typography
              variant="subtitle1"
              className={classes.cardCategoryWhite}
            >
              {`${this.props.name}`}
            </Typography>
          </CardHeader>
          <CardBody>
            <Grid container spacing={24}>
              <Grid item xs={10}>
                <Typography variant="h6">{`IP: ${this.props.ip}`}</Typography>
                <Typography variant="body1">
                  {`PORT: ${this.props.port}`}
                </Typography>
              </Grid>
              <Grid item xs={2}>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'center',
                  }}
                >
                  {statusButton}
                </div>
              </Grid>
            </Grid>
          </CardBody>
          <CardFooter>
            <Grid
              container
              direction="row"
              justify="space-around"
              alignItems="center"
            >
              <Grid item>
                <Button
                  color={status ? 'primary' : 'secondary'}
                  variant="contained"
                >
                  {status ? 'Đang chạy' : 'Đã dừng'}
                </Button>
              </Grid>

              <Grid item>{button}</Grid>
            </Grid>
            <ConnectedAlertDialogSlide />
          </CardFooter>
        </Card>
      </React.Fragment>
    );
  }
}

SimpleCard.propTypes = {
  classes: PropTypes.object.isRequired,
  // status: PropTypes.string.isRequired,
  send: PropTypes.func.isRequired,
  openDialogs: PropTypes.func.isRequired,
};

const mapDispatchToProps = dispatch => ({
  active: newStatus => {
    dispatch(homeActions.active(newStatus));
  },
  inactive: newStatus => {
    dispatch(homeActions.inactive(newStatus));
  },
  send: newStatus => {
    dispatch(servicesActions.send(newStatus));
  },
  openDialogs: (newStatus, ip) => {
    dispatch(dialogsActions.openDialogs({ status: newStatus, ip }));
  },
});

function mapStateToProps(state) {
  const { message } = state.home;
  return {
    message,
  };
}

const ConnectedCard = connect(
  mapStateToProps,
  mapDispatchToProps
)(SimpleCard);

export default withStyles(styles)(ConnectedCard);
