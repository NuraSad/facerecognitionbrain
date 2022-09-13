import React from "react";
import Tilt from 'react-parallax-tilt';
import brain from './brains.png';
import './Logo.css'

const Logo = () => {
    return (
        <div className="ma4 mt0">
            <Tilt className="parallax-effect pa3" perspective={500}>
                <div className="inner-element">
                    <img alt="logo" src={brain}/>
                </div>
            </Tilt>
        </div>
    );
}

export default Logo;