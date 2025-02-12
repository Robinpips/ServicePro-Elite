import { NextResponse } from 'next/server';

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

const users: User[] = [
  { id: 1, name: 'John Doe', email: 'john@example.com', role: 'admin' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'agent' },
];

export async function GET() {
  await new Promise(resolve => setTimeout(resolve, 1000));
  return NextResponse.json(users);
}

export async function POST(req: Request) {
  const newUser: Omit<User, 'id'> = await req.json();
  const user: User = {
    ...newUser,
    id: users.length + 1
  };
  users.push(user);
  return NextResponse.json(user);
}

export async function PUT(req: Request) {
  const updatedUser: User = await req.json();
  const index = users.findIndex(u => u.id === updatedUser.id);
  if (index !== -1) {
    users[index] = updatedUser;
    return NextResponse.json(updatedUser);
  }
  return NextResponse.json({ error: 'User not found' }, { status: 404 });
}

