import { NextResponse } from 'next/server';

interface Ticket {
  id: number;
  title: string;
  description: string;
  status: string;
  priority: string;
  assignedTo: string;
  team: string;
  requester: string;
  scheduledDate?: Date;
}

const tickets: Ticket[] = [
  { 
    id: 1, 
    title: 'Server down', 
    description: 'The main server is not responding',
    status: 'open', 
    priority: 'high', 
    assignedTo: 'John Doe',
    team: 'IT Support',
    requester: 'Jane Smith'
  },
  { 
    id: 2, 
    title: 'Email not working', 
    description: 'Unable to send or receive emails',
    status: 'in progress', 
    priority: 'medium', 
    assignedTo: 'Jane Smith',
    team: 'IT Support',
    requester: 'John Doe'
  },
];

export async function GET() {
  await new Promise(resolve => setTimeout(resolve, 1000));
  return NextResponse.json(tickets);
}

export async function POST(req: Request) {
  const newTicket: Omit<Ticket, 'id'> = await req.json();
  const ticket: Ticket = {
    ...newTicket,
    id: tickets.length + 1
  };
  tickets.push(ticket);
  return NextResponse.json(ticket);
}

export async function PUT(req: Request) {
  const updatedTicket: Ticket = await req.json();
  const index = tickets.findIndex(t => t.id === updatedTicket.id);
  if (index !== -1) {
    tickets[index] = updatedTicket;
    return NextResponse.json(updatedTicket);
  }
  return NextResponse.json({ error: 'Ticket not found' }, { status: 404 });
}

