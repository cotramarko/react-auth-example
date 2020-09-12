import React, { Component } from 'react'
import useEffect from 'react'
import useState from 'react'
import Accordion from 'react-bootstrap/Accordion'
import Card from 'react-bootstrap/Card'
import Button from 'react-bootstrap/Button'
import InputGroup from 'react-bootstrap/InputGroup'
import FormControl from 'react-bootstrap/FormControl'
import Badge from 'react-bootstrap/Badge'
import Form from 'react-bootstrap/Form'
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'
import { Redirect } from 'react-router-dom'
import { Label } from 'react-bootstrap'

class LoadingButton extends React.Component {
  constructor(props, context) {
    super(props, context)

    this.handleClick = this.handleClick.bind(this)

    this.state = {
      isLoading: false,
      saveSuccessful: true
    }
  }

  handleClick() {
    this.setState({ isLoading: true })

    this.props.asyncCall()
      .then(res => {
        if (res.status === 200) {
          this.setState({
            saveSuccessful: true
          })
        } else {
          this.setState({
            saveSuccessful: false
          })
        }
      })
      .then(_ => this.setState({ isLoading: false }))
  }

  render() {
    const { isLoading } = this.state
    return (
      <Button
        style={this.props.style}
        variant={this.state.saveSuccessful ? 'outline-primary' : 'outline-danger'}
        disabled={isLoading}
        onClick={!isLoading ? this.handleClick : null}
      >
        {isLoading ? this.props.loadingText : this.props.buttonText}
      </Button>
    )
  }
}

export default LoadingButton
