import React, { Component } from 'react'
import styled, { injectGlobal } from 'styled-components'
import { PhoneBox } from './components/PhoneBox'
import { SidePanel } from './components/SidePanel'

injectGlobal`
	body {
		margin: 0;
	}
`

const Container = styled.main`
  width: 100%;
  height: 100vh;
  background-color: papayawhip;
  font-size: 0;
`

class App extends Component {
  state = {
    nameSelected: '',
    names: [],
    callState: 'IDLE',
  }

  render() {
    return (
      <Container>
        <SidePanel />
        <PhoneBox callState={this.state.callState} nameSelected={this.state.nameSelected}/>
      </Container>
    )
  }
}

export default App;
