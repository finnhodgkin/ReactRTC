import React from 'react'
import styled from 'styled-components'

const SmallVideoBox = styled.video`
  width: 25%;
  height: auto;
  background-color: white;
  border: 1px solid black;
  right: 5rem;
  top: 4rem;
  position: absolute;
`

export const SmallScreen = (props) => {
  return (
    <SmallVideoBox {...props}/>
  )
}