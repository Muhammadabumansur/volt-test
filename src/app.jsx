import React, {Component} from 'react';
import { render } from 'react-dom';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import axios from 'axios';

import 'react-select/dist/react-select.css';

import MainMenu from './Components/MainMenu';
import Content from './Components/Content';
import Invoices from './Pages/Invoices';
import Customers from './Pages/Customers';
import Products from './Pages/Products';

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            customers: [],
            products: [],
            customerPopupOpened: false
        }

        this.addCustomerPopup = this.addCustomerPopup.bind(this)
        this.addCustomer = this.addCustomer.bind(this)
    }

    getLastID(arr) {
        return arr[arr.length-1].id;
    }

    addCustomerPopup = () => {
        this.setState({ customerPopupOpened: true })
    }

    addCustomer = (customer) => {
        let { customers } = this.state;
        let currentID = this.getLastID(customers);
        customer.id = currentID + 1;
        customers.push(customer);
        this.setState({customerPopupOpened: false, customers})
    }

    componentDidMount() {
        axios.get('/api/customers')
            .then(response => response.data)
            .then(customers => this.setState({ customers }))
            .catch(error => console.error(error));
        axios.get('/api/products')
            .then(response => response.data)
            .then(products => this.setState({ products }))
            .catch(error => console.error(error));
    }

    render() {
        return(
            <Router>
                <main>
                    <MainMenu />
                    
                    <Content>
                        <Route exact path="/" component={Invoices} />
                        <Route path="/customers" render={() => <Customers 
                                                                    customers={this.state.customers} 
                                                                    addCustomerPopup={this.addCustomerPopup}
                                                                    addCustomer={this.addCustomer}
                                                                    customerPopupOpened={this.state.customerPopupOpened} />} />
                        <Route path="/products" render={() => <Products products={this.state.products} />} />
                    </Content>
                </main>
            </Router>
        )
    }
}

render(<App />, document.getElementById('app-root'));
