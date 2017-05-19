import React from 'react'
import styled from 'styled-components'
import { UserList } from './UserList'

const Panel = styled.aside`
  width: ${(props) => props.sidePanel ? '30%' : '0%'};
  ${(props) => props.sidePanel ? 'min-width: 10rem;' : ''}
  overflow: hidden;
  max-width: 25rem;
  height: 100vh;
  transition: all .3s ease;
  position: relative;
  background-color: rgba(200, 200, 200, 1);
  display: inline-block;

`

export const SidePanel = (props) => {
  return (
    <Panel {...props}>
      <UserList {...props}/>
    </Panel>
  )
}
