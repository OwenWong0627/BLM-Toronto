import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import './App.css';
import Navbar from './Components/Navbar';
import Footer from './Components/Footer';
import Home from './Pages/Home';
import ListBusiness from './Pages/ListBusiness';
import FindBusiness from './Pages/FindBusiness';
import ScrollToTopOnMount from './Components/ScrollToTopOnMount';

function App() {
   return (
      <div className="App">
         <Router>
            <Switch>
               <Route exact path="/">
                  <ScrollToTopOnMount />
                  <Navbar />
                  <Home />
                  <Footer />
               </Route>
               <Route exact path="/list-business">
                  <ScrollToTopOnMount />
                  <Navbar />
                  <ListBusiness />
                  <Footer />
               </Route>
               <Route exact path="/find-business">
                  <FindBusiness />
               </Route>
            </Switch>
         </Router>
      </div>
   );
}

export default App;
