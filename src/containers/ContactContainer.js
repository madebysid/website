import React, { Component } from 'react';

import HeaderContainer from './HeaderContainer';
import Contact from '../components/Contact';

import '../css/contact.css';

export default class ContactContainer extends Component {
  constructor (props) {
    super(props)

    this.state = {
      email: '',
      body: ''
    }

    this.handleFieldChange = this.handleFieldChange.bind(this)
    this.handleSend = this.handleSend.bind(this)
  }

  handleFieldChange (field, value) {
    this.setState({
      [field]: value
    })
  }

  handleSend () {
    window.location.href = `mailto:${this.state.email}?subject=Holler%20from%20a%20visitor&body=${encodeURI(this.state.body)}`;
  }

  render () {
    return (
      <div className='contact-container'>
        <HeaderContainer
          selected='contact'
        />
        <Contact
          email={this.state.email}
          body={this.state.body}
          onFieldChange={this.handleFieldChange}
          onSend={this.handleSend}
        />
      </div>
    );
  }
};