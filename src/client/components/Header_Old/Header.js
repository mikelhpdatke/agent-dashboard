/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { withToastManager, ToastProvider } from 'react-toast-notifications';
// import ConnectedDrawers from '../SettingManagement/Drawers';
import { drawerActions } from '../../_actions/drawer.actions';
// import { logo, settingIcon } from '../icon/Icon';
import { history } from '../../_helpers';
import AdminHeader from './AdminHeaderPage';

const ItemLink = ({ to, titleName }) => (
  <NavLink
    style={{ color: 'black', fontWeight: 'bold' }}
    className="nav-item nav-link"
    exact
    to={to}
    activeStyle={{
      fontWeight: 'bold',
      color: 'red',
      textDecoration: 'underline',
    }}
  >
    {titleName}
  </NavLink>
);

ItemLink.propTypes = {
  to: PropTypes.string.isRequired,
  titleName: PropTypes.string.isRequired,
};

class Header extends Component {
  componentDidMount() {
    // notification
  }

  render() {
    const { opened, children } = this.props;
    console.log(this.props);
    if (
      history.location.pathname === '/login' ||
      history.location.pathname === '/register'
    )
      return <div>{children}</div>;
    return (
      <ToastProvider placement="bottom-right">
        <AdminHeader>{children}</AdminHeader>
      </ToastProvider>
    );
  }
}

Header.propTypes = {
  opened: PropTypes.func.isRequired,
};
function mapStateToProps(state) {
  const user = state;
  return {
    user,
  };
}

const mapDispatchToProps = dispatch => ({
  opened: newStatus => {
    dispatch(drawerActions.opened(newStatus));
  },
  closed: newStatus => {
    dispatch(drawerActions.closed(newStatus));
  },
});
const connectedHeaderPage = withToastManager(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(Header)
);
export { connectedHeaderPage };
