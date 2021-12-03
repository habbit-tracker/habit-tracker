import React from 'react';
import { Nav, NavLink, Bars, NavMenu, NavBtn, Navilink } from './NavbarElements';
import { Button } from 'react-bootstrap';


const Navbar = () => {
    return (
        <>
            <Nav>
                <Navilink to="/">
                    <h1>InHabit</h1>
                </Navilink>
                <Bars />
                <NavMenu>
                    <Navilink id="about" href="/about" variant="info">About</Navilink>
                    <Navilink id="contactus" href="/contactus" variant="info">Contact Us</Navilink>
                    <Navilink id="profile" href="/profile" variant="white">Profile</Navilink>
                </NavMenu>
                <NavBtn>
                    <a href="/logout"><Button variant="success" id="logout">Log Out!</Button></a>
                </NavBtn>
            </Nav>
        </>
    );
};

export default Navbar;

