import React, { Component } from 'react';

export default class Save extends Component {
  constructor(props) {
    super(props)
    this.state = {
      date: new Date().toISOString().split("T")[0],
      setMC: null,
      setFJ: null
    }
  }

  handleInputChange = (event) => {
    const { value, name } = event.target;
    this.setState({
      [name]: value
    });
  }

  onSubmit = (event) => {
    event.preventDefault();
    fetch('api/entry', {
      method: 'POST',
      body: JSON.stringify({
        date: this.state.date,
        setMC: Number(this.state.setMC),
        setFJ: Number(this.state.setFJ)
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(res => {
        if (res.status === 200) {
          this.props.history.push('/');
          window.location.reload();
        } else {
          const error = new Error(res.error);
          throw error;
        }
      })
      .catch(err => {
        console.error(err);
        //alert('Error logging in please try again');
      });
  }

  render() {
    return (
      <form onSubmit={this.onSubmit}>
        <h1>Save Results</h1>
        <input
          type="date"
          name="date"
          placeholder="Enter date"
          value={this.state.date}
          onChange={this.handleInputChange}
          required
        />
        <input
          type="number"
          name="setMC"
          placeholder="Enter sets for MC"
          value={this.state.setMC}
          onChange={this.handleInputChange}
          required
        />
        <input
          type="number"
          name="setFJ"
          placeholder="Enter sets for FJ"
          value={this.state.setFJ}
          onChange={this.handleInputChange}
          required
        />
        <input type="submit" value="Submit" />
      </form>
    );
  }

  render() {
    return (
      <div className='mt-5 ml-5 mr-5'>
        <form onSubmit={this.onSubmit}>
          <h3>Save Results</h3>

          <div className="form-group">
            <label>Date</label>
            <input
              type="date"
              name="date"
              className="form-control"
              placeholder="Enter date"
              value={this.state.date}
              onChange={this.handleInputChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Sets MC</label>
            <input
              type="number"
              name="setMC"
              className="form-control"
              placeholder="Enter sets for MC"
              value={this.state.setMC}
              onChange={this.handleInputChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Sets FJ</label>
            <input
              type="number"
              name="setFJ"
              className="form-control"
              placeholder="Enter sets for FJ"
              value={this.state.setFJ}
              onChange={this.handleInputChange}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary btn-block">Submit</button>
        </form>
      </div>
    );
  }
}