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
        <div className="bg-contents">
          <div className="bg-contents-light"/>
          <div className="bg-contents-coin1"/>
          <div className="bg-contents-coin2"/>
        </div>
        <Route exact path="/" component={Home} />
        <footer>
          &copy; {this.showCurrentYear()} <span>RIZON</span>
        </footer>
      </Router>
    );
  }
}

export default App;
