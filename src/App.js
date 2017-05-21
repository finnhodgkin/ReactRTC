import React, { Component } from 'react'
import styled, { injectGlobal } from 'styled-components'
import { PhoneBox } from './components/PhoneBox'
import { SidePanel } from './components/SidePanel'
import { remoteStream } from './utils/remoteStream'
import { buildUserCallState, updateUser, findByName } from './utils/helpers'

import io from 'socket.io-client'

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
		name: 'Finn',
    nameSelected: '',
    users: [
      {
        name: 'Finn',
        selected: false,
				callState: false,
      },
			{
        name: 'Jake',
				selected: false,
				callState: false,
			},
    ],
    callState: 'IDLE',
    sidePanel: true,
		userMediaPromise: null,
		remoteMediaPromise: null,
		localStreamUrl: null,
		remoteStreamUrl: null,
		socket: null,
  }

	componentWillMount() {
		// Add local media promise and sockets to state
		const userMediaPromise = navigator.mediaDevices.getUserMedia({ video: true })
		this.setState({ userMediaPromise, socket: io() }, () => {
			this.state.socket.on('LIST', users => {
				const userList = users.map(user => ({
					name: user,
					selected: false,
					callState: false,
				}))
				this.setState({ users: userList })
			})
			this.setSocketName(this.state.name)
		})
		// add local and remote streams plus remote promise to state
		userMediaPromise
			.then(stream => {
				const localStreamUrl = window.URL.createObjectURL(stream)
				this.setState({ localStreamUrl, remoteMediaPromise: remoteStream( stream ) })
			})
	}

	setSocketName = (name) => {
		this.state.socket.on(name, ({from, method, data}) => {
			switch (method) {
				case 'CALL-REQUEST':
					this.recievingCall(from)
					break
				case 'ACCEPTED-CALL':
					this.sendHandShake(from)
					break
				case 'SEND-HANDSHAKE':
					this.replyHandshake(from, data)
					break
				case 'REPLY-HANDSHAKE':
					this.setHandshake(from, data)
					break
				case 'CANDIDATE':
					this.setCandidate(from, data)
					break
				default:
					console.log('INCORRECT METHOD SENT FROM SERVER');
			}
		})
	}

	setUserName = (name) => {
		this.setState({ name })
		this.setSocketName(name)
	}

	setUserCallState = (from, state) => {
		const user = findByName(this.state.users, from)
		if (user) {
			const updated = buildUserCallState(user, state)
			const users = updateUser(this.state.users, from, updated)
			this.setState({ users })
			return true
		} else {
			console.log('TRIED TO SET CALL STATE ON AN UNKOWN USER')
			return false
		}
	}

	send = (target, method, data) => {
		this.state.socket.emit('SEND', { name: this.state.name, target, method, data })
	}

	startCall = () => {
		if (this.state.callState === 'IDLE' && this.state.nameSelected) {
			this.setState({ callState: 'DIALING' })
			this.send(this.state.nameSelected, 'CALL-REQUEST')
			this.setUserCallState(this.state.nameSelected, 'DIALING')
		}
	}

	recievingCall = (from) => {
		const setUser = this.setUserCallState(from, 'RINGING')
		if (!setUser) console.log('RECIEVING CALL FROM UNKOWN USER')
	}

	acceptCall = (from) => {
		if (this.state.callState === 'IDLE') {
			this.setState({ callState: 'INCALL-IN' })
			const setUser = this.setUserCallState(from, 'CALLWITH')
			if (setUser) {
				this.send(from, 'ACCEPTED-CALL')
			} else {
				console.log('TRIED TO ACCEPT CALL FROM AN UNKOWN USER');
			}
		}
	}

	sendHandShake = (from) => {
		if (this.state.callState === 'DIALING') {
			this.setState({ callState: 'INCALL-OUT' })
			this.setUserCallState(from, 'CALLWITH')
			this.state.remoteMediaPromise
				.createOffer({ offerToReceiveVideo: 1, offerToReceiveAudio: 0 })
				.then(offer => {
					this.peerConnection.setLocalDescription(offer)
					this.send(from, 'SEND-HANDSHAKE', offer)
					this.attachMedia(this.videoMe)
				})
		}
	}

	replyHandshake = (from, offer) => {
		if (this.state.callState === 'INCALL-IN') {
			this.connectCall(from)
			this.state.remoteMediaPromise
				.setRemoteDescription(offer)
				.then(() => {
					this.peerConnection.createAnswer().then(answer => {
						this.peerConnection.setLocalDescription(answer);
						this.send(from, 'REPLY-HANDSHAKE', answer);
					});
			});
		}
	}

	setHandshake = (from, offer) => {
		if (this.state.callState === 'INCALL-OUT') {
			this.connectCall(from)
			this.state.remoteMediaPromise
				.setRemoteDescription(offer)
				.then(() => console.log('ACCEPTED HANDSHAKE ON BOTH ENDS'));
		}
	}


	connectCall = (from) => {
		if (['INCALL-OUT', 'INCALL-IN'].indexOf(this.state.callState) !== -1 ) {
			this.state.remoteMediaPromise
				.onicecandidate = ({ candidate }) => {
					if (candidate) {
						this.send(from, 'CANDIDATE', candidate)
					}
				}
		}
	}

	toggleSidePanel = () => {
		const panel = !this.state.sidePanel
		this.setState({ sidePanel: panel })
	}

	selectUser = (user) => {
		const name = this.state.nameSelected === user ? '' : user
		this.setState({ nameSelected: name })
	}

  render() {
    return (
      <Container>
        <SidePanel
          users={this.state.users}
          sidePanel={this.state.sidePanel}
					selectUser={this.selectUser}
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
