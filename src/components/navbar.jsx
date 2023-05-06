import React from 'react';
import image from ".././assets/pokeapi_256.3fa72200.png"
export default class Navbar extends React.Component {

  render() {
    return (
      <div className='navbar'>
        <img className='navbar__title' src={image} />
        {/* <span className='navbar__title'>{this.props.title}</span> */}
      </div>
    )
  }
}