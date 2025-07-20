import { X } from "lucide-react";
import React from "react";

interface CategoryFilterSectionProps {
  categoryFilter: string;
  setCategoryFilter: (cat: string) => void;
  userCategories: string[];
  defaultCategories: string[];
  handleRemoveCategory: (cat: string) => void;
}

const CategoryFilterSection: React.FC<CategoryFilterSectionProps> = ({ categoryFilter, setCategoryFilter, userCategories, defaultCategories, handleRemoveCategory }) => {
  return (
    <div className="mb-2 mt-4">
      <span className="block text-xs text-slate-500 font-semibold mb-1">Filter by Category</span>
      <div className="flex flex-wrap gap-1 mb-2">
        {["all", "saved", ...userCategories].map((cat) => (
          <div key={cat} className="relative flex items-center">
            <button
              className={`px-1.5 py-0.5 rounded text-[11px] flex items-center gap-1 ${categoryFilter === cat ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-700"}`}
              style={{ minHeight: 0, minWidth: 0 }}
              onClick={() => setCategoryFilter(cat)}
            >
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
              {defaultCategories.includes(cat) ? (
                <span className="ml-1 px-1 py-0.5 rounded-full bg-green-100 text-green-700 text-[9px] font-semibold">Default</span>
              ) : (
                <span className="ml-1 px-1 py-0.5 rounded-full bg-blue-100 text-blue-700 text-[9px] font-semibold">Created</span>
              )}
            </button>
            {/* Show X for user-created categories only in filter badges */}
            {!defaultCategories.includes(cat) && (
              <button
                className="absolute -right-2 -top-2 bg-white rounded-full p-0.5 hover:bg-red-100"
                title="Remove category"
                onClick={() => handleRemoveCategory(cat)}
                tabIndex={-1}
                style={{ lineHeight: 0 }}
              >
                <X className="w-3 h-3 text-red-500" />
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoryFilterSection;
