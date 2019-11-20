import React, { Component } from 'react';
import { Radio } from 'antd';

const { Group, Button } = Radio;

class FewCellarers extends Component {
    constructor(props) {
        super(props);
        this.state = {
            seletedValue: null
        }
    }

    componentWillUpdate(nextProps, nextState) {
        if (!nextState.seletedValue && nextProps.items.length > 0) {
            this.setState({ seletedValue: nextProps.items[0].value });
        }
    }

    getItems = (items) => {
        return (items) ? items.map(i => <Button value={i.value} key={i.value}>{i.text}</Button>) : null;
    }

    onChange = e => {
        this.setState({ seletedValue: e.target.value });
        this.props.onChange(e);
    }

    render() {
        const { items } = this.props;
        const { seletedValue } = this.state;

        return (
            <Group onChange={this.onChange} value={seletedValue}>
                {this.getItems(items)}
            </Group>
        );
    }
}

export default FewCellarers;