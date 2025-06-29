export const getCart = () => {
  const cart = localStorage.getItem("cart");
  return cart ? JSON.parse(cart) : [];
};

export const saveCart = (cart) => {
  localStorage.setItem("cart", JSON.stringify(cart));
};

export const addToCart = (item) => {
  let cart = getCart();
  const existing = cart.find((i) => i.id === item.id);
  if (existing) {
    cart = cart.map((i) =>
      i.id === item.id ? { ...i, qty: i.qty + 1 } : i
    );
  } else {
    cart.push({ ...item, qty: 1 });
  }
  saveCart(cart);
};

export const updateCartItem = (id, type) => {
  let cart = getCart();
  cart = cart.map((item) => {
    if (item.id === id) {
      const qty = type === "increment" ? item.qty + 1 : item.qty - 1;
      return { ...item, qty: qty < 1 ? 1 : qty };
    }
    return item;
  });
  saveCart(cart);
};

export const removeFromCart = (id) => {
  let cart = getCart().filter((item) => item.id !== id);
  saveCart(cart);
};
