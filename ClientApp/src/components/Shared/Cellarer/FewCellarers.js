import React, { Component } from 'react';
import { Radio } from 'antd';

export const UNLIMITED = "UNLIMITED";

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
            this.setState({ seletedValue: this.props.haveUnlimited ? UNLIMITED : nextProps.items[0].value });
        }
    }

    getItems = () => {
        const { haveUnlimited, items } = this.props;
        let result = (items) ? items.map(i => <Button value={i.value} key={i.value}>{i.text}</Button>) : null;

        if (haveUnlimited) result.splice(0, 0, <Button value={UNLIMITED} key={UNLIMITED}>不限</Button>);

        return result;
    }

    // onChange = e => {
    //     this.setState({ seletedValue: e.target.value });
    //     this.props.onChange(e);
    // }

    render() {
        //let { seletedValue } = this.state;
        let { value, onChange } = this.props;

        value = value ? value : UNLIMITED;

        return (
            <Group onChange={onChange} value={value}>
                {this.getItems()}
            </Group>
        );
    }
}

FewCellarers.defaultProps = {
    haveUnlimited: false
}

export default FewCellarers;