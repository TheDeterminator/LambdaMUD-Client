import React, {Component} from 'react';
import '../../App.css'
import Authenticate from '../Authenticate'
import axios from 'axios'
import {connect} from 'react-redux'
import {initialize, move} from '../../actions'
import Map from '../Map'
import store from '../../config/store'
import { tiles } from '../../data/maps/map_1'


class Play extends Component {
  constructor(props) {
    super(props)
    this.state = {
      message: ''
    }
  }

  handleLogout = () => {
    localStorage.removeItem('key')
    window.location.reload()
  }

  handleChange = (e) => {
    this.setState({[e.target.name]: e.target.value})
  }

  componentDidMount() {
    this.props.initialize()
    store.dispatch({ type: 'ADD_TILES', payload: {
      tiles
    }})
    document.body.classList.add("new-image")
  }

  move = (e) => {
     this.props.move(e) 
  }

  handleCommandChoice = (e) => {
    e.preventDefault()
    const command = document.getElementById('sel').value
    const playerMessage = this.state.message
    const token = 'Token ' + localStorage.getItem('key')
    this.setState({message: ''})

    switch(command) {
      case 'say':
        axios
        .post('https://lambda-adv-mud.herokuapp.com/api/adv/say/', {"message": playerMessage}, {
          headers: {
            Authorization: token,
            "Content-Type": "application/json"
          }
        })
        .then(response => {
          console.log('say', response.data)
        })
        .catch(error => {
          console.log(error)
        })
      break
    case 'shout':
      axios
      .post('https://lambda-adv-mud.herokuapp.com/api/adv/shout/', {"message": playerMessage}, {
        headers: {
          Authorization: token,
          "Content-Type": "application/json"
        }
      })
      .then(response => {
        console.log('shout', response.data)
      })
      .catch(error => {
        console.log(error)
      })
      break
    default:
      console.log('error?')
  }
  } 
 
  render() {
    return (
      <div className="play-container">
      <div className="play">
        <div className="hud">
          <div className="players">
            <div className="player-name">
              <p>Player: {this.props.playerInfo.player.name}</p>
              <p>HP: 100</p>
              <p>XP: 200</p>
            </div>
            <div className="room-players">Players In Room: {this.props.playerInfo.player.players.map((player, index) => {
              return <p key={index}>{player}</p>
            })}</div>
          </div>
          <div className="player-location">
            <h3 className="loc-name">{this.props.playerInfo.player.title}</h3>
            <h4 className="loc-description">{this.props.playerInfo.player.description}</h4>
            <h5 className="error-msg">{this.props.playerInfo.player.error_msg}</h5>
          </div>
          <div className='control-center'>
            <form id='action-form' onSubmit={this.handleCommandChoice}>
              <input className='message-input' name='message' onChange={this.handleChange} placeholder='Enter a message...' value={this.state.message} autoComplete="off"></input>
              <select form='action-form' id='sel'>
              <option value='say'>Say</option>
              <option value='shout'>Shout</option>
            </select>
            </form>
            <div className="player-nav">
              <button direction='n' className='but-n' onClick={this.move}>&#9650;</button>
              <button direction='w' onClick={this.move}>&#9664;</button>
              <button>&#9679;</button>
              <button direction='e' onClick={this.move}>&#9654;</button>
              <button direction='s' onClick={this.move}>&#9660;</button>
            </div>
          </div>
        </div>
        <Map />
      </div>
      <button className='logout' onClick={this.handleLogout}>Logout</button>
      </div>
    );
  }
  }

  const mapStateToProps = (state, ownProps) => {
    return {
      playerInfo: state.play
    }
  }
  
  export default connect(mapStateToProps, {initialize, move})(Authenticate(Play))