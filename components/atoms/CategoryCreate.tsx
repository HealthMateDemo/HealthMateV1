import React from "react";

interface CategoryCreateProps {
  newCategory: string;
  setNewCategory: (value: string) => void;
  handleAddCategory: () => void;
}

const CategoryCreate: React.FC<CategoryCreateProps> = ({ newCategory, setNewCategory, handleAddCategory }) => {
  return (
    <div className="flex items-center gap-2 mb-4">
      <input
        type="text"
        value={newCategory}
        onChange={(e) => setNewCategory(e.target.value)}
        placeholder="Create category..."
        className="border rounded px-2 py-1 text-xs"
        onKeyDown={(e) => {
          if (e.key === "Enter") handleAddCategory();
        }}
      />
      <button className="bg-emerald-500 text-white px-2 py-1 rounded text-xs" onClick={handleAddCategory} disabled={!newCategory.trim()}>
        Add
      </button>
    </div>
  );
};

export default CategoryCreate;
