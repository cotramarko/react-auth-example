import React, { Component } from 'react'
import Table from 'react-bootstrap/Table'

export default class Leaderboard extends Component {
  constructor () {
    super()
    this.state = { entries: [] }
    this.getEntries()
  }

  getEntries () {
    fetch('/api/entry', {
      method: 'GET'
    })
      .then(res => res.json())
      .then(data => data.filter(function (el) {
        console.log(el)
        if (el.locked) {
          return true
        } else {
          return false
        }
      }))
      .then(data => {
        data.sort(function (a, b) {
          // Turn your strings into dates, and then subtract them
          // to get a value that is either negative, positive, or zero.
          return new Date(b.date) - new Date(a.date)
        })
        this.setState({ entries: data })
      })
  }

  getTotalPointsPerPlyer (entry) {
    const reduceSum = (arr) => arr.reduce((a, b) => a + b, null)
    const totalPointsMC = reduceSum(entry.sets.map(i => i.pointsMC))
    const totalPointsFJ = reduceSum(entry.sets.map(i => i.pointsFJ))

    return { totalPointsMC, totalPointsFJ }
  }

  getTotalPointsPerPlyerString (totalPointsMC, totalPointsFJ) {
    if (totalPointsMC == null || totalPointsFJ == null) { return 'NA' }

    return `${totalPointsMC} / ${totalPointsFJ}`
  }

  singleEntry (idx, entry) {
    console.log(entry)
    const { totalPointsMC, totalPointsFJ } = this.getTotalPointsPerPlyer(entry)
    const date = entry.date.split('T')[0]
    let outcome
    let bg
    if (entry.setMC > entry.setFJ) {
      outcome = 'Marko'
      bg = '#FFBF69'
    } else if (entry.setMC < entry.setFJ) {
      outcome = 'Fredrik'
      bg = '#CBF3F0'
    } else {
      outcome = 'Draw'
      bg = '#FFFFFF'
    }
    return <tr key={idx}>
      <td scope="row" style={{ textAlign: 'center', fontSize: '12px', backgroundColor: bg }}>{date}</td>
      <th style={{ textAlign: 'center', fontSize: '12px', backgroundColor: bg }}>{entry.setMC} - {entry.setFJ}</th>
      <th style={{ textAlign: 'center', fontSize: '12px', backgroundColor: bg }}>
        {this.getTotalPointsPerPlyerString(totalPointsMC, totalPointsFJ)}
      </th>
      <td style={{ textAlign: 'center', fontSize: '12px', backgroundColor: bg }}>{outcome}</td>
    </tr>
  }

  populateEntries () {
    if (this.state.entries.length < 1) { return }

    const r = this.state.entries.map(
      (entry, idx) => this.singleEntry(idx, entry)
    )
    return r
  }

  render () {
    return (
      <div className='mt-1 ml-1 mr-1'>
        <h1 style={{ textAlign: 'center' }}>Leaderboard</h1>
        <Table striped bordered hover responsive size="sm" text>
          <thead>
            <tr>
              <th scope="col" style={{ textAlign: 'center', fontSize: '12px' }}>Date</th>
              <th scope="col" style={{ textAlign: 'center', fontSize: '12px' }}>Result (MC vs FJ)</th>
              <th scope="col" style={{ textAlign: 'center', fontSize: '12px' }}>Points (MC / FJ)</th>
              <th scope="col" style={{ textAlign: 'center', fontSize: '12px' }}>Winner</th>
            </tr>
          </thead>
          <tbody>
            {this.populateEntries()}
          </tbody>
        </Table>
      </div >
    )
  }
}
