import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { requireUser } from '@/lib/auth/session';
import { z } from 'zod';

const schema = z.object({
  type: z.enum(['INCOME','EXPENSE']), amount: z.coerce.number().positive(), categoryId: z.string().optional().nullable(),
  description: z.string().max(200).optional().nullable(), date: z.string(), paymentMethod: z.string().max(80).optional().nullable()
});

export async function GET(req: Request) {
  try { const user=await requireUser(); const url=new URL(req.url); const from=url.searchParams.get('from'); const to=url.searchParams.get('to'); const type=url.searchParams.get('type'); const categoryId=url.searchParams.get('categoryId');
    const rows=await prisma.transaction.findMany({where:{userId:user.id,...(type?{type:type as 'INCOME'|'EXPENSE'}:{}),...(categoryId?{categoryId}:{}),...(from||to?{date:{...(from?{gte:new Date(from)}:{}),...(to?{lte:new Date(to+'T23:59:59.999Z')}:{})}}:{})},orderBy:{date:'desc'},include:{category:true}});
    return NextResponse.json(rows);
  } catch(e){return NextResponse.json({error:'Unauthorized'},{status:401});}
}
export async function POST(req: Request){try{const user=await requireUser();const parsed=schema.safeParse(await req.json());if(!parsed.success)return NextResponse.json({error:'Invalid transaction data'},{status:400});const d=parsed.data; if(d.categoryId){const category=await prisma.financeCategory.findFirst({where:{id:d.categoryId,OR:[{userId:user.id},{userId:null}]}});if(!category||category.type!==d.type)return NextResponse.json({error:'Invalid category'},{status:400});} const row=await prisma.transaction.create({data:{userId:user.id,type:d.type,amount:d.amount,categoryId:d.categoryId||null,description:d.description||null,date:new Date(d.date),paymentMethod:d.paymentMethod||null},include:{category:true}});return NextResponse.json(row,{status:201});}catch{return NextResponse.json({error:'Unable to create transaction'},{status:400});}}
