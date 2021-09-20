import React, { Component } from 'react'
import {Navbar, Nav, Container} from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css'


export default class navBar extends Component {
    render() {
        return (
            <div>

        <Navbar style={{backgroundColor: '#000'}} expand='lg' variant='dark'>
            <Container>
                <Navbar.Brand style={{fontSize: '2em'}} href="#/">Language Annotation Web System - LAWS</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                <Nav style={{fontSize: '1.5em'}} className="me-auto">
                    <Nav.Link href="#/">Home</Nav.Link>
                    <Nav.Link href="#/openproject">Abrir Projeto</Nav.Link>
                    <Nav.Link href="#/newproject">Novo Projeto</Nav.Link>
                </Nav>
                </Navbar.Collapse>
            </Container>
            </Navbar>
            </div>
        )
    }
}
