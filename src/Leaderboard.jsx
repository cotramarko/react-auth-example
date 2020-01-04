import React, { Component } from 'react';
import Table from 'react-bootstrap/Table'

export default class Leaderboard extends Component {
  constructor() {
    super()
    this.state = { entries: [] }
    this.getEntries()
  }

  getEntries() {
    fetch('/api/entry', {
      method: 'GET'
    })
      .then(res => res.json())
      .then(data => {
        data.sort(function (a, b) {
          // Turn your strings into dates, and then subtract them
          // to get a value that is either negative, positive, or zero.
          return new Date(b.date) - new Date(a.date);
        });
        this.setState({ entries: data })
      });
  }

  singleEntry(idx, entry) {
    console.log(entry)
    const date = entry.date.split("T")[0];
    let outcome;
    let bg;
    if (entry.setMC > entry.setFJ) {
      outcome = "Marko"
      bg = "#FFBF69"
    } else if (entry.setMC < entry.setFJ) {
      outcome = "Fredrik"
      bg = "#CBF3F0"
    } else {
      outcome = "Draw"
      bg = "#FFFFFF"
    }
    return <tr key={idx}>
      <td scope="row" style={{ textAlign: "center", backgroundColor: bg }}>{date}</td>
      <th style={{ textAlign: "center", backgroundColor: bg }}>{entry.setMC} - {entry.setFJ}</th>
      <td style={{ textAlign: "center", backgroundColor: bg }}>{outcome}</td>
    </tr>;
  }

  populateEntries() {
    if (this.state.entries.length < 1)
      return;

    const r = this.state.entries.map(
      (entry, idx) => this.singleEntry(idx, entry)
    )
    return r;
  }

  render() {
    return (
      <div className='mt-1 ml-1 mr-1'>
        <h1 style={{ textAlign: "center" }}>Leaderboard</h1>
        <Table striped bordered hover responsive size="sm">
          <thead>
            <tr>
              <th scope="col" style={{ textAlign: "center" }}>Date</th>
              <th scope="col" style={{ textAlign: "center" }}>Result (MC vs FJ)</th>
              <th scope="col" style={{ textAlign: "center" }}>Winner</th>
            </tr>
          </thead>
          <tbody>
            {this.populateEntries()}
          </tbody>
        </Table>
      </div>
    )
  }

}