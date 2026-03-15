"use client";

import { CategoryHeader as SharedCategoryHeader } from "@ce/linea-shared/category";
import { LineaLink } from "@/lib/linea-routing";

interface CategoryHeaderProps {
  category: string;
}

const CategoryHeader = ({ category }: CategoryHeaderProps) => {
  return <SharedCategoryHeader category={category} LinkComponent={LineaLink} />;
};

export default CategoryHeader;
