import React from 'react'
import styled from 'styled-components'

const SmallVideoBox = styled.video`
  width: 20%;
  min-width: 10rem;
  height: auto;
  background-color: white;
  border: 1px solid black;
  right: 5%;
  top: 4rem;
  position: absolute;
`

export const SmallScreen = (props) => {
  return (
    <SmallVideoBox src={props.localStreamUrl} autoPlay='true' {...props}/>
  )
}
