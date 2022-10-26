import React from 'react';
import './App.css';
import Navigation from './components/Navigation/Navigation';
import Logo from './components/Logo/Logo'
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import Rank from './components/Rank/Rank';
import Particle from './components/Particle';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import SignIn from './components/SignIn/SignIn';
import Register from './components/Register/Register';
    

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
      this.setState({isSignedIn:false})
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
    const USER_ID = "lunakuro";
    const PAT = "a759a1ef50f94e78b7c19c8d000dbd17";
    const APP_ID = "my-first-application";
    const MODEL_ID = "face-detection";
    const MODEL_VERSION_ID = "6dc7e46bc9124c5c8824be4822abe105";  

    const raw = JSON.stringify({
      "user_app_id": {
          "user_id": USER_ID,
          "app_id": APP_ID
      },
      "inputs": [
          {
              "data": {
                  "image": {
                      "url": this.state.input
                  }
              }
          }
      ]
    });

    const requestOptions = {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Authorization': 'Key ' + PAT
        },
        body: raw
    };

    fetch("https://api.clarifai.com/v2/models/" + MODEL_ID + "/versions/" + MODEL_VERSION_ID + "/outputs", requestOptions)
        .then(response => response.json())
        .then(result => {
          if (result) {
            fetch('http://localhost:3000/image', {
              method: 'put',
              headers: {'Content-Type': 'application/json'},
              body: JSON.stringify({
                id: this.state.user.id
              })
            }).then(response => response.json())
              .then(count => {
                this.setState(Object.assign(this.state.user, {entries: count}))
            })
            this.displayFaceBox(this.calculateFaceLocation(result))
          }
        })
        .catch(error => console.log('error', error));
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
              <Rank userName={this.state.user.name} userEntries={this.state.user.entries}/>
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
