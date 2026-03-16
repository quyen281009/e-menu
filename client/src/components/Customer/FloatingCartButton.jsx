const FloatingCartButton = ({ itemCount, onClick }) => {
  if (!itemCount) return null;

  return (
    <button
      onClick={onClick}
      className="fixed bottom-4 right-4 bg-primary text-white px-4 py-3 rounded-full shadow-lg flex items-center gap-2"
    >
      <span className="font-semibold text-sm">View Cart</span>
      <span className="bg-white text-primary rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">
        {itemCount}
      </span>
    </button>
  );
};

export default FloatingCartButton;

