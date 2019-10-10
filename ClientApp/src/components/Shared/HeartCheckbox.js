import React, { Component } from 'react';

import 'pretty-checkbox/dist/pretty-checkbox.min.css';

class HeartCheckbox extends Component {
    onChange = e => {
        this.props.onChange(e.target.checked);
    }

    render() {
        const { text, onChange } = this.props;
        
        return (
            <div className="pretty p-icon p-round p-tada p-plain">
                <input type="checkbox" onChange={this.onChange}/>
                <div className="state p-danger-o">
                    <i className="icon fas fa-heart"></i>
                    <label>{text}</label>
                </div>
            </div>
        );
    }
}

export default HeartCheckbox;