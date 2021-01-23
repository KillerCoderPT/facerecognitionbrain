// Styles
import './App.css';

// Libraries
import { Component } from 'react';
import Particles from 'react-particles-js';

// Components
import Navigation from './components/Navigation/Navigation';
import Logo from './components/Logo/Logo';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import Rank from './components/Rank/Rank';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import SignIn from './components/SignIn/SignIn';
import Register from './components/Register/Register';
import Modal from './components/Modal/Modal';
import Settings from './components/Settings/Settings';
import Profile from './components/Profile/Profile';

// Background Particles Options
const particlesOptions = {
  particles: {
    number: {
      value: 40,
      density: {
        enable: true,
        value_area: 600
      }
    }
  }
}

// Initial Obj State
const initialState = {
  input: '',
  imageUrl: '',
  boxes: [],
  route: 'signin',
  isSignedIn: false,
  isSettingsOpen: false,
  isProfileOpen: false,
  user: {
    id: '',
    name: '',
    email: '',
    entries: 0,
    joined: '',
    age: '',
    website: ''
  }
}

class App extends Component {

  // Constructor and State declaration
  constructor() {
    super();

    this.state = initialState;
  }

  // Verify if token exists
  componentDidMount() {
    const token = window.sessionStorage.getItem('token');
    if (token) {
      fetch('http://localhost:3000/signin', {
        method: 'post',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + token
        }
      }).then(resp => resp.json())
        .then(data => {
          if (data && data.id) {
            fetch(`http://localhost:3000/profile/${data.id}`, {
              method: 'get',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
              }
            }).then(resp => resp.json())
              .then(user => {
                if (user && user.email) {
                  this.loadUser(user);
                  this.onRouteChange('home');
                }
              })
              .catch(err => `Unable to load user!`);
          }
        })
        .catch(console.log)
    }
  }

  // Function to load the user into state
  loadUser = (data) => {
    this.setState({ 
      user: {
        id: data.id,
        name: data.name,
        email: data.email,
        entries: data.entries,
        joined: data.joined
      }
    });
  }

  // Function to calculate face location on Clarafai API
  calculateFaceLocation = (data) => {
    if (data && data.outputs) {
      // const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;
      const img = document.getElementById('inputImage');
      const width = Number(img.width);
      const height = Number(img.height);

      return data.outputs[0].data.regions.map(face => {
          const clarifaiFace = face.region_info.bounding_box;
          return {
            leftCol: clarifaiFace.left_col * width,
            topRow: clarifaiFace.top_row * height,
            rightCol: width - (clarifaiFace.right_col * width),
            bottomRow: height - (clarifaiFace.bottom_row * height)
          }
      }) 
    }

    return;
  }


  // Function to dislay a box arround the face
  displayFaceBoxes = (boxes) => {
    if (boxes) {
      // console.log(box);
      this.setState({boxes: boxes});
    }
  }

  // Listen for input changes
  onInputChange = (event) => {
    this.setState({ input: event.target.value });
  }

  // Function to update the Database when submit a picture
  onPictureSubmit = () => {
    this.setState({ imageUrl: this.state.input });

    fetch('http://localhost:3000/imageurl', {
      method: 'post',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + window.sessionStorage.getItem('token')
      },
      body: JSON.stringify({
          input: this.state.input
      })
    })
    .then(response => response.json())
      .then(response => {
        if (response) {
          fetch('http://localhost:3000/image', {
            method: 'put',
            headers: { 
              'Content-Type': 'application/json',
              'Authorization': 'Bearer ' + window.sessionStorage.getItem('token')
            },
            body: JSON.stringify({
                id: this.state.user.id
            })
          })
            .then(response => response.json())
            .then(count => {
              this.setState(Object.assign(this.state.user, { entries: count }))
            })
        }
        this.displayFaceBoxes(this.calculateFaceLocation(response))
      })
      .catch(err => console.log(err))
  }

  // Function to change the route
  onRouteChange = (route) => {
    if (route === 'signout') {
      return this.setState(initialState)
    } else if(route === 'home') {
      this.setState({ isSignedIn: true })
    }

    this.setState({route: route});
  }

  // Profile Settings
  toggleModalSettings = () => {
    this.setState(prevState => ({
      ...prevState,
      isSettingsOpen: !prevState.isSettingsOpen
    }));
  }
  
  // Profile
  toggleModalProfile = () => {
    this.setState(prevState => ({
      ...prevState,
      isProfileOpen: !prevState.isProfileOpen
    }));
  }

  // Render Function
  render() {
    const { isSignedIn,
      imageUrl,
      route,
      boxes,
      isSettingsOpen,
      isProfileOpen,
      user
    } = this.state;

    return (
      <div className="App">
        <Particles className='particles' params={particlesOptions} />
        <Navigation 
          isSignedIn={isSignedIn}
          onRouteChange={this.onRouteChange}
          toggleModalSettings={this.toggleModalSettings}
          toggleModalProfile={this.toggleModalProfile}
        />
        {/* Profile Settings */}
        { isSettingsOpen && 
              <Modal>
                <Settings
                  user={user}
                  isSettingsOpen={isSettingsOpen}
                  toggleModalSettings={this.toggleModalSettings}
                  loadUser={this.loadUser}
                />
              </Modal>
        }
        {/* Profile */}
        { isProfileOpen && 
              <Modal>
                <Profile 
                  isProfileOpen={isProfileOpen}
                  toggleModalProfile={this.toggleModalProfile}
                />
              </Modal>
        }
        { route === 'home' 
          ? <div>
              <Logo />
              <Rank name={this.state.user.name} entries={this.state.user.entries} />
              <ImageLinkForm 
                onInputChange={this.onInputChange}
                onPictureSubmit={this.onPictureSubmit} />
              <FaceRecognition
                boxes={boxes}
                imageUrl={imageUrl} />
            </div>
          : (
              route === 'signin' 
                ? <SignIn loadUser={this.loadUser} onRouteChange={this.onRouteChange} />
                : <Register loadUser={this.loadUser} onRouteChange={this.onRouteChange} />
            )
        }
      </div>
    );
  }
}

export default App;
