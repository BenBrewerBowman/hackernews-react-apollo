import React from 'react';
import { AUTH_TOKEN } from '../constants';
import { graphql, compose } from 'react-apollo';
import gql from 'graphql-tag';


class Login extends React.Component {

  state = {
    login: true,   //switch between login and signup
    email: '',
    password: '',
    name: ''
  }

  _confirm = async () => {
    const { login, name, email, password } = this.state;

    // login user and save auth token
    if (login) {
      const result = await this.props.loginMutation({
        variables: {
          email,
          password
        }
      });
      const { token } = result.data.login;
      this._saveUserData(token);
    }
    // signup user and save auth token
    else {
      const result = await this.props.signupMutation({
        variables: {
          name, 
          email, 
          password
        }
      });
      const { token } = result.data.signup;
      this._saveUserData(token);
    }
    // return to home
    this.props.history.push('/');
  }

  _saveUserData = token => {
    // WARNING, storing JWTs in local storage is not a safe auth approach. 
    // DON'T do this in a real world app.
    localStorage.setItem(AUTH_TOKEN, token);
  }

  render() {
    const { login, email, password, name } = this.state;

    return (
      <div>
        <h4 className="mv3">{login ? 'Login' : 'Sign Up'}</h4>
        <div className="flex flex-column">
          {!login && (
            <input
              value={name}
              onChange={e => this.setState({ name: e.target.value })}
              type="text"
              placeholder="Your name"
            />
          )}
          <input
            value={email}
            onChange={e => this.setState({ email: e.target.value })}
            type="text"
            placeholder="Your email address"
          />
          <input
            value={password}
            onChange={e => this.setState({ password: e.target.value })}
            type="text"
            placeholder="Choose a safe password"
          />
        </div>
        <div className="flex mt3">
          <div className="pointer mr2 button" onClick={() => this._confirm()}>
            {login ? 'login' : 'create account'}
          </div>
          <div
            className="pointer button"
            onClick={() => this.setState({ login: !login })}
          >
            {login ? 'need to create an account?' : 'already have an account?'}
          </div>
        </div>
      </div>
    );
  }
}

const SIGNUP_MUTATION = gql`
  mutation SignupMutation($email: String!, $password: String!, $name: String!) {
    signup(email: $email, password: $password, name: $name) {
      token
    }
  }
`

const LOGIN_MUTATION = gql`
  mutation LoginMutation($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
    }
  }
`
export default compose(
  graphql(SIGNUP_MUTATION, { name: 'signupMutation'}),
  graphql(LOGIN_MUTATION, { name: 'loginMutation'})
) (Login);