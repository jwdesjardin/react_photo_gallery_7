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
    photos: {},
    isLoading: true
  }

  //runs when the app Component mounts
  componentDidMount() {

    const requestOne = axios.get(`https://www.flickr.com/services/rest/?method=flickr.photos.search&api_key=${apiKey}&tags=cats&per_page=24&format=json&nojsoncallback=1`);
    const requestTwo = axios.get(`https://www.flickr.com/services/rest/?method=flickr.photos.search&api_key=${apiKey}&tags=dogs&per_page=24&format=json&nojsoncallback=1`);
    const requestThree = axios.get(`https://www.flickr.com/services/rest/?method=flickr.photos.search&api_key=${apiKey}&tags=tacos&per_page=24&format=json&nojsoncallback=1`);

    
    axios.all([requestOne, requestTwo, requestThree])
    .then(axios.spread((...responses) => {
        let photos = {...this.state.photos};
        photos.cats = responses[0].data.photos.photo;
        photos.dogs = responses[1].data.photos.photo;
        photos.tacos = responses[2].data.photos.photo;
        this.setState({ photos, isLoading: false });
    })).then(() => {
      console.log("COMPONENT DID MOUNT DATA FETCH RESULTS: ", this.state.photos);
    }).catch(err => {
      console.log("ERROR FETCHING DATA: ", err);
    });

  }

  // Function sends get request updates photos state with the response 
  searchPhotos = term => {
    this.setState({ isLoading: true });
    axios.get(`https://www.flickr.com/services/rest/?method=flickr.photos.search&api_key=${apiKey}&tags=${term}&per_page=24&format=json&nojsoncallback=1`)
    .then(response => {
      let photos = {...this.state.photos};
      photos[term] = response.data.photos.photo
      this.setState({ photos , isLoading: false });
    })
    .then(() => {
      console.log(`SUCCESSFUL RESPONSE FROM SEARCH: ${term}`);
    })
    .catch(err => {
      console.log('SEARCH ERROR: ', err);
    })
  };
 
  

  render(){
    return (
      <BrowserRouter>
        <div className="container">
          <Search />
          <Nav />
          <Switch>
            <Route exact path='/' render={ () => <Redirect to="/cats" /> } />
            <Route path="/cats" render={ () => <PhotoContainer term={'cats'} photos={this.state.photos} isLoading={this.state.isLoading}/>} />
            <Route path="/dogs" render={ () => <PhotoContainer term={'dogs'} photos={this.state.photos} isLoading={this.state.isLoading}/>} />
            <Route path="/tacos" render={ () => <PhotoContainer term={'tacos'} photos={this.state.photos} isLoading={this.state.isLoading}/>} />
            <Route exact path="/search/:term" render={ (props) => <PhotoContainer term={props.match.params.term} photos={this.state.photos} searchPhotos={this.searchPhotos} isLoading={this.state.isLoading} />}  />
            <Route component={NotFound} />
          </Switch> 
        </div>
      </BrowserRouter>
    );
  }
  
}

export default App;
