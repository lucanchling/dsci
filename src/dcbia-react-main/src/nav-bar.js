import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import store from "./redux/store";
import {withRouter} from 'react-router-dom';
import {Home, User, Users, Cpu, Settings, LogOut, LogIn, File, FilePlus, Info} from 'react-feather';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Image from 'react-bootstrap/Image';
import Button from 'react-bootstrap/Button';

class NavBar extends Component{
  constructor(props) {
    super(props);

    this.state = {
      showLogin: false, 
      showCreateUser: false
    }
  }

  getComputing(){
    const {user} = this.props;
    if(user && user.scope && user.scope.indexOf('clusterpost') != -1){
      return <Nav.Link><Link class="nav-link" to="/computing"><Cpu/> Computing</Link></Nav.Link>
    }
  }

  getSettings(){
    const {user, history} = this.props;

    var strSettings = <Settings/>;


    if(user && user.scope && user.scope.indexOf('admin') != -1){
      return <NavDropdown title={<t><Settings/> Settings</t>} id="basic-nav-dropdown">
          <NavDropdown.Item onClick={()=>{history.push('/admin/users')}}><Users/> Users</NavDropdown.Item>
          <NavDropdown.Divider/>
          <NavDropdown.Item onClick={()=>{history.push('/admin/servers')}}><Cpu/> Computing</NavDropdown.Item>
        </NavDropdown>
    }
  }

  onUserLogin(){
    this.props.userLogin(!this.state.showLogin);
    this.setState({...this.state, showLogin: !this.state.showLogin});    
    this.props.history.push('/login');
  }

  getUpload(){
    const {user} = this.props;
    if(user && user.scope && user.scope.indexOf('clusterpost') != -1){
      return <Nav.Link><Link class="nav-link" to="/filebrowser"><File/> File browser</Link></Nav.Link>
    }
  }  

  getCreatetask(){
    const {user} = this.props;
    if(user && user.scope && user.scope.indexOf('clusterpost') != -1){
      return <Nav.Link><Link class="nav-link" to="/createtask"><FilePlus/> Create task</Link></Nav.Link>
    }
  }  

  getUserDropDown(){
    const {user, history} = this.props;
    
    if(user && user.scope && user.scope.indexOf('default') != -1){
      return <NavDropdown title={<User/>} id="basic-nav-dropdown">
          <NavDropdown.Item onClick={()=>{history.push('/about')}}><Info/> About</NavDropdown.Item>
          <NavDropdown.Item onClick={()=>{history.push('/user')}}><User/> Profile</NavDropdown.Item>
          <NavDropdown.Divider/>
          <NavDropdown.Item onClick={()=>{
            history.push('/logout')
            localStorage.removeItem('clusterpost_token');
            store.dispatch({ 
              type: 'user-factory', 
              user: {}
            })
          }}><LogOut/> Logout</NavDropdown.Item>
        </NavDropdown>
    }else{
      return <NavDropdown title={<User/>} id="basic-nav-dropdown">
          <NavDropdown.Item onClick={this.onUserLogin.bind(this)}><LogIn/> Login</NavDropdown.Item>
        </NavDropdown>
    }
  }

  getCreateUser(){
    const self = this
    return <Button onClick={()=>{
      
      self.setState({showCreateUser: !self.state.showCreateUser}, ()=>{
        store.dispatch({type: 'user-create', showCreateUser: self.state.showCreateUser})
      })
    }} variant="outline-dark">
        Create Account
    </Button>
  }

  render() {
    const self = this;
    const {user} = self.props;

    return (
    <Container>
      <Row>
        <Col class="title">
          <h2>
            <font color="#002855">
              <b>
                Smart-DOC
              </b>
            </font>
          </h2>
        </Col>
      </Row>
      <Navbar bg="light" expand="lg">
        <Navbar.Brand href="#/"><Image src="images/icon.png" style={{height: "10vh"}}/></Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="mr-auto">
            <Nav.Link><Link class="nav-link" to="/home"><Home/> Home</Link>
            </Nav.Link>
              {self.getUpload()}
              {self.getCreatetask()}
              {self.getComputing()}
            <Nav.Link>
              {self.getSettings()}
            </Nav.Link>
            <Nav.Link>
              {self.getUserDropDown()}
            </Nav.Link>
            <Nav.Link style={{display: user && user.scope? 'none': 'block'}}>
              {self.getCreateUser()}
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    </Container>
    );

  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    http: state.jwtAuthReducer.http, 
    user: state.jwtAuthReducer.user,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    userLogin: (showLogin) => {
      dispatch({
        type: 'user-login',
        showLogin: showLogin
      });
    }
  }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(NavBar));