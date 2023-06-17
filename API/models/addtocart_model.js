const addtocart_model = (id, cid, addqty, username,products) => {
    let Cart = {
        prodID: id,
        cartID: cid,
        cart_prodQty: addqty,
        userName: username,
        products:products
    }

    return Cart;
};

module.exports = {
    addtocart_model
};