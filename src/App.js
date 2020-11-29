import './App.css';
import React, { Component } from 'react';
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';

//api requests
import apiKey from './config';
import axios from 'axios';


//Components
import Search from './components/Search';
import Nav from './components/Nav';
import PhotoContainer from './components/PhotoContainer';
import NotFound from './components/NotFound';


class App extends Component {
  
  state = {
    photosCats: [],
    photosDogs: [],
    photosTacos: []
  }

  //runs when the app Component mounts
  componentDidMount() {

    const requestOne = axios.get(`https://www.flickr.com/services/rest/?method=flickr.photos.search&api_key=${apiKey}&tags=cats&per_page=24&format=json&nojsoncallback=1`);
    const requestTwo = axios.get(`https://www.flickr.com/services/rest/?method=flickr.photos.search&api_key=${apiKey}&tags=dogs&per_page=24&format=json&nojsoncallback=1`);
    const requestThree = axios.get(`https://www.flickr.com/services/rest/?method=flickr.photos.search&api_key=${apiKey}&tags=tacos&per_page=24&format=json&nojsoncallback=1`);

    
    axios.all([requestOne, requestTwo, requestThree])
    .then(axios.spread((...responses) => {
        this.setState({ photosCats: responses[0].data.photos.photo, photosDogs: responses[1].data.photos.photo, photosTacos: responses[2].data.photos.photo });
    })).then(() => {
      console.log("COMPONENT DID MOUNT DATA FETCH RESULTS: ", this.state.photosCats, this.state.photosDogs, this.state.photosTacos );
    }).catch(err => {
      console.log("ERROR FETCHING DATA: ", err);
    });

  }


  render(){
    return (
      <BrowserRouter basename='/react_photo_gallery_7'>
        <div className="container">
          <Search />
          <Nav />
          <Switch>
            <Route exact path='/' render={ () => <Redirect to="/cats" /> } />
            <Route path="/cats" render={ () => <PhotoContainer term={'cats'} photoList={this.state.photosCats} />} />
            <Route path="/dogs" render={ () => <PhotoContainer term={'dogs'} photoList={this.state.photosDogs} />} />
            <Route path="/tacos" render={ () => <PhotoContainer term={'tacos'} photoList={this.state.photosTacos} />} />
            <Route exact path="/search/:term" render={ (props) => <PhotoContainer term={props.match.params.term} />}  />
            <Route component={NotFound} />
          </Switch> 
        </div>
      </BrowserRouter>
    );
  }
  
}

export default App;
