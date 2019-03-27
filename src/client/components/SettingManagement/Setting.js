/* eslint-disable no-useless-concat */
/* eslint-disable class-methods-use-this */
/* eslint-disable jsx-a11y/label-has-for */
/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { Component } from 'react';
import './setting.css';
import '../App.css';

class Setting extends Component {
  constructor(props) {
    super(props);
    // this.state = {
    //   ipServer: '0.0.0.0',
    //   timeInterval: 3000,
    // };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  handleSubmit(event) {
    fetch('http://' + 'localhost:8000' + '/api/setting', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ timeInterval: 233232 }),
    })
      .then(res => {
        if (res.status >= 400) {
          throw new Error('Bad respond from server');
        }
        // console.log(res);
        return res;
      })
      .then(res => {
        alert(`Your favorite flavor is: ${res}`);
      })
      .catch(err => {
        alert(err);
      });
    event.preventDefault();
    // message.info('This is a normal message');
  }

  handleChange(event) {
    this.setState({
      [event.target.name]: event.target.value,
    });
    // console.log(this.state);
  }

  render() {
    return (
      <div>
        <h4 className="h4Title">Thiết lập</h4>
        <div id="formSubmitSetting">
          <form
            className="needs-validation"
            onSubmit={this.handleSubmit}
            noValidate
          >
            <div className="form-row">
              <div className="col-md-6 mb-3">
                <label htmlFor="validationCustom03">IP Máy chủ</label>
                <input
                  type="text"
                  name="ipServer"
                  onChange={this.handleChange}
                  className="form-control"
                  id="validationCustom03"
                  placeholder="0.0.0.0"
                  required
                />
                <div className="invalid-feedback">
                  Please provide a valid IP.
                </div>
              </div>
              <div className="col-md-6 mb-3">
                <label htmlFor="validationCustom04">Thời gian cập nhật</label>
                <input
                  type="number"
                  name="timeInterval"
                  onChange={this.handleChange}
                  className="form-control"
                  id="validationCustom04"
                  placeholder="Đơn vị: Giây"
                  required
                />
                <div className="invalid-feedback">
                  Please provide a valid input. For ex: 5
                </div>
              </div>
            </div>
            <div className="container">
              <div className="row">
                <div className="col-12 text-center">
                  <button type="submit" className="btn btn-primary">
                    Submit
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    );
  }
}

export default Setting;
