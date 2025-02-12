import { NextResponse } from 'next/server';

interface Category {
  id: number;
  name: string;
}

const categories: Category[] = [
  { id: 1, name: 'Technical Issue' },
  { id: 2, name: 'Billing Question' },
  { id: 3, name: 'Feature Request' },
];

export async function GET() {
  await new Promise(resolve => setTimeout(resolve, 1000));
  return NextResponse.json(categories);
}

export async function POST(req: Request) {
  const newCategory: Omit<Category, 'id'> = await req.json();
  const category: Category = {
    ...newCategory,
    id: categories.length + 1
  };
  categories.push(category);
  return NextResponse.json(category);
}

export async function PUT(req: Request) {
  const updatedCategory: Category = await req.json();
  const index = categories.findIndex(c => c.id === updatedCategory.id);
  if (index !== -1) {
    categories[index] = updatedCategory;
    return NextResponse.json(updatedCategory);
  }
  return NextResponse.json({ error: 'Category not found' }, { status: 404 });
}

