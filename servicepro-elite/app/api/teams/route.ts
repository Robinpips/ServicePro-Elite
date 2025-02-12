import { NextResponse } from 'next/server';

interface Team {
  id: number;
  name: string;
}

const teams: Team[] = [
  { id: 1, name: 'IT Support' },
  { id: 2, name: 'Customer Service' },
];

export async function GET() {
  await new Promise(resolve => setTimeout(resolve, 1000));
  return NextResponse.json(teams);
}

export async function POST(req: Request) {
  const newTeam: Omit<Team, 'id'> = await req.json();
  const team: Team = {
    ...newTeam,
    id: teams.length + 1
  };
  teams.push(team);
  return NextResponse.json(team);
}

export async function PUT(req: Request) {
  const updatedTeam: Team = await req.json();
  const index = teams.findIndex(t => t.id === updatedTeam.id);
  if (index !== -1) {
    teams[index] = updatedTeam;
    return NextResponse.json(updatedTeam);
  }
  return NextResponse.json({ error: 'Team not found' }, { status: 404 });
}

