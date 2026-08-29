import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { requireUser } from '@/lib/auth/session';
export async function DELETE(_:Request,{params}:{params:Promise<{id:string}>}){try{const user=await requireUser();const {id}=await params;const r=await prisma.budget.deleteMany({where:{id,userId:user.id}});if(!r.count)return NextResponse.json({error:'Not found'},{status:404});return NextResponse.json({ok:true});}catch{return NextResponse.json({error:'Unable to delete'},{status:400});}}
