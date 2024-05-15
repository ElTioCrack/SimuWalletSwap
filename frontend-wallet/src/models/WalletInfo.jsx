class WalletInfo {
    constructor(_id, nameWallet) {
        this._id = _id;
        this.nameWallet = nameWallet;
    }

    getId() {
        return this._id;
    }

    setId(_id) {
        this._id = _id;
    }
    
    getNameWallet() {
        return this.nameWallet;
    }

    setNameWallet(nameWallet) {
        this.nameWallet = nameWallet;
    }
}
