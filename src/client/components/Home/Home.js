/* eslint-disable react/destructuring-assignment */
import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
// import { connect } from 'react-redux';
import PropTypes from 'prop-types';
// import { Link } from 'react-router-dom';
// import Button from '@material-ui/core/Button';
import { PostApi } from '_helpers/Utils';
import { Typography, Grid } from '@material-ui/core';
import ConnectedCard from './Card';

const styles = {
  header: {
    marginBottom: '15px',
  },
};

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      arr: [
        {
          ip: '192.168.0.107',
          port: '22',
          address: 'ffff:192.168.0.107:22',
          active: true,
        },
        {
          ip: '192.168.0.1',
          port: '80',
          address: 'ffff:192.168.0.1:80',
          active: false,
        },
      ],
    };
    this.myInterval = setInterval(() => {
      PostApi('/api/getClients', {}).then(res => {
        console.log(res);
        if (res && res.arr) this.setState({ arr: res.arr });
      });
    }, 10000);
  }

  componentDidMount() {
    PostApi('/api/getClients', {}).then(res => {
      console.log(res);
      if (res && res.arr) this.setState({ arr: res.arr });
    });
  }

  componentWillUnmount() {
    clearInterval(this.myInterval);
  }

  render() {
    const { classes } = this.props;
    const { arr } = this.state;
    return (
      <div>
        <Typography
          variant="h3"
          align="center"
          color="primary"
          className={classes.header}
        >
          Controller
        </Typography>
        <Grid container spacing={24}>
          {arr.map((x, index) => (
            <Grid key={index} item md={4} sm={6} xs={12}>
              <ConnectedCard
                name={x.address}
                ip={x.ip}
                port={x.port}
                card={x.address}
                status={x.active}
              />
            </Grid>
          ))}
        </Grid>
      </div>
    );
  }
}

Home.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Home);
