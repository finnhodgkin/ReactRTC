import React from 'react'
import styled from 'styled-components'

const UserItem = styled.aside`
  width: 100%;
  background-color: white;
  color: black;
  padding: 1rem 2rem;
  font-size: 1rem;
  box-sizing: border-box;
`

export const User = (props) => {
  return (
    <UserItem>
      {props.name}
    </UserItem>
  )
}
