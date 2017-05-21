import React from 'react'
import styled from 'styled-components'
import { CallButton } from './CallButton'

const Controls = styled.section`
  position: absolute;
  bottom: 0;
  width: 100%;
  padding-bottom: 4rem;
  text-align: center;
`
const ControlWrap = styled.section`
  display: inline-block;
`

export const ControlPanel = (props) => {
  return (
    <Controls>
      <ControlWrap>
        {/* <CallButton />
        <CallButton /> */}
        <CallButton {...props}/>
      </ControlWrap>
    </Controls>
  )
}
