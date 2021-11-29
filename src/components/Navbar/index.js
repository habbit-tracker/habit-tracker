import React from 'react';
import { Nav, NavLink, Bars, NavMenu, NavBtn, NavBtnLink } from './NavbarElements';

const Navbar = () => {
    return (
        <>
            <Nav>
                <NavLink to="/">
                    <h1>InHabit</h1>
                </NavLink>
                <Bars />
                <NavMenu>
                    <NavLink to="/about_us" activeStyle>
                        About
                    </NavLink>
                    <NavLink to="../templates/contact_us.html" activeStyle>
                        Contact Us
                    </NavLink>
                    <NavLink to="/profile" activeStyle>
                        Profile
                    </NavLink>
                </NavMenu>
                <NavBtn>
                    <NavBtnLink to="/log-in">Log Out</NavBtnLink>
                </NavBtn>
            </Nav>
        </>
    );
};

export default Navbar;

