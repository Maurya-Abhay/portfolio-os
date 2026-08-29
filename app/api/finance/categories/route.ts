import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { requireUser } from '@/lib/auth/session';
import { z } from 'zod';
const schema=z.object({name:z.string().min(1).max(60),type:z.enum(['INCOME','EXPENSE'])});
export async function GET(){try{const user=await requireUser();const defaults=await prisma.financeCategory.findMany({where:{OR:[{userId:null},{userId:user.id}]},orderBy:[{type:'asc'},{name:'asc'}]});return NextResponse.json(defaults);}catch{return NextResponse.json({error:'Unauthorized'},{status:401});}}
export async function POST(req:Request){try{const user=await requireUser();const p=schema.safeParse(await req.json());if(!p.success)return NextResponse.json({error:'Invalid data'},{status:400});return NextResponse.json(await prisma.financeCategory.create({data:{userId:user.id,name:p.data.name,type:p.data.type}}),{status:201});}catch{return NextResponse.json({error:'Unable to create category'},{status:400});}}
