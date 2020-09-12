import React, { Component } from 'react'
import Accordion from 'react-bootstrap/Accordion'
import Card from 'react-bootstrap/Card'
import Button from 'react-bootstrap/Button'
import InputGroup from 'react-bootstrap/InputGroup'
import FormControl from 'react-bootstrap/FormControl'
import Badge from 'react-bootstrap/Badge'
import Form from 'react-bootstrap/Form'
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'
import { Redirect } from 'react-router-dom';
import { Label } from 'react-bootstrap'
import LoadingButton from './LoadingButton'


export default class Drafts extends Component {
  constructor(props) {
    super(props)
    this.state = {
      entriesDrafts: [],
      date: new Date().toISOString().split("T")[0],
      saveSuccessful: true
    }
    this.getEntries()
  }

  getEntries() {
    fetch('/api/entry', {
      method: 'GET'
    })
      .then(res => res.json())
      .then(data => data.filter(function (el) {
        if (el.locked) {
          return false
        } else {
          return true
        }
      }))
      .then(data => {
        data.sort(function (a, b) {
          return new Date(b.date) - new Date(a.date)
        })
        this.setState({ entriesDrafts: data })
      })
  }
  /*
  =================================================================================================
  */

  validResult(score1, score2) {
    // Arithmetic needs to be updated
    if (score1 >= 20 && score2 >= 20) {
      return Math.abs(score1 - score2) == 2
    } else {
      return (score1 == 21 || score2 == 21) && (score1 >= 0) && (score2 >= 0)
    }
  }

  matchScore(sets) {
    const wonSetsMC = sets.filter((set) => set.pointsMC > set.pointsFJ).length
    const wonSetsFJ = sets.filter((set) => set.pointsMC < set.pointsFJ).length
    return {
      wonSetsMC: wonSetsMC,
      wonSetsFJ: wonSetsFJ
    }
  }

  onMatchCreate = (event) => {
    event.preventDefault()
    fetch('/api/match', {
      method: 'POST',
      body: JSON.stringify({
        date: this.state.date
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(res => {
        if (res.status === 200) {
          window.location.reload();
        } else {
          const error = new Error(res.error);
          throw error;
        }
      })
      .catch(err => {
        console.error(err);
        //alert('Error logging in please try again');
      })
  }

  protoSaveDraft(entry) {
    return fetch('/api/setSets', {
      method: 'POST',
      body: JSON.stringify({
        id: entry._id,
        sets: entry.sets
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    })
  }

  onSaveDraft(entry) {
    return (event) => {
      event.preventDefault()
      fetch('/api/setSets', {
        method: 'POST',
        body: JSON.stringify({
          id: entry._id,
          sets: entry.sets
        }),
        headers: {
          'Content-Type': 'application/json'
        }
      })
        .then(res => {
          if (res.status === 200) {
            this.setState({
              "saveSuccessful": true
            })
          } else {
            this.setState({
              "saveSuccessful": false
            })
          }
        })
    }
  }

  onSaveAndPublish(entry) {
    return (event) => {
      event.preventDefault()
      const { wonSetsMC, wonSetsFJ } = this.matchScore(entry.sets)
      fetch('/api/setSets', {
        method: 'POST',
        body: JSON.stringify({
          id: entry._id,
          locked: true,
          sets: entry.sets,
          setMC: wonSetsMC,
          setFJ: wonSetsFJ
        }),
        headers: {
          'Content-Type': 'application/json'
        }
      })
        .then(res => {
          if (res.status === 200) {
            this.props.history.push('/');
          } else {
            const error = new Error(res.error);
            throw error;
          }
        })
    }
  }

  onMatchDelete(id) {
    return (event) => {
      event.preventDefault()
      fetch('/api/match', {
        method: 'DELETE',
        body: JSON.stringify({
          id: id
        }),
        headers: {
          'Content-Type': 'application/json'
        }
      })
        .then(res => {
          if (res.status === 200) {
            window.location.reload();
          } else {
            const error = new Error(res.error);
            throw error;
          }
        })
        .catch(err => {
          console.error(err);
          //alert('Error logging in please try again');
        })
    }
  }

  handleSetEntry(entry, setNumber) {
    return (event) => {
      const { value, name } = event.target
      this.setState(function (pastState) {
        const matchingIndex = pastState.entriesDrafts.findIndex((e) => e._id === entry._id)
        const currentDraft = pastState.entriesDrafts[matchingIndex]

        const targetSet = currentDraft.sets.find((s) => s.setNumber === setNumber)
        targetSet[name] = Number(value)

        return {
          entriesDrafts: [
            ...pastState.entriesDrafts.slice(0, matchingIndex),
            pastState.entriesDrafts[matchingIndex],
            ...pastState.entriesDrafts.slice(matchingIndex + 1)]
        }
      })
    }
  }

  setsDrafts(entry) {
    const activeSet = entry.sets.length
    return entry.sets.map((set) => {

      const isDisabled = set.setNumber !== activeSet
      return <Form noValidate>
        <Form.Row>
          <InputGroup className="mb-1">
            <FormControl
              placeholder="0"
              type="number"
              name="pointsMC"
              style={{ textAlign: "center" }}
              defaultValue={set.pointsMC}
              onChange={this.handleSetEntry(entry, set.setNumber)}
              disabled={isDisabled}
              isInvalid={
                !this.validResult(set.pointsMC, set.pointsFJ)}
            />
            <FormControl
              placeholder="0"
              type="number"
              name="pointsFJ"
              style={{ textAlign: "center" }}
              defaultValue={set.pointsFJ}
              onChange={this.handleSetEntry(entry, set.setNumber)}
              disabled={isDisabled}
              isInvalid={
                !this.validResult(set.pointsMC, set.pointsFJ)
              }
            />
          </InputGroup>
        </Form.Row>
      </Form>
    })
  }

  handleSetInc(entry) {
    return (event) => {
      this.setState(function (pastState, props) {
        const matchingIndex = pastState.entriesDrafts.findIndex((e) => e._id === entry._id)
        const allSets = pastState.entriesDrafts[matchingIndex].sets
        const currentSetNumber = allSets.length

        if (currentSetNumber > 0) {
          const [currentSet] = allSets.filter((e) => e.setNumber == currentSetNumber)

          if (!this.validResult(currentSet.pointsMC, currentSet.pointsFJ)) {
            return {}
          }

        }

        const addedSet = {
          setNumber: Number(currentSetNumber + 1),
          pointsMC: null,
          pointsFJ: null
        }
        pastState.entriesDrafts[matchingIndex].sets.push(addedSet)

        return {
          entriesDrafts: [
            ...pastState.entriesDrafts.slice(0, matchingIndex),
            pastState.entriesDrafts[matchingIndex],
            ...pastState.entriesDrafts.slice(matchingIndex + 1)]
        }
      })
    }
  }

  handleSetDec(entry) {
    return (event) => {
      this.setState(function (pastState, props) {
        const matchingIndex = pastState.entriesDrafts.findIndex((e) => e._id === entry._id)
        const currentSetNumber = pastState.entriesDrafts[matchingIndex].sets.length

        const currentDraft = pastState.entriesDrafts[matchingIndex]
        const alateredSets = currentDraft.sets.filter(set => set.setNumber !== currentSetNumber)
        currentDraft.sets = alateredSets
        return {
          entriesDrafts: [
            ...pastState.entriesDrafts.slice(0, matchingIndex),
            currentDraft,
            ...pastState.entriesDrafts.slice(matchingIndex + 1)]
        }
      })
    }
  }

  addSetButton(entry) {
    return <Form.Row>
      <Col style={{ textAlign: "right" }}>
        <Button
          style={{ minWidth: "40px" }}
          variant="outline-success"
          onClick={this.handleSetInc(entry)}
        >
          +
        </Button>
      </Col>
      <Col style={{ textAlign: "left" }}>
        <Button
          style={{ minWidth: "40px" }}
          variant="outline-warning"
          onClick={this.handleSetDec(entry)}
        >-</Button>
      </Col>
    </Form.Row>
  }

  // Add warning if not valid match entry
  addSaveButtons(entry) {
    return <Form.Row>
      <Col style={{ textAlign: "center" }}>
        <LoadingButton
          loadingText={"Saving..."}
          buttonText={"Save Draft"}
          style={{ minWidth: "110px" }}
          asyncCall={() => this.protoSaveDraft(entry)}
        />
      </Col>
      <Col style={{ textAlign: "center" }}>
        <Button
          style={{ minWidth: "110px" }}
          onClick={this.onSaveAndPublish(entry, false)}
        >
          Publish
        </Button>
      </Col>
    </Form.Row>
  }

  matchForm(entry) {
    return <div className='mt-0 ml-0 mr-0'>
      <Row>
        <Col>
          <Row className="justify-content-center"><h3>Marko</h3></Row>
          <Row className="justify-content-center"><h1>{this.matchScore(entry.sets).wonSetsMC}</h1></Row>
        </Col>
        <Col xs={1}>
          <Row><h3>vs</h3></Row>
        </Col>
        <Col>
          <Row className="justify-content-center"><h3>Fredrik</h3></Row>
          <Row className="justify-content-center"><h1>{this.matchScore(entry.sets).wonSetsFJ}</h1></Row>
        </Col>
      </Row>
      <form>
        <div className="form-group" className='mt-2 mb-2'>
          {this.setsDrafts(entry)}
          {this.addSetButton(entry)}
        </div>
        {this.addSaveButtons(entry)}
      </form>
    </div >
  }

  populateDrafts() {
    return this.state.entriesDrafts.map((entry, index) => {
      //return <option value={entry.id}>{entry.date.split("T")[0]}</option>
      const r = <Card key={index}>
        <Card>
          <Accordion.Toggle as={Card.Header} variant="link" eventKey={String(index)} key={index}>
            <Row className="align-items-center">
              <Col style={{ textAlign: "left" }}>
                {entry.date.split("T")[0]}
              </Col>
              <Col style={{ textAlign: "right" }} >
                <Button
                  size="sm"
                  variant="danger"
                  onClick={this.onMatchDelete(entry._id)}
                >
                  Delete
                </Button>
              </Col>
            </Row>
          </Accordion.Toggle>
        </Card>
        <Accordion.Collapse eventKey={String(index)} key={index}>
          <Card.Body>{this.matchForm(entry)}</Card.Body>
        </Accordion.Collapse>
      </Card >
      return r
    })
  }

  handleMatchDateChange = (event) => {
    const { value, name } = event.target;
    this.setState({
      [name]: value
    });
  }

  render() {
    return (
      <div className='mt-1 ml-1 mr-1'>

        <Form onSubmit={this.onMatchCreate}>
          <div className="form-group">
            <label>Create Match Entry</label>
            <input
              type="date"
              name="date"
              className="form-control"
              placeholder="Enter date"
              value={this.state.date}
              onChange={this.handleMatchDateChange}
              required
            />
            <button type="submit" className="btn btn-primary btn-block">Create</button>
          </div>
        </Form>
        <h3 style={{ textAlign: "center" }}>Matches (drafts)</h3>
        <Accordion defaultActiveKey="0">
          {this.populateDrafts()}
        </Accordion>
      </div>
    )
  }
}
