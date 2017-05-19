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
		userMediaPromise: null,
		localStreamUrl: null,
		remoteStreamUrl: null,
  }

	componentDidMount() {
		const userMediaPromise = navigator.mediaDevices.getUserMedia({ video: true })

		userMediaPromise
			.then(stream => {
				const localStreamUrl = window.URL.createObjectURL(stream)
				this.setState({ localStreamUrl })
			})

		this.setState({ userMediaPromise })
	}

	toggleSidePanel = () => {
		const panel = !this.state.sidePanel
		this.setState({ sidePanel: panel })
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
					toggleSidePanel={this.toggleSidePanel}
					localStreamUrl={this.state.localStreamUrl}
					remoteStreamUrl={this.state.remoteStreamUrl}
        />
      </Container>
    )
  }
}

export default App;
