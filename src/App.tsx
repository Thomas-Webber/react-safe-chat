import React from 'react';
import './App.css';
import {
    BrowserRouter as Router,
    Route,
    Link
} from 'react-router-dom';

import AboutComponent from './components/about/AboutComponent';
import HomeComponent from './components/home/HomeComponent';
import RoomComponent from "./components/room/RoomComponent";

// const logo = require('./logo.svg');

class App extends React.Component {
  render() {
    return (
        <Router>
            <div className="fullheight c-flex">
                <ul className="header d-flex justify-content-around primary primary-bg">
                    <li><Link className="primary" to="/">Home</Link></li>
                    <li><Link className="primary" to="/about">About</Link></li>
                    <li><Link className="primary" to="/room/qwert">Room</Link></li>
                </ul>

                <Route exact path="/" component={HomeComponent}/>
                <Route path="/about" component={AboutComponent}/>
                <Route path="/room/:id" component={RoomComponent}/>
            </div>
        </Router>
    );
  }
}

export default App;
