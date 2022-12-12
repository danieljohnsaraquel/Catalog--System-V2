import publicIp from 'public-ip';
import axios from 'axios';

const exportObject ={

    POST: function (url, data, config = {}) {
        return new Promise((resolve, reject) => {
            axios
                .post(url, data, config)
                .then(response => resolve(response.data))
                .catch(error => {
                    if (error && error.response) reject(error.response.data);
                    else reject(error);
                });
        });
    },

    formatUrl: function () {
        // The string containing the format items (e.g. "{0}")
        // will and always has to be the first argument.
        let theString = arguments[0];
    
        // start with the second argument (i = 1)
        for (let i = 1; i < arguments.length; i++) {
          // "gm" = RegEx options for Global search (more than one instance)
          // and for Multiline search
          const regEx = new RegExp('\\{' + (i - 1) + '\\}', 'gm');
          theString = theString.replace(regEx, arguments[i]);
        }
    
        return theString;
    },

    _getHost: function () {
        const hostname = window.location.hostname;
        if (hostname.includes('localhost') || hostname.includes('127.0.0.1')) {
            return 'http://127.0.0.1:3001';
        }
        if (hostname.includes('192.168')) {
            return this.formatUrl('http://{0}:3001', hostname);
        }
        return this.formatUrl(window.location.protocol + '//catalog-system.onrender.com');
    },

    _getFullUrl: function (url) {
        let args = new Array(arguments.length - 1);
        for (let i = 0; i < args.length; ++i) {
            args[i] = arguments[i + 1];
        }
        return this.formatUrl(this._getHost() + url, ...args);
    },

    _registerUser: '/accounts/register',
    _loginUser: '/accounts/login',
    _getAllEmployees: '/accounts/getAllEmployees',
    _deleteEmployee: '/accounts/deleteEmployee',
    _updateEmployeeData: '/accounts/updateData',

    _addItem: '/products/addItem',
    _getAllItems: '/products/getAllItems',
    _editItem: '/products/editItem',
    _deleteItem: '/products/deleteItem',

    _updateCartData: '/accounts/updateCartData',
    _getItemById: '/products/getItemById',
    _addOrder: '/orders/addOrder',
    _getAllOrdersOfRecipient: '/orders/getAllOrdersOfRecipient',
    _updateUserProfile: '/accounts/updateUserProfile',
    _getAllOrders: '/orders/getAllOrders',
    _getUserData: '/accounts/getUserData',
    _updateStatus: '/orders/updateStatus',
    _updateETA: '/orders/updateETA',
    

    registerUser: function(email, password, firstName, lastName, type, address) {
        const url = this._getFullUrl(this._registerUser)
        return this.POST(url, {email, password, firstName, lastName, type, address});
    },

    loginUser: function(email, password) {
        const url = this._getFullUrl(this._loginUser)
        return this.POST(url, {email, password});
    },

    getAllEmployees: function() {
        const url = this._getFullUrl(this._getAllEmployees)
        return this.POST(url, {});
    },
    
    deleteEmployee: function(id) {
        const url = this._getFullUrl(this._deleteEmployee)
        return this.POST(url, {id});
    },

    updateEmployeeData: function(id, firstName, lastName) {
        const url = this._getFullUrl(this._updateEmployeeData)
        return this.POST(url, {id, firstName, lastName});
        
    },

    addItem: function(name, brand, type, quantity, price, image) {
        const url = this._getFullUrl(this._addItem)
        return this.POST(url, {name, brand, type, quantity, price, image});
    },
    
    getAllItems: function() {
        const url = this._getFullUrl(this._getAllItems)
        return this.POST(url, {});
    },

    editItem: function(id, name, brand, type, quantity, price, image) {
        const url = this._getFullUrl(this._editItem)
        return this.POST(url, {id, name, brand, type, quantity, price, image});
    },

    deleteItem: function(id) {
        const url = this._getFullUrl(this._deleteItem)
        return this.POST(url, {id});
    },

    updateCartData: function(id, cart) {
        const url = this._getFullUrl(this._updateCartData)
        return this.POST(url, {id, cart});
    },

    getItemById: function(id) {
        const url = this._getFullUrl(this._getItemById)
        return this.POST(url, {id});
    },

    addOrder: function(recipient, status, products, eta) {
        const url = this._getFullUrl(this._addOrder)
        return this.POST(url, {recipient, status, products, eta});
    },

    getAllOrdersOfRecipient: function(id) {
        const url = this._getFullUrl(this._getAllOrdersOfRecipient)
        return this.POST(url, {id});
    },

    updateUserProfile: function(id, firstName, lastName, address) {
        const url = this._getFullUrl(this._updateUserProfile)
        return this.POST(url, {id, firstName, lastName, address});
        
    },

    getAllOrders: function() {
        const url = this._getFullUrl(this._getAllOrders)
        return this.POST(url, {});
    },

    getUserData: function(id) {
        const url = this._getFullUrl(this._getUserData)
        return this.POST(url, {id});
    },

    updateStatus: function(id, status) {
        const url = this._getFullUrl(this._updateStatus)
        return this.POST(url, {id, status});
    },

    updateETA: function(id, eta) {
        const url = this._getFullUrl(this._updateETA)
        return this.POST(url, {id, eta});
    },
    
}

export default exportObject