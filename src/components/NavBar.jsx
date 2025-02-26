import React, { Component } from 'react'
import {Navbar, Nav, Container} from 'react-bootstrap';


export default class navBar extends Component {
    render() {
        return (
            <div>

        <Navbar style={{backgroundColor: '#AAA'}} expand='lg' variant='dark'>
            <Container>
                <Navbar.Brand style={{fontSize: '2em'}} color='#000'  href="#/">Language Annotation Web System - LAWS</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                <Nav style={{fontSize: '1.5em'}} className="me-auto">
                    <Nav.Link href="#/">Home</Nav.Link>
                    <Nav.Link href="#/openproject">Open Project</Nav.Link>
                    <Nav.Link href="#/newproject">New Project</Nav.Link>
                </Nav>
                </Navbar.Collapse>
            </Container>
            </Navbar>
            </div>
        )
    }
}
