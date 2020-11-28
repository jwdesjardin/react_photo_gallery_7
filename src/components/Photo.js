import React from 'react';
import PropTypes from 'prop-types';

const Photo = ( (props) => {
    return (
        <li>
            <img src={props.source} alt="" />
        </li>
    );
});

Photo.propTypes = {
    source: PropTypes.string.isRequired
}

export default Photo;