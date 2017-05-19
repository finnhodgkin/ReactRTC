import React from 'react'
import styled from 'styled-components'
import { User } from './User'

const Users = styled.aside`
  width: 100%;
  position: relative;
  box-sizing: border-box;
  margin-top: 5rem;
`

export const UserList = (props) => {
  return (
    <Users>
      {props.users.map(user => <User {...user}/>)}
    </Users>
  )
}
