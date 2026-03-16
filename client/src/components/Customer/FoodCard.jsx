import { useState } from "react";

const FoodCard = ({ food, onAdd }) => {
  const [note, setNote] = useState("");

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden flex">
      {food.image && (
        <img
          src={food.image}
          alt={food.name}
          className="w-24 h-24 object-cover"
        />
      )}

      <div className="flex-1 p-3 flex flex-col justify-between">
        <div>
          <div className="flex justify-between items-start gap-2">
            <h3 className="font-semibold text-sm">{food.name}</h3>

            <span className="text-primary font-bold">
              ${food.price.toFixed(2)}
            </span>
          </div>

          {food.description && (
            <p className="text-xs text-gray-500 mt-1">
              {food.description}
            </p>
          )}
        </div>
        <button
          onClick={() => {
            onAdd(food, note);
            setNote("");
          }}
          className="mt-2 text-xs bg-primary text-white rounded-full px-3 py-1 self-end"
        >
          Add
        </button>
      </div>
    </div>
  );
};

export default FoodCard;