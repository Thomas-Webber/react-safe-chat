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
                <ul>
                    <li><Link to="/">Home</Link></li>
                    <li><Link to="/about">About</Link></li>
                    <li><Link to="/room/qwert">Room</Link></li>
                </ul>

                <hr/>

                <Route exact path="/" component={HomeComponent}/>
                <Route path="/about" component={AboutComponent}/>
                <Route path="/room/:id" component={RoomComponent}/>
            </div>
        </Router>
    );
  }
}

export default App;
