const CartModal = ({
  cart,
  onClose,
  onChangeQty,
  setCart,
  total,
  onOrder,
  submitting,
}) => {
  return (
    <div className="fixed inset-0 bg-black/40 flex items-end sm:items-center justify-center z-20">
      <div className="bg-white w-full max-w-md rounded-t-2xl sm:rounded-2xl p-4 max-h-[80vh] flex flex-col">
        <div className="flex justify-between items-center mb-3">
          <h2 className="font-semibold text-lg">Your Cart</h2>
          <button onClick={onClose}>Close</button>
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
                  placeholder="Add note..."
                  className="mt-1 w-full border rounded px-2 py-1 text-xs"
                  value={item.note || ""}
                  onChange={(e) =>
                    setCart((prev) =>
                      prev.map((i) =>
                        i._id === item._id ? { ...i, note: e.target.value } : i,
                      ),
                    )
                  }
                />
              </div>

              <div className="flex items-center gap-2">
                <button onClick={() => onChangeQty(item._id, -1)}>-</button>
                <span>{item.quantity}</span>
                <button onClick={() => onChangeQty(item._id, 1)}>+</button>
              </div>
            </div>
          ))}

          {!cart.length && <p>Your cart is empty.</p>}
        </div>

        <div className="pt-3 border-t mt-3">
          <div className="flex justify-between text-sm">
            <span>Total</span>
            <span>${total}</span>
          </div>

          <button
            disabled={!cart.length || submitting}
            onClick={onOrder}
            className="w-full bg-primary text-white py-2 mt-2"
          >
            {submitting ? "Placing..." : "Place order"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartModal;
