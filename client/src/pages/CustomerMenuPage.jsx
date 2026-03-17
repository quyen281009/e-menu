import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import MenuCategoryTabs from "../components/Customer/MenuCategoryTabs.jsx";
import FoodCard from "../components/Customer/FoodCard.jsx";
import FloatingCartButton from "../components/Customer/FloatingCartButton.jsx";

const CustomerMenuPage = () => {
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState("");
  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [orderSent, setOrderSent] = useState(false);

  const tableNumber = new URLSearchParams(window.location.search).get("table") || "";

  useEffect(() => {
    const fetchFoods = async () => {
      try {
        const res = await axios.get("/api/foods");
        setFoods(Array.isArray(res.data) ? res.data : []);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchFoods();
  }, []);

  const categories = useMemo(
    () => Array.from(new Set(foods.map((f) => f.category))).sort(),
    [foods]
  );

  const filteredFoods = useMemo(
    () => (category ? foods.filter((f) => f.category === category) : foods),
    [foods, category]
  );

  const handleAddToCart = (food) => {
    setCart((prev) => {
      const existing = prev.find((item) => item._id === food._id);
      if (existing) {
        return prev.map((item) =>
          item._id === food._id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { ...food, quantity: 1, note: ""  }];
    });
  };

  const handleQuantityChange = (id, delta) => {
    setCart((prev) =>
      prev
        .map((item) =>
          item._id === id ? { ...item, quantity: item.quantity + delta } : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const total = useMemo(
    () =>
      cart.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(2),
    [cart]
  );

  const handlePlaceOrder = async () => {
    if (!tableNumber) {
      alert("Invalid QR code. Table number not found.");
      return;
    }
    if (!cart.length) return;
    setSubmitting(true);
    try {
      await axios.post("/api/orders", {
        tableNumber,
        items: cart.map((item) => ({
          food: item._id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          note: item.note || ""
          }))
      });
      setOrderSent(true);
      setCart([]);
      setShowCart(false);
    } catch (e) {
      console.error(e);
      alert("Failed to place order");
    } finally {
      setSubmitting(false);
    }
  };

  if (orderSent) {
    return (
      <div className="container-page py-10 text-center">
        <h1 className="text-2xl font-bold mb-4 text-primary">
          Order sent to kitchen
        </h1>
        <p className="text-gray-600">
          Thank you! Your order is being prepared.
        </p>
      </div>
    );
  }

  return (
    <div className="container-page py-4 pb-24">
      <header className="mb-4">
        <h1 className="text-xl font-bold text-primary">Restaurant Menu</h1>
        <p className="text-xs text-gray-500">
          Scan the QR on your table to open this menu.
        </p>
      </header>

      {loading ? (
        <p>Loading menu...</p>
      ) : (
        <>
          <MenuCategoryTabs
            categories={categories}
            activeCategory={category}
            onChange={setCategory}
          />

          <div className="space-y-3">
            {filteredFoods.map((food) => (
              <FoodCard key={food._id} food={food} onAdd={handleAddToCart} />
            ))}
            {!filteredFoods.length && (
              <p className="text-sm text-gray-500">No items in this category.</p>
            )}
          </div>
        </>
      )}

      <FloatingCartButton
        itemCount={cart.reduce((sum, i) => sum + i.quantity, 0)}
        onClick={() => setShowCart(true)}
      />

      {showCart && (
        <div className="fixed inset-0 bg-black/40 flex items-end sm:items-center justify-center z-20">
          <div className="bg-white w-full max-w-md rounded-t-2xl sm:rounded-2xl p-4 max-h-[80vh] flex flex-col">
            <div className="flex justify-between items-center mb-3">
              <h2 className="font-semibold text-lg">Your Cart</h2>
              <button
                className="text-sm text-gray-500"
                onClick={() => setShowCart(false)}
              >
                Close
              </button>
            </div>
            <div className="flex-1 overflow-y-auto space-y-3">
              {cart.map((item) => (
                <div
                  key={item._id}
                  className="flex justify-between items-center text-sm"
                >
                  <div className="flex-1">
  <p className="font-medium">{item.name}</p>

  <p className="text-xs text-gray-500">
    ${item.price.toFixed(2)} x {item.quantity}
  </p>

  <input
    type="text"
    placeholder="Add note (less sugar, no ice...)"
    className="mt-1 w-full border rounded px-2 py-1 text-xs"
    value={item.note || ""}
    onChange={(e) =>
      setCart((prev) =>
        prev.map((i) =>
          i._id === item._id ? { ...i, note: e.target.value } : i
        )
      )
    }
  />
</div>
                  <div className="flex items-center gap-2">
                    <button
                      className="w-6 h-6 border rounded-full flex items-center justify-center"
                      onClick={() => handleQuantityChange(item._id, -1)}
                    >
                      -
                    </button>
                    <span className="w-6 text-center text-xs">
                      {item.quantity}
                    </span>
                    <button
                      className="w-6 h-6 border rounded-full flex items-center justify-center"
                      onClick={() => handleQuantityChange(item._id, 1)}
                    >
                      +
                    </button>
                  </div>
                </div>
              ))}
              {!cart.length && (
                <p className="text-sm text-gray-500">
                  Your cart is empty. Add some items.
                </p>
              )}
            </div>

            <div className="pt-3 border-t mt-3 space-y-2">
              <div className="flex justify-between text-sm">
                <span>Total</span>
                <span className="font-semibold">${total}</span>
              </div>
              <button
                disabled={!cart.length || submitting}
                onClick={handlePlaceOrder}
                className="w-full bg-primary text-white rounded-lg py-2 text-sm font-semibold disabled:bg-gray-300"
              >
                {submitting ? "Placing order..." : "Place order"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerMenuPage;

