import React from 'react'
import styled from 'styled-components'

const NavBar = () => {
  return (
    <NavWrapper>
      <Logo>
        <Image 
          alt = "Poke Logo"
          src = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png"
          onClick = {() => (window.location.href = "/")}
          />
      </Logo>
    </NavWrapper>
  )
}

const Image = styled.img`
  cursor: pointer;
  width: 100%;
  
`;


const Logo = styled.a`
  padding: 0;
  width: 50px;
  margin-top: 4px;

  img {
    width: 100%;
  }
`

const NavWrapper = styled.nav`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 70px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 36px;
  letter-spacing: 16px;
  z-index: 100;
  `

export default NavBar 