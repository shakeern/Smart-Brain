import './App.css';
import Navigation from './components/Navigation/Navigation';
import Logo from './components/Logo/Logo';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import Rank from './components/Rank/Rank';
import React from 'react';
import ParticlesBg from 'particles-bg'
import { Component } from 'react';
import Signin from './components/Signin/Signin';
import Register from './components/Register/Register';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';




const setUp = (imageUrl) => 
  {const PAT = 'a583b2640aaf48d7a7000b4edac8321a';
  
  const USER_ID = 'shakeern';       
  const APP_ID = 'face';
  
      
  const IMAGE_URL = imageUrl;

  const raw = JSON.stringify({
    "user_app_id": {
        "user_id": USER_ID,
        "app_id": APP_ID
    },
    "inputs": [
        {
            "data": {
                "image": {
                    "url": IMAGE_URL
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

return requestOptions;
}
  
  
const initalState = {
      input: '',
      imageUrl: '',
      box: {},
      route: 'signin',
      isSignedIn: false,
      user: {
        id: '',
        name: '',
        email: '',
        entries: 0,
        joined: ''
      }
    }


class  App extends Component {
  constructor(){
    super();
    this.state = initalState;
  }

  loadUser = (data) => {
    this.setState({user: {
      id: data.id,
      name: data.name,
      email: data.email,
      entries: data.entries,
      joined: data.joined
    }})
  }
  calculateFaceLoaction = (data) => {
    const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;
    const image = document.getElementById('inputimage');
    const width = Number(image.width);
    const height = Number(image.height);
    return {
      leftCol: clarifaiFace.left_col * width,
      topRow: clarifaiFace.top_row * height,
      rightCol: width - (clarifaiFace.right_col * width),
      bottomRow: height - (clarifaiFace.bottom_row * height)
    }
  }

  displayFaceBox = (box) => {
    
    this.setState({box: box});
  }
  
  onRouteChange = (route) => {
    if (route === 'signout'){
      this.setState(initalState)
    }else if (route === 'home'){
      this.setState({isSignedIn: true})
    }
    this.setState({route:route});
  }


  onInputChange = (event) => {
    this.setState({input: event.target.value});
  }

  onSubmit = () => {
    this.setState({imageUrl: this.state.input})
    this.displayFaceBox({});
    //app.models.predict('face-detection', this.state.input)
    fetch("https://api.clarifai.com/v2/models/face-detection/outputs", setUp(this.state.input))
      .then(response => response.json())
      .then(response => {
        if (response){
          fetch('http://localhost:3000/image', {
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
            id: this.state.user.id,
            
      })
          })
          .then(response => response.json())
          .then(count => {
            this.setState(Object.assign(this.state.user, {entries: count}))
          })
          .catch(console.log);
        }
        this.displayFaceBox(this.calculateFaceLoaction(response))})
      .catch(err => console.log(err));
  }
  render(){
    const {isSignedIn, imageUrl, route, box} = this.state;
    return (
      <div className="App">
      <ParticlesBg className="particles" type="square" bg={{
        position: "fixed",
        zIndex: -1,
        top: 0,
        left:0 }} />
        <Navigation isSignedIn={isSignedIn}onRouteChange={this.onRouteChange}/>
        { this.state.route === 'home' 
          ?<div>  
          <Logo />
          <Rank name={this.state.user.name} entries={this.state.user.entries}/>
          <ImageLinkForm onInputChange={this.onInputChange} onSubmit={this.onSubmit}/>    
          <FaceRecognition box = {box} imageUrl = {imageUrl}/>
          </div>
          :(
            route ==='signin'
            ?<Signin loadUser = {this.loadUser} onRouteChange={this.onRouteChange}/>
            : <Register loadUser = {this.loadUser} onRouteChange={this.onRouteChange}/>
          )
          
      }
      </div>
    );
  }
  
}

export default App;
