import React, { Component } from 'react';
import { Radio } from 'antd';

const { Group, Button } = Radio;

class FewCellarers extends Component {

    getItems = (items) => {
        return (items) ? items.map(i => <Button value={i.value} key={i.value}>{i.text}</Button>) : null;
    }

    render() {
        const { items, onChange } = this.props;

        return (
            <Group onChange={onChange}>
                {this.getItems(items)}
            </Group>
        );
    }
}

export default FewCellarers;