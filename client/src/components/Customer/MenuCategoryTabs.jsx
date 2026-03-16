const MenuCategoryTabs = ({ categories, activeCategory, onChange }) => {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2 mb-4">
      {["All", ...categories].map((cat) => (
        <button
          key={cat}
          onClick={() => onChange(cat === "All" ? "" : cat)}
          className={`px-4 py-2 rounded-full text-sm whitespace-nowrap border ${
            (activeCategory || "All") === cat
              ? "bg-primary text-white border-primary"
              : "bg-white text-gray-700 border-gray-200"
          }`}
        >
          {cat}
        </button>
      ))}
    </div>
  );
};

export default MenuCategoryTabs;

