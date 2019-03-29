/* eslint-disable react/destructuring-assignment */
import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withToastManager } from 'react-toast-notifications';
import { PostApi } from '_helpers/Utils';
import CircularProgress from '@material-ui/core/CircularProgress';
import { dialogsActions } from '../../_actions';

function Transition(props) {
  return <Slide direction="up" {...props} />;
}

class AlertDialogSlide extends React.Component {
  state = {
    loading: false,
  };

  toastId = null;

  customToastId = 'xxx-yyy';

  render() {
    let footerAction;
    const { dialogs, closeDialogs, toastManager } = this.props;

    if (this.state.loading)
      footerAction = (
        <DialogContent>
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
            }}
          >
            <CircularProgress disableShrink />
          </div>
        </DialogContent>
      );
    else
      footerAction = (
        <DialogActions>
          <Button
            onClick={() => {
              closeDialogs(false, dialogs.message.ip);
            }}
            color="primary"
          >
            Hủy bỏ
          </Button>
          <Button
            onClick={() => {
              this.setState({ loading: true });
              PostApi('/api/users/installAgent', {
                ipClient: dialogs.message.ip,
              })
                .then(res => {
                  // console.log('in postapi resssss');
                  // console.log(`${res.status}in postapi resssss`);
                  if (!res.status) {
                    // console.log('wtf ress???');
                    return Promise.reject(new Error(res.data));
                  }
                  // console.log('show toaskkkkkkkk');
                  toastManager.add(
                    `Cài đặt thành công lên thiết bị: ${dialogs.message.ip}`,
                    {
                      appearance: 'success',
                      autoDismissTimeout: '5000',
                      autoDismiss: 'true',
                    }
                  );
                })
                .catch(() => {
                  toastManager.add('Cài đặt bị lỗi, hãy thử lại sau!', {
                    appearance: 'error',
                    autoDismissTimeout: '5000',
                    autoDismiss: 'true',
                  });
                })
                .then(ret => {
                  this.setState({ loading: false });
                  closeDialogs(false, dialogs.message.ip);
                });
            }}
            color="primary"
          >
            Đồng ý
          </Button>
        </DialogActions>
      );

    console.log(dialogs);
    return (
      <div>
        <Dialog
          open={dialogs.message.status}
          TransitionComponent={Transition}
          keepMounted
          onClose={() => {
            closeDialogs(false, dialogs.message.ip);
          }}
          aria-labelledby="alert-dialog-slide-title"
          aria-describedby="alert-dialog-slide-description"
        >
          <DialogTitle id="alert-dialog-slide-title">CHÚ Ý</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-slide-description">
              Bạn có chắc chắn muốn cài tác tử lên thiết bị này?
            </DialogContentText>
          </DialogContent>
          {footerAction}
        </Dialog>
      </div>
    );
  }
}

AlertDialogSlide.propTypes = {
  dialogs: PropTypes.object.isRequired,
  closeDialogs: PropTypes.func.isRequired,
  toastManager: PropTypes.object.isRequired,
};

function mapStateToProps(state) {
  const { dialogs } = state;
  return {
    dialogs,
  };
}

const mapDispatchToProps = dispatch => ({
  openDialogs: newStatus => {
    dispatch(dialogsActions.openDialogs(newStatus));
  },
  closeDialogs: (newStatus, ip) => {
    dispatch(dialogsActions.closeDialogs({ status: newStatus, ip }));
  },
});

const ConnectedAlertDialogSlide = connect(
  mapStateToProps,
  mapDispatchToProps
)(AlertDialogSlide);
export default withToastManager(ConnectedAlertDialogSlide);
