import React from 'react'
import styled from 'styled-components'
import phone from './../phone-icon.svg'

const CallBtn = styled.button`
  width: 5rem;
  height: 5rem;
  cursor: pointer;
  border-radius: 50%;
  color: grey;
  margin: 0 2rem;
  background-color: ${props => {
      if (['INCALL-IN', 'INCALL-OUT'].indexOf(props.callState) !== -1) {
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
  background-image: url(${phone});
  background-size: 65%;
  background-repeat: no-repeat;
  background-position: center center;
  transition: 0.2s transform ease;
  ${props => {
      if (['INCALL-IN', 'INCALL-OUT'].indexOf(props.callState) !== -1) {
        return 'transform: rotate(135deg);'
      } else if (props.nameSelected) {
        return ''
      } else {
        return 'transform: rotate(90deg);'
      }
    }
  }
`

export const CallButton = (props) => {
  return (
    <CallBtn {...props}></CallBtn>
  )
}
