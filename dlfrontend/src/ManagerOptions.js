import React, {Component} from 'react';
import Button from './Button';
import './ManagerOptions.css'


const ManagerOptions = () => {
    return(
        <div className='managernav'>
            <h3 className='mantitle'>Manager Options:</h3>
            <div className='options'>
                <Button name = "Moderate"/>
                <Button name = "Manage"/>
                <Button name = "Import"/>
                <Button name = "Metadata ^"/>
                <Button name = "Force"/>
                <Button name = "Clean"/>
                <Button name = "Generate"/>
                <Button name = "Metadata ^"/> 
                <Button name = "Force"/>
                <Button name = "Clean"/> 
                <Button name = "Index"/>
            </div>
            
        </div>
    );
}

export default ManagerOptions;