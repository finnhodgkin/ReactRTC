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
		name: ['Finn', 'Tom'][Math.floor(Math.random() * 2)],
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
				this.setState({ localStreamUrl, remoteMediaPromise: this.remoteStream( stream ) })
			})
	}

	remoteStream = localStream => {
	  const remoteMediaPromise = new RTCPeerConnection()

	  remoteMediaPromise.addStream(localStream)

	  remoteMediaPromise.onaddstream = ({ stream }) => {
	    const remoteStreamUrl = window.URL.createObjectURL(stream)
	    this.setState({ remoteStreamUrl })
	  }

	  return remoteMediaPromise
	}

	setSocketName = (name) => {
		console.log('happening')
		this.state.socket.on(name, ({from, method, data}) => {
			console.log('GOT SEND')
			switch (method) {
				case 'CALL-REQUEST':
					this.recievingCall(from)
					console.log('GOT REQUEST')
					break
				case 'ACCEPTED-CALL':
					this.sendHandShake(from)
					console.log('ACCEPTED')
					break
				case 'SEND-HANDSHAKE':
					this.replyHandshake(from, data)
					console.log('SEND HANDSHAKE')
					break
				case 'REPLY-HANDSHAKE':
					this.setHandshake(from, data)
					console.log('REPLY HANDSHAKE')
					break
				case 'CANDIDATE':
					this.setCandidate(from, data)
					console.log('SENT CANDIDATE')
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
		console.log(this.state.callState);
		if (this.state.callState === 'IDLE' && this.state.nameSelected && this.state.nameSelected !== this.state.name) {
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
			this.setState({ callState: 'INCALL-IN', inCallWith: from })
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
			this.setState({ callState: 'INCALL-OUT', inCallWith: from })
			this.setUserCallState(from, 'CALLWITH')
			this.state.remoteMediaPromise
				.createOffer({ offerToReceiveVideo: 1, offerToReceiveAudio: 0 })
				.then(offer => {
					this.state.remoteMediaPromise.setLocalDescription(offer)
					this.send(from, 'SEND-HANDSHAKE', offer)
				})
		}
	}

	replyHandshake = (from, offer) => {
		if (this.state.callState === 'INCALL-IN') {
			this.connectCall(from)
			this.state.remoteMediaPromise
				.setRemoteDescription(offer)
				.then(() => {
					this.state.remoteMediaPromise.createAnswer().then(answer => {
						this.state.remoteMediaPromise.setLocalDescription(answer);
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

	setCandidate = (from, candidate) => {
		if (candidate) {
			const iceCandidate = new RTCIceCandidate(candidate);
			this.state.remoteMediaPromise.addIceCandidate(iceCandidate);
		}
	}

	toggleSidePanel = () => {
		const panel = !this.state.sidePanel
		this.setState({ sidePanel: panel })
	}

	selectUser = (user) => {
		const index = this.state.users.findIndex(selected => selected.name === user)
		console.log(index);
		if (index !== -1 && this.state.users[index].callState === 'RINGING') {
			this.acceptCall(user)
		} else {
			const name = this.state.nameSelected === user ? '' : user
			this.setState({ nameSelected: name })
		}
	}

	hangUpCall() {
		console.log('Hangup');
		if (this.state.callState !== 'IDLE') {
			this.setState({ callState: 'IDLE' })
			this.send(this.state.inCallWith, 'END_CALL');
			this.state.remoteMediaPromise.close();
			this.setState({ remoteMediaPromise: null, remoteStreamUrl: null, inCallWith: null })
		}
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
					makeCall={this.startCall.bind(this)}
					hangUpCall={this.hangUpCall.bind(this)}
        />
      </Container>
    )
  }
}

export default App;
