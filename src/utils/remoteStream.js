export const remoteStream = localStream => {
  const remoteMediaPromise = new RTCPeerConnection()

  remoteMediaPromise.addStream(localStream)

  remoteMediaPromise.onaddstream = ({ stream }) => {
    const remoteStreamUrl = window.URL.createObjectURL(stream)
    this.setState({ remoteStreamUrl })
  }

  return remoteMediaPromise
}
