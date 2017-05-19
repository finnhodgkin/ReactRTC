import React from 'react'
import styled from 'styled-components'
import { ControlPanel } from './ControlPanel'
import { SmallScreen } from './SmallScreen'

const MainPanel = styled.section`
  width: ${(props) => props.sidePanel ? '70%' : '100%'};
  ${(props) => props.sidePanel ? 'max-width: calc(100% - 10rem);' : ''}
  min-width: calc(100% - 25rem);
  height: 100vh;
  transition: all .3s ease;
  position: relative;
  display: inline-block;
  vertical-align: top;
`

const VideoBox = styled.video`
  width: 100%;
  height: 100vh;
  transition: all .3s ease;
  position: absolute;
  display: inline-block;
`

export const PhoneBox = (props) => {
  return (
    <MainPanel sidePanel={props.sidePanel}>
      <SmallScreen {...props} />
      <VideoBox {...props} />
      <ControlPanel {...props} />
    </MainPanel>
  )
}
