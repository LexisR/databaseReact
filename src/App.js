import React, { Component } from 'react';
import './App.css';
import firebase from 'firebase';
import { DB_CONFIG } from './config/config';
import Product from './Product';
import CreateProduct from './CreateProduct';
import Stock from './Stock/Stock'
import Venta from './Venta/Venta'
import 'firebase/database';

class App extends Component {
  constructor() {
    super()
    this.state = {
      products: [
        //{id: 1, name: 'proucto 1', img: 'imagen', stock: 18},
        //{id: 2, name: 'producto 2', img: 'imagen', stock: 5}
      ],
      stock: 0,
      img: 0,
    }
    this.app = firebase.initializeApp(DB_CONFIG); // inicializando firebase con la configuración guardada
    this.db = this.app.database().ref().child('products'); //referencia a la data
    this.addProduct = this.addProduct.bind(this); //para no perder el scope
    this.removeProduct = this.removeProduct.bind(this);
  }

  componentDidMount() {
    const { products } = this.state;
    this.db.on('child_added', snap => { // cuando un elemento -child- es añadido a la data de firebase
      products.push({ // pushearle estos datos
        id: snap.key,
        name: snap.val().name,
        img: snap.val().img,
        stock: snap.val().stock
      })
      this.setState({ products }) // actualizar estado
    })
    this.db.on('child_removed', snap => {
      for (let i = 0; i < products.length; i++) { // buscando el producto que se removió de la data
        if (products[i].id === snap.key) {
          products.splice(i, 1)
        }
      }
      this.setState({ products }) // actualizando estado
    })
  }

  addProduct(productName, productImg, productStock) {
    //let { products } = this.state; // let products = this.state.products;
    //console.log(products);
    //products.push({
    //  id: products.length + 1,
    //  name: productName,
    //  img: productImg,
    //  stock: productStock
    //})
    //this.setState({
    //  products //producst: products
    //})
    this.db.push().set({ name: productName, img: productImg, stock: productStock })
    this.setState( // importante pues depende del estado previo
      (prevState) => {
        return {
          stock: prevState.stock + productStock,
          img: prevState.img + productImg,
        }
      }
    );
  }

  removeProduct(productId, productStock,productImg ) {
    this.db.child(productId).remove();
    this.setState( // importante pues depende del estado previo
      (prevState) => {
        return {
          stock: prevState.stock - productStock,
          img: prevState.img - productImg,
        }
      }
    );
  }

  render() {
    return (
      <div className="products-container">
        <header>
          <h1>Catálogo</h1>
          <Stock stock={this.state.stock} />
          <Venta ventas={this.state.img} />
        </header>

        <div className="products-list">
          <ul>
            {
              this.state.products.map(product => {
                console.log(product.id)
                return (
                  <Product
                    name={product.name}
                    key={product.id}
                    stock={product.stock}
                    img={product.img}
                    id={product.id}
                    removeProduct={this.removeProduct}
                  />
                )
              })
            }
            <CreateProduct
              addProduct={this.addProduct}
            />
          </ul>
        </div>
      </div>
    );
  }
}


//** proptypes

export default App;
