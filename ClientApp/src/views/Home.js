import React, { Component } from 'react';
import { Carousel } from 'antd';

import './Home.css';
import p1 from '../static_files/retailer1.png';
import p2 from '../static_files/retailer2.png';
import p3 from '../static_files/retailer3.png';

class Home extends Component {
    render() {
        const pictures = [ p1, p2, p3 ];

        return (
            <div className="container">
                <Carousel autoplay >
                    {pictures.map((p, i) => <img src={p} alt="picture" key={i} />)}
                </Carousel>
            </div>
            
        );
    }
}

export default Home;