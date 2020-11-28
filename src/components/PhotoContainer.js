import React, { Component } from 'react';
import PropTypes from 'prop-types';


//components
import Spinner from './Spinner';
import Photo from './Photo';

//api requests
import apiKey from '../config';
import axios from 'axios';


class PhotoContainer extends Component {
    state = {
        searchPhotos: [],
        isLoading: false
    }


    // Function sends get request updates photos state with the response 
    searchPhotos = term => {
        this.setState({ isLoading: true });
        axios.get(`https://www.flickr.com/services/rest/?method=flickr.photos.search&api_key=${apiKey}&tags=${term}&per_page=24&format=json&nojsoncallback=1`)
        .then(response => {
        this.setState({ searchPhotos: response.data.photos.photo , isLoading: false });
        })
        .then(() => {
        console.log(`SUCCESSFUL RESPONSE FROM SEARCH: ${term}`);
        })
        .catch(err => {
        console.log('SEARCH ERROR: ', err);
        })
    };
    

    // runs when the photoContainer Component mounts
    componentDidMount() {
        const fixedPhotos = this.props.photoList || null;
        if (!fixedPhotos){
            this.searchPhotos(this.props.term);
        }
    }

    // runs any time the term prop is changed
    componentDidUpdate(prevProps){
        if (this.props.term !== prevProps.term){
            const fixedPhotos = this.props.photoList || null;
            if (!fixedPhotos){
                this.searchPhotos(this.props.term);
            }
        }
    }
    
    render(){
        //destructure out props and find the current picture list in the props photos
        let display;

        const { term } = this.props;
        const fixedPhotos = this.props.photoList || null;

        if (fixedPhotos) {
            display = fixedPhotos.map(photo => <Photo source={`https://live.staticflickr.com/${photo.server}/${photo.id}_${photo.secret}.jpg`} key={photo.id} />)
        } else {
            display = this.state.searchPhotos.length === 0 ?
            <h3>Unfortunately there are no results</h3> : 
            this.state.searchPhotos.map(photo => <Photo source={`https://live.staticflickr.com/${photo.server}/${photo.id}_${photo.secret}.jpg`} key={photo.id} />)
        }

        return (
            <div className="photo-container">
                {/* Title */}
                {<h2>{term} gifs</h2>}
               
                {/* //main display  */}
                    {   
                    this.state.isLoading ?
                    <Spinner />:
                    <ul>
                     {display}
                    </ul>
                    }
                
                </div>
            );
        }
         
}

PhotoContainer.propTypes = {
    term: PropTypes.string.isRequired,
    photoList: PropTypes.array,
}

export default PhotoContainer;

