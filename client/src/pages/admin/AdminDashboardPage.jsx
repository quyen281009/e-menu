import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { getToken, setToken } from "../../utils/auth.js";
import { socket } from "../../socket.js";
import api from "../../utils/api";

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

apiClient.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

const AdminDashboardPage = () => {
  const [foods, setFoods] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("orders");
  const [editingFood, setEditingFood] = useState(null);
  const [foodForm, setFoodForm] = useState({
    name: "",
    price: "",
    image: "",
    description: "",
    category: ""
  });
  const navigate = useNavigate();

const loadData = async () => {
  try {
    const [foodsRes, ordersRes] = await Promise.all([
      apiClient.get("/api/foods"),
      apiClient.get("/api/orders"),
    ]);

    console.log("foodsRes:", foodsRes.data);
    console.log("ordersRes:", ordersRes.data);

    const foodsData =
      foodsRes.data.foods || foodsRes.data.data || foodsRes.data;

    const ordersData =
      ordersRes.data.orders || ordersRes.data.data || ordersRes.data;

    // ✅ FIX CHUẨN
    setFoods(Array.isArray(foodsData) ? foodsData : []);
    setOrders(Array.isArray(ordersData) ? ordersData : []);
  } catch (err) {
    if (err.response?.status === 401) {
      setToken("");
      navigate("/admin/login");
    }
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    console.log("SOCKET CONNECTED:", socket.connected);
  
    const handleNewOrder = (order) => {
      console.log("NEW ORDER RECEIVED", order);
  
      const audio = new Audio("/ding.mp3");
      audio.volume = 1;
      audio.currentTime = 0;
      audio.play().catch((err) => console.log("AUDIO ERROR", err));
  
      setOrders((prev) => [order, ...prev]);
      setTab("orders");
    };
  
    socket.on("newOrder", handleNewOrder);
  
    return () => {
      socket.off("newOrder", handleNewOrder);
    };
  }, []);

  const handleFoodSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...foodForm,
        price: Number(foodForm.price)
      };
      if (editingFood) {
        await api.put(`/api/foods/${editingFood._id}`, payload);
      } else {
        await api.post("/api/foods", payload);
      }
      setFoodForm({
        name: "",
        price: "",
        image: "",
        description: "",
        category: ""
      });
      setEditingFood(null);
      await loadData();
    } catch (err) {
      alert("Failed to save food");
    }
  };

  const handleEditFood = (food) => {
    setEditingFood(food);
    setFoodForm({
      name: food.name,
      price: food.price,
      image: food.image || "",
      description: food.description || "",
      category: food.category || ""
    });
  };

  const handleDeleteFood = async (foodId) => {
    if (!window.confirm("Delete this food item?")) return;
    try {
      await api.delete(`/api/foods/${foodId}`);
      await loadData();
    } catch {
      alert("Failed to delete food");
    }
  };

  const handleToggleFood = async (food) => {
    try {
      await api.put(`/api/foods/${food._id}`, {
        isAvailable: !food.isAvailable
      });
      await loadData();
    } catch {
      alert("Failed to update food status");
    }
  };

  const handleOrderStatusChange = async (orderId, status) => {
    try {
      await api.put(`/api/orders/${orderId}`, { status });
      await loadData();
    } catch {
      alert("Failed to update order");
    }
  };


  const handleLogout = () => {
    setToken("");
    navigate("/admin/login");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-sm">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <h1 className="font-bold text-primary">Admin Dashboard</h1>
          <button
            onClick={handleLogout}
            className="text-xs text-gray-600 border rounded-full px-3 py-1"
          >
            Logout
          </button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-4">
        <div className="flex gap-2 mb-4">
          <button
            className={`px-4 py-2 rounded-full text-sm ${
              tab === "foods"
                ? "bg-primary text-white"
                : "bg-white text-gray-700 border"
            }`}
            onClick={() => setTab("foods")}
          >
            Menu Items
          </button>
          <button
            className={`px-4 py-2 rounded-full text-sm ${
              tab === "orders"
                ? "bg-primary text-white"
                : "bg-white text-gray-700 border"
            }`}
            onClick={() => setTab("orders")}
          >
            Orders
          </button>
        </div>

        {tab === "foods" && (
          <div className="grid gap-4 md:grid-cols-[2fr,3fr]">
            <div className="bg-white rounded-lg shadow p-4">
              <h2 className="font-semibold mb-3 text-sm">
                {editingFood ? "Edit food" : "Create food"}
              </h2>
              <form className="space-y-3" onSubmit={handleFoodSubmit}>
                <div>
                  <label className="block text-xs mb-1">Name</label>
                  <input
                    className="w-full border rounded px-2 py-1 text-sm"
                    value={foodForm.name}
                    onChange={(e) =>
                      setFoodForm((f) => ({ ...f, name: e.target.value }))
                    }
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs mb-1">Price</label>
                  <input
                    type="number"
                    step="0.01"
                    className="w-full border rounded px-2 py-1 text-sm"
                    value={foodForm.price}
                    onChange={(e) =>
                      setFoodForm((f) => ({ ...f, price: e.target.value }))
                    }
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs mb-1">
                    Image URL (optional)
                  </label>
                  <input
                    className="w-full border rounded px-2 py-1 text-sm"
                    value={foodForm.image}
                    onChange={(e) =>
                      setFoodForm((f) => ({ ...f, image: e.target.value }))
                    }
                  />
                </div>
                <div>
                  <label className="block text-xs mb-1">
                    Category (coffee, tea, food...)
                  </label>
                  <input
                    className="w-full border rounded px-2 py-1 text-sm"
                    value={foodForm.category}
                    onChange={(e) =>
                      setFoodForm((f) => ({ ...f, category: e.target.value }))
                    }
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs mb-1">Description</label>
                  <textarea
                    className="w-full border rounded px-2 py-1 text-sm"
                    rows={3}
                    value={foodForm.description}
                    onChange={(e) =>
                      setFoodForm((f) => ({
                        ...f,
                        description: e.target.value
                      }))
                    }
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    type="submit"
                    className="bg-primary text-white text-sm rounded px-4 py-2"
                  >
                    {editingFood ? "Update" : "Create"}
                  </button>
                  {editingFood && (
                    <button
                      type="button"
                      onClick={() => {
                        setEditingFood(null);
                        setFoodForm({
                          name: "",
                          price: "",
                          image: "",
                          description: "",
                          category: ""
                        });
                      }}
                      className="text-xs text-gray-600 border rounded px-3 py-2"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </form>
            </div>

            <div className="bg-white rounded-lg shadow p-4 overflow-x-auto">
              <h2 className="font-semibold mb-3 text-sm">Menu items</h2>
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b text-left">
                    <th className="py-2 pr-2">Name</th>
                    <th className="py-2 pr-2">Category</th>
                    <th className="py-2 pr-2">Price</th>
                    <th className="py-2 pr-2">Status</th>
                    <th className="py-2 pr-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {foods.map((food) => (
                    <tr key={food._id} className="border-b last:border-0">
                    <td className="py-1 pr-2">{food.name}</td>
                  
                    <td className="py-1 pr-2">{food.category}</td>
                  
                    <td className="py-1 pr-2">
                      ${Number(food.price).toFixed(2)}
                    </td>
                  
                    <td className="py-1 pr-2">
                      {food.isAvailable ? "Available" : "Disabled"}
                    </td>
                  
                    <td className="py-1 pr-2 space-x-2">
                      <button
                        className="text-blue-600"
                        onClick={() => handleEditFood(food)}
                      >
                        Edit
                      </button>
                  
                      <button
                        className="text-yellow-600"
                        onClick={() => handleToggleFood(food)}
                      >
                        {food.isAvailable ? "Disable" : "Enable"}
                      </button>
                  
                      <button
                        className="text-red-600"
                        onClick={() => handleDeleteFood(food._id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                  ))}
                  {!foods.length && (
                    <tr>
                      <td
                        colSpan={4}
                        className="py-4 text-center text-gray-500"
                      >
                        No menu items yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {tab === "orders" && (
          <div className="bg-white rounded-lg shadow p-4 overflow-x-auto">
            <h2 className="font-semibold mb-3 text-sm">Orders</h2>
            <table className="w-full text-xs">
  <thead>
    <tr className="border-b text-left">
      <th className="py-2 pr-2">Table</th>
      <th className="py-2 pr-2">Status</th>
      <th className="py-2 pr-2">Items</th>
      <th className="py-2 pr-2">Notes</th>
      <th className="py-2 pr-2">Created</th>
      <th className="py-2 pr-2">Actions</th>
    </tr>
  </thead>

  <tbody>
    {orders.map((order) => (
      <tr key={order._id} className="border-b last:border-0">
        <td className="py-1 pr-2">{order.tableNumber}</td>

        <td className="py-1 pr-2 capitalize">{order.status}</td>

        {/* ITEMS */}
        <td className="py-1 pr-2">
          <ul className="list-disc ml-4">
            {order.items.map((item, idx) => (
              <li key={idx}>
                {item.name} x {item.quantity}
              </li>
            ))}
          </ul>
        </td>

        {/* NOTES */}
        <td className="py-1 pr-2">
          {order.items.map((item, idx) => (
            <div key={idx} className="text-gray-500 text-xs">
              {item.note ? item.note : "-"}
            </div>
          ))}
        </td>

        <td className="py-1 pr-2">
          {new Date(order.createdAt).toLocaleTimeString()}
        </td>

        <td className="py-1 pr-2 space-x-1">
          {["pending", "preparing", "completed"].map((status) => (
            <button
              key={status}
              className={`px-2 py-1 rounded-full border ${
                order.status === status
                  ? "bg-primary text-white border-primary"
                  : "bg-white text-gray-700"
              }`}
              onClick={() =>
                handleOrderStatusChange(order._id, status)
              }
            >
              {status}
            </button>
          ))}
        </td>
      </tr>
    ))}

    {!orders.length && (
      <tr>
        <td colSpan={6} className="py-4 text-center text-gray-500">
          No orders yet.
        </td>
      </tr>
    )}
  </tbody>
</table>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminDashboardPage;

