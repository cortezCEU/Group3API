const checkout_model = (cid, username, modeofpayment, orderdate, address, orderstatus,oid) => {
    let Checkout = {
      orderID:oid,
      cartID: cid,
      userName: username,
      mode_payment: modeofpayment,
      order_date: orderdate,
      address1: address,
      ordStat: orderstatus,
    };
    return Checkout;
  };

  

module.exports = {checkout_model}