import React from 'react'
import styled from 'styled-components'
import { ControlPanel } from './ControlPanel'

const VideoBox = styled.section`
  width: 70%;
  height: 100vh;
  transition: all .3s ease;
  position: relative;
  display: inline-block;
`

export const PhoneBox = (props) => {
  return (
    <VideoBox>
      <ControlPanel />
    </VideoBox>
  )
}
