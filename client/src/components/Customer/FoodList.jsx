import FoodCard from "./FoodCard";

const FoodList = ({ foods, onAdd }) => {
  return (
    <div className="space-y-3">
      {foods.map((food) => (
        <FoodCard key={food._id} food={food} onAdd={onAdd} />
      ))}
      {!foods.length && (
        <p className="text-sm text-gray-500">No items in this category.</p>
      )}
    </div>
  );
};

export default FoodList;
