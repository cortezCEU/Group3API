const product_model = (name, qty, size, color, id, brand, desc, price)=>{

    let Product = {
        prodID: id,
        prodName: name,
        prodDesc: desc,
        prodPrice: price,
        prodQty: qty,
        prodSize: size,
        prodColor: color,
        prodBrand: brand
    }

    return Product
}

module.exports = {
    product_model
}