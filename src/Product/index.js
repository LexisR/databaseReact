import React, { Component } from 'react';
import './index.css';

class Product extends Component {
  constructor(props) {
    super(props)
    this.removeProduct = this.removeProduct.bind(this)
    
  }

  removeProduct() {
    alert('removing ' + this.props.id);
    this.props.removeProduct(this.props.id, this.props.stock , this.props.img);
  }

  render() {
    return(
      <li>
        <span className='remove-btn' onClick={this.removeProduct}>eliminar</span>
        <p>{this.props.name}</p>
        <p>{this.props.stock}</p>
        <p>{this.props.img}</p>
      </li>
    )
  }
}


export default Product;