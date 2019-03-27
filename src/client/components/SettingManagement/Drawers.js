import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import { connect } from 'react-redux';
import { NavLink } from 'react-router-dom';
import SvgIcon from '@material-ui/core/SvgIcon';
import FaceIcon from '@material-ui/icons/Face';
import SupervisedUserCircle from '@material-ui/icons/SupervisedUserCircle';
import { drawerActions } from '../../_actions';

const styles = {
  list: {
    width: 250,
  },
  fullList: {
    width: 'auto',
  },
};
function HomeIcon(props) {
  return (
    <SvgIcon {...props}>
      <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
    </SvgIcon>
  );
}
class TemporaryDrawer extends React.Component {
  constructor(props) {
    super(props);
    const { closed } = this.props;
    closed(false);
  }

  toggleDrawer = (side, open) => () => {
    if (open === true) {
      // eslint-disable-next-line react/destructuring-assignment
      this.props.opened(true);
    } else {
      // eslint-disable-next-line react/destructuring-assignment
      this.props.closed(false);
    }
  };

  render() {
    const { classes, authentication } = this.props;
    const currentUser = JSON.parse(localStorage.getItem('user'));
    if (currentUser == null) return <div />;
    // console.log(currentUser);
    const fullList = (
      <div className={classes.fullList}>
        <List>
          <NavLink to="/">
            <ListItem button>
              <ListItemIcon>
                <HomeIcon className={classes.icon} color="primary" />
              </ListItemIcon>
              <ListItemText primary={`Chào ${currentUser.username}`} />
            </ListItem>
          </NavLink>
          <NavLink to="/editInfo">
            <ListItem button>
              <ListItemIcon>
                <FaceIcon />
              </ListItemIcon>
              <ListItemText primary="Chỉnh sửa thông tin" />
            </ListItem>
          </NavLink>
        </List>
        <Divider />
        <List>
          {['Quản lý người dùng'].map((text, index) => (
            <NavLink to="/manageUser" key={text}>
              <ListItem button key={text}>
                <ListItemIcon>
                  <SupervisedUserCircle />
                </ListItemIcon>
                <ListItemText primary={text} />
              </ListItem>
            </NavLink>
          ))}
        </List>
        <Divider />
        <List>
          {['Logout'].map(text => (
            <ListItem button key={text} component="a" href="/login">
              <ListItemIcon>
                <img
                  alt=""
                  src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAN5SURBVGhD7ZpZqE1RGMeveQoRmYoHyayQoogHCUXKrJQHkZQopRQZkyjhiQc8KKEM4YESKUoheUFKMmbKVObp9ztadXMvzt5nT1f3X786e5291trfXnut9e3v21X1+o/VHebBbjgPj+Et/IBP8AxuwRFYDeOhGRRC7WEZXAUvOCoaegjGQi7qAFvgHYSLeg5e1GIYA12hOaiG0A76wDTYAJfhO4T612EGZKIGsABegp17IcdgEjSBqNLY5XAfgkHnoC+kJkfhJIQOj8NASEKNwfnlvLLtD+ANS1z9INy1J+AIpKE2sBPCI7cPNDIRDYPwKJ2FzpC2psMbsM+j0BQqko+Oy6YNHoCKG4ygwRD69jFuBLHknAiP035w5claPtLBmE0WRJWr0ymwAVeRLEfid40EN1SvZbQFUeSKYUUndicLctYcuA2DSkdlqiO8AA1Ja3XKRO7YGuEEq7PSd9LtcB1ParOLq7YQe4FZCkUYjQHwFbyOWAvNNSjC3HDTfQpeywmIZEwPsKITPY4DmLTcQ2IZo9NmpYOlo2IoljG7wAq+TxRJkY25AJ4ceffMQJGMeQie2K10VDyVbUwIFLQoHVUu3/6GJsxcCH7XH43xz2+/flYsl8+PYJtpsg5q6Av4ZxIy6HAYrqRAGBE3zIlQQ6/AE3QNiqqVEIyYZUFtugme5KQqosoyQunXeOLk0lGxVLYRaiN4ssGzIimSEWocWOFi6agYimyEagnvwUpdLMhZsYwIMuRjZcOYeWo4xDZCTQAbuAuJRfhiyDdVA+JTSkcxZBjoBmiMbn2dluFKDdGJbG1BXZWjYsZJYwwoF0FmtkZB5GBEfzC0bzQl7w3SmK+erjd2qgVRtRCs/BryDA2FOJsx4Njbwl6wkQfQ24KMtQrsX493hAVx5bAGH8w7Yq4kCzkXNoP9+nqRSG7Riea7hY2mlhKrJmPPpyGMROy9pDY5MlshpMTMJfaEJOVq6ausGQD7eASmFFKRd8c0tB3pl+0APxSoRD5GroyXwHblDKSe4tN9MAamH2Snn8GkkD6RWa5yZWptDdyBYICLykzIVL1gD1QPMhi80MXR+VwLS2A+uJSvgG3g3Q7ptICfdiyCVpCbfMd3AXBUqn8J8S/uwXbwK4k88pN/lR7zEJgNfjjjZuZjqKuzHvxuxRe4LFLc9cpRVVU/AQxQNxvPAf7SAAAAAElFTkSuQmCC"
                />
              </ListItemIcon>
              <ListItemText primary={text} />
            </ListItem>
          ))}
        </List>
      </div>
    );
    // console.log('in Drawerssssssssssssss state=', this.props.message);
    return (
      <div>
        <Drawer
          anchor="right"
          // eslint-disable-next-line react/destructuring-assignment
          // eslint-disable-next-line react/prop-types
          // eslint-disable-next-line react/destructuring-assignment
          open={this.props.message}
          onClose={this.toggleDrawer('right', false)}
        >
          <div
            tabIndex={0}
            role="button"
            onClick={this.toggleDrawer('right', false)}
            onKeyDown={this.toggleDrawer('right', false)}
          >
            {fullList}
          </div>
        </Drawer>
      </div>
    );
  }
}

TemporaryDrawer.propTypes = {
  classes: PropTypes.object.isRequired,
  closed: PropTypes.func.isRequired,
  opened: PropTypes.func.isRequired,
  message: PropTypes.bool.isRequired,
  authentication: PropTypes.any.isRequired,
};

const mapDispatchToProps = dispatch => ({
  opened: newStatus => {
    dispatch(drawerActions.opened(newStatus));
  },
  closed: newStatus => {
    dispatch(drawerActions.closed(newStatus));
  },
});

function mapStateToProps(state) {
  const { message } = state.drawer;
  const { authentication } = state;
  return {
    message,
    authentication,
  };
}

const ConnectedDrawers = connect(
  mapStateToProps,
  mapDispatchToProps
)(TemporaryDrawer);
export default withStyles(styles)(ConnectedDrawers);
