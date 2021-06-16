import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import './App.scss';
import Home from './Pages/Home';

class App extends Component {
  showCurrentYear() {
    return new Date().getFullYear();
  }
  render() {
    return (
      <Router>
        <div className="background"/>
        <div className="bg-contents"/>
        <Route exact path="/" component={Home} />
        <footer>
          &copy; {this.showCurrentYear()} <span>RIZON</span>
        </footer>
      </Router>
    );
  }
}

export default App;
