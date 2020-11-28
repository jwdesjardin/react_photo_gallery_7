import React, { Component } from 'react';
import Spinner from './Spinner';
import Photo from './Photo';


class PhotoContainer extends Component {
    

    // runs when the photoContainer Component mounts
    componentDidMount() {
        const { term, searchPhotos, photos } = this.props;
        if (!(term === 'cats' || term === 'dogs' || term === 'tacos')) {
            if (!(term in photos)){
                searchPhotos(term)
            }
        }
    }

    // runs any time the term prop is changed
    componentDidUpdate(prevProps){
        if (this.props.term !== prevProps.term){
            const { term, searchPhotos, photos } = this.props;
            if (!(term === 'cats' || term === 'dogs' || term === 'tacos')) {
                if (!(term in photos)){
                    searchPhotos(term)
                }
            }
        }
    }
    
    render(){
        //destructure out props and find the current picture list in the props photos
        const { term, photos, isLoading } = this.props;
        const pics = photos[term];
        //Set up photoContainer display based on pics found
        let display;
        if (pics){
            display = pics.length <= 0 ? 
            <h3>Unfortunately there are no results</h3> : 
            pics.map(photo => <Photo source={`https://live.staticflickr.com/${photo.server}/${photo.id}_${photo.secret}.jpg`} key={photo.id} />)
        }
     

        return (
            <div className="photo-container">
                {/* Title */}
                { term ? <h2>{term} gifs</h2> : '' }
               
                {/* //main display  */}
                    {   
                    isLoading ?
                    <Spinner />:
                    <ul>
                     {display}
                    </ul>
                    }
                
                </div>
            );
        }
         
        
    
}

export default PhotoContainer;

