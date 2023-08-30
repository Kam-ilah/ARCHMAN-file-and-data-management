import React, {Component} from 'react';
import './Button.css'

const Button = ({name, onClick}) => {
    return(
        <button onClick={onClick}>
            {name}
        </button> 
    );
}

export default Button;