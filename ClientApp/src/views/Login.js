import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from "react-router-dom";

import { isLogin } from '../utilities/authentication';
import IconInput from '../components/Shared/IconInput';
import * as actions from './LoginRedux';

class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            account: "",
            password: ""
        }
    }

    componentWillMount() {
        if (isLogin()) this.handleAlreadyLogin();
    }

    componentDidUpdate(prevProps, prevState) {
        if (isLogin()) this.handleAlreadyLogin();
    }

    handleAlreadyLogin = e => {
        this.props.history.push("/");
    }

    handleAccountChanged = e => {
        this.setState({ account: e.target.value });
    }

    handlePasswordChanged = e => {
        this.setState({ password: e.target.value });
    }

    handleLogin = () => {
        const { actions } = this.props;
        console.log("handle login", actions);
        actions.login(this.state.account, this.state.password);
    }

    render() {
        return (
            <div className="container">
                <div className="row">
                    <div className="col-md-4"></div>
                    <div className="col-md-4">
                        <LoginBlock handleAccountChanged={this.handleAccountChanged} 
                            handlePasswordChanged={this.handlePasswordChanged}
                            login={this.handleLogin}/>
                    </div>
                </div>
            </div>
            
        );
    }
}

const LoginBlock = props => {
    const { handleAccountChanged, handlePasswordChanged } = props;
    
    return (
        <div className="card">
            <article className="card-body">
                <h4 className="card-title text-center mb-4 mt-1">Sign in</h4>
                <hr />
                <form>
                    <IconInput icon="fa fa-user" placeHolder="Email or Account" type="email" onChange={handleAccountChanged} />
                    <IconInput icon="fa fa-lock" placeHolder="******" type="password" onChange={handlePasswordChanged} />
                    <div className="form-group">
                        <button type="submit" className="btn btn-primary btn-block" onClick={props.login}> Login  </button>
                    </div>
                </form>
            </article>
        </div>
    );
}



function mapStateToProps(state) {
    console.log("login state", state);
    return {
        login: state.login
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(actions, dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Login));