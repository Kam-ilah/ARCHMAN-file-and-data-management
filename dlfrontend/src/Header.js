import React, {Component} from 'react';
import simpledl from './simpledlnew.png';
import "./Header.css"
import profile from './profile.png';
import home from './home1.png';

const Header = () => {
    return(
        <nav>
            <ul className='navlogo'>
                <li><img className ="logo" src = {simpledl} alt="simpledl logo" width = "150px" height="45px"/></li>
                <li className='push'>
                    <div className='container'>
                        <div className='text'>
                            <link rel="preconnect" href="https://fonts.googleapis.com"/>
                            <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin/>
                            <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300&display=swap" rel="stylesheet"/>
                            <h4>Hussein Suleman</h4>
                            </div>
                        <div className='image'>
                            <img className ="profileAvatar" src = {profile} alt="profile avatar" width = "30px" height="30px"/>
                        </div>
                    </div>
                </li>
            </ul> 
            <ul className='titlebox'>
                <li className='title'>
                    <link rel="preconnect" href="https://fonts.googleapis.com"/>
                    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin/>
                    <link href="https://fonts.googleapis.com/css2?family=Quicksand:wght@300&display=swap" rel="stylesheet"/>
                    <h1>Administrative Site</h1>
                </li>
                <li className='home'>
                    <img src ={home} alt="home icon" width = "30px" height="30px"/>
                </li>
            </ul>
            <hr/>
        </nav>
    );
}

export default Header;