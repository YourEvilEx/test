'use strict';
const WebSocket = require('ws');

class Processing {

  constructor(api) {
    const reconnectInterval = 5000;
    const queryTimeout = 3000;
    const connect = () => {
      if (!this.ws || WebSocket.OPEN !== this.ws.readyState) {
        try {
          this.ws = new WebSocket(api);
          this.ws.on('error', this.onError);
          this.ws.on('open', this.onOpen);
          this.ws.on('message', this.onMessage);
          this.ws.on('close', this.onClose);
          this.pool = [];
        } catch (e) {
          console.error(e);
        }
      }
      setTimeout(connect, reconnectInterval);
    };

    this.onError = this.onError.bind(this);
    this.onOpen = this.onOpen.bind(this);
    this.onMessage = this.onMessage.bind(this);
    this.onClose = this.onClose.bind(this);
    this.errorHandler = this.errorHandler.bind(this);

    connect();
  }

  send(message) {
    return new Promise((resolve, reject) => {
      this.ws.send(message, {binary: false}, error => {
        console.log('error', error);
        if (error) {
          reject(error);
        }
      });
      const id = Math.random();
      this.pool.push({
        id,
        reject,
        resolve
      });

      // setTimeout(() => {
      //   const request = this.pool.find(request => (request.id === id));
      //   if (request && request.reject) {
      //     request.reject(new Error('Timeout error'));
      //   }
      // }, this.queryTimeout);
    });
  }

  onMessage(data) {
    console.log(data);
    const last = this.pool.pop();
    if (last && last.resolve) {
      last.resolve(JSON.parse(data.toString()));
    }
  }

  onError(error) {
    console.log('error', error);
    const last = this.pool.pop();
    if (last && last.reject) {
      last.reject(error);
    }
  }

  onOpen() {
    console.log('open');
  }

  onClose(data) {
    console.log('close', data);
    for(let i in this.pool) {
      this.pool[i].reject(new Error('Closed'));
    }
  }

  errorHandler(error) {
    if (error) {
      console.log('errorHandler', error);
    }
  }

  _makeRequest(code, data) {
    const request = {
      "version": 1,
      "opcode": code,
      "PoW_hashid": 0,
      "PoW_result": "",
      "timestamp": Math.ceil((new Date()).getTime() / 1000),
      "nonce": 0,
      "data": data
    };

    return this.send(JSON.stringify(request));
  }

  static get CODE() {
    return {
      CLIENT_INFO: 1,
      CREATE_CLIENT: 2,
      BLOCK_CLIENT: 3,
      VERIFY_CLIENT: 5,
      LIST_ACCOUNTS: 6,
      NEW_AUTH: 7,
      COMPARE_AUTH: 8,
      CHECK_AUTH: 10,
      ACCOUNT_INFO: 16,
      OPEN_ACCOUNT: 17,
      CLOSE_ACCOUNT: 18,
      TRANSFER: 19,
      DEPOSIT: 20,
      WITHDRAW: 21,
    };
  }

  clientInfo(id) {
    return this._makeRequest(Processing.CODE.CLIENT_INFO, {id});
  }

  createClient(name, individual) {
    return this._makeRequest(Processing.CODE.CREATE_CLIENT, {name, individual});
  }

  blockClient(id) {
    return this._makeRequest(Processing.CODE.BLOCK_CLIENT, {id});
  }

  verifyClient(id) {
    return this._makeRequest(Processing.CODE.VERIFY_CLIENT, {id});
  }

  listAccounts(id) {
    return this._makeRequest(Processing.CODE.LIST_ACCOUNTS, {id});
  }

  newAuth(id, password) {
    return this._makeRequest(Processing.CODE.NEW_AUTH, {id, password});
  }

  compareAuth(id, password) {
    return this._makeRequest(Processing.CODE.COMPARE_AUTH, {id, password});
  }

  checkAuth(token) {
    return this._makeRequest(Processing.CODE.CHECK_AUTH, {token});
  }

  accountInfo(id) {
    return this._makeRequest(Processing.CODE.ACCOUNT_INFO, {id});
  }

  openAccount(id) {
    return this._makeRequest(Processing.CODE.OPEN_ACCOUNT, {client: id, currency: 0});
  }

  closeAccount(id) {
    return this._makeRequest(Processing.CODE.CLOSE_ACCOUNT, {id: parseInt(id, 10)});
  }

  transfer(sender, recipient, amount) {
    return this._makeRequest(Processing.CODE.TRANSFER, {sender: parseInt(id, 10), recipient: parseInt(id, 10), amount});
  }

  deposit(id, amount) {
    return this._makeRequest(Processing.CODE.DEPOSIT, {id: parseInt(id, 10), amount});
  }

  withdraw(id, amount) {
    return this._makeRequest(Processing.CODE.WITHDRAW, {id: parseInt(id, 10), amount});
  }

}

module.exports = Processing;
