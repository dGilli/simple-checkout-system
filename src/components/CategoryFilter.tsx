import React from 'react';
interface CategoryFilterProps {
  categories: string[];
  activeCategory: string;
  onSelectCategory: (category: string) => void;
}
const CategoryFilter: React.FC<CategoryFilterProps> = ({
  categories,
  activeCategory,
  onSelectCategory
}) => {
  return <div className="flex-shrink-0">
      <select value={activeCategory} onChange={e => onSelectCategory(e.target.value)} className="w-full sm:w-48 p-2 border border-gray-300 rounded-md bg-white" aria-label="Filter by category">
        {categories.map(category => <option key={category} value={category}>
            {category.charAt(0).toUpperCase() + category.slice(1)}
          </option>)}
      </select>
    </div>;
};
export default CategoryFilter;