import { NextResponse } from 'next/server';
import prisma  from '@/lib/prisma';

export async function POST(request) {
    try {
        const body = await request.json();
        const rawTitle = typeof body?.title === 'string' ? body.title : '';
        const title = rawTitle.trim();
        if (!title) {
            return NextResponse.json(
                { error: 'Title is required' },
                { status: 400 }
            );
        }

        let status = body?.status;
        if (status !== undefined) {
            if (typeof status !== 'number' || !Number.isFinite(status)) {
                return NextResponse.json(
                    { error: 'status must be a number' },
                    { status: 400 }
                );
            }
        } else {
            const first = await prisma.status.findFirst({
                orderBy: { value: 'asc' },
            });
            status = first?.value ?? 1;
        }

        const task = await prisma.task.create({
            data: { title, status },
        });
        return NextResponse.json(task, { status: 201 });
    } catch (error) {
        console.error('POST /api/todo >>> ', error);
        return NextResponse.json(
            { error: 'Failed to create task' },
            { status: 500 }
        );
    }
}

export async function GET() {
    try {
        const tasks = await prisma.task.findMany();
        return NextResponse.json(tasks);
    } catch(error) {
        console.error("error >>> ", error)
        return NextResponse.json({ error: 'Failed to fetch tasks' }, { status: 500 });
    }
}