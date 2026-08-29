import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { requireUser } from '@/lib/auth/session';
export async function GET(_req:Request,{params}:{params:Promise<{id:string}>}){try{await requireUser();const {id}=await params;const test=await prisma.test.findUnique({where:{id},include:{questions:{orderBy:{id:'asc'},select:{id:true,question:true,options:true,type:true,difficulty:true}}}});if(!test)return NextResponse.json({error:'Test not found'},{status:404});return NextResponse.json(test)}catch(e){return NextResponse.json({error:'Unauthorized'},{status:401})}}
