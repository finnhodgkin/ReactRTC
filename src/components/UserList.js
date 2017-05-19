import React from 'react'
import styled from 'styled-components'
import { UserList } from './ControlPanel'

const Panel = styled.aside`
  width: 30%;
  height: 100vh;
  transition: all .3s ease;
  position: relative;
`

export const PhoneBox = (props) => {
  return (
    <Panel>
      <UserList />
    </Panel>
  )
}
