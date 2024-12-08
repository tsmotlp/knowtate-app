"use client"

import { CategoryList } from "./category-list"
import { useEffect, useState } from "react"
import axios from "axios"
import { Category } from "@prisma/client"
import { Folder } from "lucide-react"
import { defaultCategories } from "@/components/default-categories"
import { CategoryWithIcon } from "@/types/types"
import { toast } from "sonner"


export const Sidebar = () => {
  const [categories, setCategories] = useState<CategoryWithIcon[]>(defaultCategories)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let mounted = true;

    const getAllCategories = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const response = await axios.get("/api/category");

        if (!mounted) return;

        if (response.status === 200) {
          const categories: Category[] = response.data;
          const updatedCategories = categories.map(category => ({
            ...category,
            icon: Folder
          }));
          setCategories([...defaultCategories, ...updatedCategories]);
        }
      } catch (error) {
        if (!mounted) return;
        console.error('GET CATEGORIES ERROR', error);
        toast.error('Failed to get categories');
        setError('Failed to load categories');
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    getAllCategories();

    return () => {
      mounted = false;
    };
  }, []);

  if (error) {
    return (
      <div className="h-full w-80 border-r p-4 flex items-center justify-center">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="h-full w-80 border-r flex flex-col gap-y-4 items-start justify-start p-4">
      <CategoryList
        categories={categories}
        parentId="text"
        level={0}
        isLoading={isLoading}
      />
    </div>
  )
}