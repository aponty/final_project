import React from 'react';
import axios from 'axios';

class Login extends React.Component {
  constructor(){
    super();
    this.state = {
      inputs: {
        email: '',
        password: ''
      }
    }
  }

  login(e){
    e.preventDefault();
    axios.post(`${this.props.url}/login`, this.state.inputs)
      .then(res => this.props.setUser(res.data))
  }

  changeInput(e, input){
    const val = e.target.value;
    this.setState(prev => {
      prev.inputs[input] = val;
      return prev;
    });
  }

  render(){
    return(
      <div className="auth-form">
        <h2>Log In</h2>
        <form onSubmit={this.login.bind(this)}>

          <label htmlFor='email'>Email</label>
          <input value={this.state.inputs.email}
            id='email' name='email' type='email'
            onChange={e => this.changeInput(e, 'email')}
          />

          <label htmlFor='password'>Password</label>
          <input value={this.state.inputs.password}
            id='password' name='password' type='password'
            onChange={e => this.changeInput(e, 'password')}
          />

          <div className="form-buttons">
            <button type="submit" className="form-button">Login</button>
            <button onClick={this.props.toggleMode} className="form-button">Sign Up</button>
          </div>

        </form>
      </div>
    )
  }
}
export default Login;
