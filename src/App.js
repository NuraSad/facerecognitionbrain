import React from 'react';
import './App.css';
import Navigation from './components/Navigation/Navigation';
import Logo from './components/Logo/Logo'
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import Entries from './components/Entries/Entries';
import Particle from './components/Particle';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import SignIn from './components/SignIn/SignIn';
import Register from './components/Register/Register';
    
const initialState = { 
  input: "",
  IMAGE_URL: "",
  box: {},
  route: "SignIn",
  isSignedIn: false,
  user: {
    id: '',
    name: '',
    email: '',
    entries: 0,
    joined: ''
  }
}

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      input: "",
      IMAGE_URL: "",
      box: {},
      route: "SignIn",
      isSignedIn: false,
      user: {
        id: '',
        name: '',
        email: '',
        entries: 0,
        joined: ''
      }
    }
  }

  onRouteChange = (route) => {
    if (route === "SignIn") {
      this.setState(initialState)
    } else if (route === 'home') {
      this.setState({isSignedIn:true})
    }
    this.setState({route: route})
  }

  onInputChange = (event) => {
    this.setState({input: event.target.value});
  }

  loadUser = (data) => {
    this.setState({user: {
        id: data.id,
        name: data.name,
        email: data.email,
        entries: data.entries,
        joined: data.joined
      }
    })
  }

  calculateFaceLocation = (data) => {
    const FaceLocation = data.outputs[0].data.regions[0].region_info.bounding_box;
    const ImageDetec = document.getElementById('inputimage');
    const ImageWidth = Number(ImageDetec.width);
    const ImageHeight = Number(ImageDetec.height);
    return {
      leftCol: FaceLocation.left_col * ImageWidth,
      topRow: FaceLocation.top_row * ImageHeight,
      rightCol: ImageWidth - (FaceLocation.right_col * ImageWidth),
      bottomRow: ImageHeight -(FaceLocation.bottom_row * ImageHeight)
    }
  }

  displayFaceBox = (box) => {
    this.setState({box: box});
  }
  
  onImageSubmit = () => {
    this.setState({IMAGE_URL : this.state.input});
  
    fetch('https://facerecognitionbrainapi.onrender.com/image', {
      method: 'post',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        input: this.state.input
      })
    })
    .then(response => response.json() )
    .then(response => {
        if (response) {
          fetch('https://facerecognitionbrainapi.onrender.com/entries', {
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
              id: this.state.user.id
            })
          }).then(response => response.json())
            .then(count => {
              this.setState(Object.assign(this.state.user, {entries: count}))
          })
            .catch(console.log)
            this.displayFaceBox(this.calculateFaceLocation(response))
          }
        })
      .catch(error => console.log('unable to work with Clarifai', error));
  }

  render() {
    const {isSignedIn, IMAGE_URL, route, box} = this.state;
    return (
      <div className="App">
        <Particle />
        <Navigation onRouteChange={this.onRouteChange} isSignedIn={isSignedIn}/>
        { route === 'home' 
          ? <div>
              <Logo />
              <Entries userName={this.state.user.name} userEntries={this.state.user.entries}/>
              <ImageLinkForm 
                onInputChange={this.onInputChange} 
                onImageSubmit={this.onImageSubmit}/>
              <FaceRecognition 
                box={box} 
                ImageUrl={IMAGE_URL}/>
            </div>
          : (
            route === 'SignIn'
            ? <SignIn loadUser={this.loadUser} onRouteChange={this.onRouteChange} />
            : <Register  loadUser={this.loadUser} onRouteChange={this.onRouteChange}/>
            )
        }
      </div>
    );
  }
}

export default App;
