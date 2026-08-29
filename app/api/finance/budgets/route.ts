import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { requireUser } from '@/lib/auth/session';
import { z } from 'zod';
const schema=z.object({amount:z.coerce.number().positive(),month:z.coerce.number().int().min(1).max(12),year:z.coerce.number().int().min(2020).max(2100),categoryId:z.string().optional().nullable()});
export async function GET(){try{const user=await requireUser();return NextResponse.json(await prisma.budget.findMany({where:{userId:user.id},include:{category:true},orderBy:[{year:'desc'},{month:'desc'}]}));}catch{return NextResponse.json({error:'Unauthorized'},{status:401});}}
export async function POST(req:Request){try{const user=await requireUser();const p=schema.safeParse(await req.json());if(!p.success)return NextResponse.json({error:'Invalid budget'},{status:400});const d=p.data;if(d.categoryId){const category=await prisma.financeCategory.findFirst({where:{id:d.categoryId,userId:user.id}});if(!category||category.type!=='EXPENSE')return NextResponse.json({error:'Invalid category'},{status:400});}const row=await prisma.budget.create({data:{userId:user.id,amount:d.amount,month:d.month,year:d.year,categoryId:d.categoryId||null}});return NextResponse.json(row,{status:201});}catch{return NextResponse.json({error:'Unable to create budget'},{status:400});}}
