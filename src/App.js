import React, { Component } from 'react'
import styled, { injectGlobal } from 'styled-components'
import { PhoneBox } from './components/PhoneBox'
import { SidePanel } from './components/SidePanel'

injectGlobal`
	body {
		margin: 0;
    font-family: sans-serif;
	}
`

const Container = styled.main`
  width: 100%;
  height: 100vh;
  background-color: white;
  font-size: 0;
  vertical-align: top;
`

class App extends Component {
  state = {
    nameSelected: '',
    users: [
      {
        name: 'Finn',
        image: 'test.jpg',
      }
    ],
    callState: 'IDLE',
    sidePanel: true,
  }

  render() {
    return (
      <Container>
        <SidePanel
          users={this.state.users}
          sidePanel={this.state.sidePanel}
         />
        <PhoneBox
          callState={this.state.callState}
          nameSelected={this.state.nameSelected}
          sidePanel={this.state.sidePanel}
        />
      </Container>
    )
  }
}

export default App;
