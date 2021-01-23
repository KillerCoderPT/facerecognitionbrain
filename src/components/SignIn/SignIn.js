import React from 'react';
import './SignIn.css';

class SignIn extends React.Component {
    
    // Constructor and State declaration
    constructor(props) {
        super(props);
        
        this.state = {
            signInEmail: '',
            signInPassword: ''
        }
    }


    // Listen for input changes on Email and Password fields
    onEmailChange = (event) => {
        this.setState({ signInEmail: event.target.value });
    }
    onPasswordChange = (event) => {
        this.setState({ signInPassword: event.target.value });
    }

    // Save Auth Token in Session
    saveAuthTokenInSession = (token) => {
        // 'Session' only save in one tab
        window.sessionStorage.setItem('token', token);
        // // 'Local' save for all tabs
        // window.localStorage.setItem('token', token);
    }

    // Function when form is submited
    onSubmitSignIn = () => {
        fetch('http://localhost:3000/signin', {
            method: 'post',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: this.state.signInEmail,
                password: this.state.signInPassword
            })
        }).then(response => response.json())
            .then(data => {
                if (data.userId && data.success === 'true') {
                    this.saveAuthTokenInSession(data.token);
                    fetch(`http://localhost:3000/profile/${data.userId}`, {
                      method: 'get',
                      headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + data.token
                      }
                    }).then(resp => resp.json())
                      .then(user => {
                        if (user && user.email) {
                          this.props.loadUser(user);
                          this.props.onRouteChange('home');
                        }
                      })
                      .catch(err => `Unable to load user!`);
                }
            });
    }

    // Render Function
    render() {
        const { onRouteChange } = this.props;

        return (
            <article className="br3 ba b--black-10 mv4 w-100 w-50-m w-25-l mw6 shadow-5 center">
                <main className="pa4 black-80">
                    <div className="measure">
                        <fieldset id="sign_up" className="ba b--transparent ph0 mh0">
                            <legend className="f1 fw6 ph0 mh0">Sign In</legend>
                            <div className="mt3">
                                <label className="db fw6 lh-copy f5" htmlFor="email-address">Email</label>
                                <input 
                                    onChange={this.onEmailChange} 
                                    className="hover-black pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100" 
                                    type="email" 
                                    name="email-address"  
                                    id="email-address" 
                                />
                            </div>
                            <div className="mv3">
                                <label className="db fw6 lh-copy f5" htmlFor="password">Password</label>
                                <input 
                                    onChange={this.onPasswordChange}
                                    className="hover-black b pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100" 
                                    type="password" 
                                    name="password" 
                                    id="password"
                                />
                            </div>
                        </fieldset>
                        <div>
                            <input
                                onClick={this.onSubmitSignIn} 
                                className="br2 ph3 pv2 input-reset ba b--black bg-transparent grow pointer f5 dib"
                                type="submit" 
                                value="Sign in"
                            />
                        </div>
                        <div className="lh-copy mt3">
                            <p onClick={() => onRouteChange('register')} className="f5 link dim black db pointer">Register</p>
                        </div>
                    </div>
                </main>
            </article>
        );
    }
}

export default SignIn;