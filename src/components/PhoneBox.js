import React from 'react'
import styled from 'styled-components'
import { ControlPanel } from './ControlPanel'
import { SmallScreen } from './SmallScreen'
import chevron from './../chevron-right.svg';

const MainPanel = styled.section`
  width: ${(props) => props.sidePanel ? '70%' : '100%'};
  ${(props) => props.sidePanel ? 'max-width: calc(100% - 10rem);' : ''}
  min-width: calc(100% - 25rem);
  height: 100vh;
  transition: all .3s ease;
  position: relative;
  display: inline-block;
  vertical-align: top;
  overflow: hidden;
`

const VideoBox = styled.video`
  width: 100%;
  height: 100vh;
  transition: all .3s ease;
  position: absolute;
  display: inline-block;
`

const SidePanelToggle = styled.button`
  position: absolute;
  left: 0;
  top: 45vh;
  width: 2rem;
  height: 4rem;
  background-color: rgba(200, 200, 200, 1);
  outline: none;
  border-style: none;
  background-image: url(${chevron});
  background-size: 70%;
  background-repeat: no-repeat;
  cursor: pointer;

  ${props => {
    return props.sidePanel ?
    `background-position: 90% center;
    transform: scaleX(-1);
    border-top-left-radius: 4rem;
    border-bottom-left-radius: 4rem;` :

    `transform: scaleX(1);
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
    border-top-right-radius: 4rem;
    border-bottom-right-radius: 4rem;
    background-position: 25% center;`
  }}


  &:hover {

  }
`

export const PhoneBox = (props) => {
  return (
    <MainPanel sidePanel={props.sidePanel}>
      <VideoBox src={props.remoteStreamUrl} autoPlay='true' {...props} />
      <SmallScreen localStreamUrl={props.localStreamUrl} {...props} />
      <ControlPanel {...props} />
      <SidePanelToggle onClick={props.toggleSidePanel} sidePanel={props.sidePanel}/>
    </MainPanel>
  )
}
