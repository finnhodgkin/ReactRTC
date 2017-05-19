import React from 'react'
import styled from 'styled-components'

const CallBtn = styled.button`
  width: 5rem;
  height: 5rem;
  border-radius: 50%;
  color: grey;
  margin: 0 2rem;
  background-color: ${props => {
      if (['CALLER', 'CALLED'].indexOf(props.callState) !== -1) {
        return 'rgba(214, 51, 51, 1)'
      } else if (props.nameSelected) {
        return 'rgba(72, 209, 94, 1)'
      } else {
        return 'rgba(200, 200, 200, 1)'
      }
    }
  };
  border-style: none;
  outline: none;
  display: inline-block;
`

export const CallButton = (props) => {
  return (
    <CallBtn {...props}></CallBtn>
  )
}
