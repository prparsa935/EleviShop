const changeProductsInCartStatus = (productsInCart, newStatus) => {
    productsInCart.forEach((productInCart, index) => {
        productsInCart[index]['status'] = newStatus;
    });
    return productsInCart;
};
export { changeProductsInCartStatus };
