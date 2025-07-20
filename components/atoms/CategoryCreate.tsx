import { Plus } from "lucide-react";
import React from "react";

interface CategoryCreateProps {
  newCategory: string;
  setNewCategory: (value: string) => void;
  handleAddCategory: () => void;
}

const CategoryCreate: React.FC<CategoryCreateProps> = ({ newCategory, setNewCategory, handleAddCategory }) => {
  return (
    <div className="flex items-center gap-1">
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
      <button className="cursor-pointer hover:scale-110 transition-transform" onClick={handleAddCategory} disabled={!newCategory.trim()}>
        <Plus className="size-4 text-emerald-500" />
      </button>
    </div>
  );
};

export default CategoryCreate;
