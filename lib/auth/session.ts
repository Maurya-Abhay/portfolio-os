import {cookies} from 'next/headers';
import {prisma} from '@/lib/db/prisma';
import crypto from 'node:crypto';
import {cache} from 'react';

const COOKIE='portfolio_os_session';
const secret=()=>{const value=process.env.AUTH_SECRET;if(!value&&process.env.NODE_ENV==='production')throw new Error('AUTH_SECRET is required in production');return value||'dev-only-change-me';};
export function hashPassword(password:string){return new Promise<string>((resolve,reject)=>{const salt=crypto.randomBytes(16);crypto.pbkdf2(password,salt,120000,64,'sha512',(e,key)=>e?reject(e):resolve(`${salt.toString('hex')}:${key.toString('hex')}`));});}
export function verifyPassword(password:string,stored:string){return new Promise<boolean>((resolve,reject)=>{const [s,h]=stored.split(':');if(!s||!h)return resolve(false);crypto.pbkdf2(password,Buffer.from(s,'hex'),120000,64,'sha512',(e,key)=>e?reject(e):resolve(crypto.timingSafeEqual(Buffer.from(h,'hex'),key)));});}
function sign(id:string){return crypto.createHmac('sha256',secret()).update(id).digest('hex');}
export async function setSession(id:string){(await cookies()).set(COOKIE,`${id}.${sign(id)}`,{httpOnly:true,sameSite:'lax',secure:process.env.NODE_ENV==='production',path:'/',maxAge:60*60*24*30});}
export async function clearSession(){(await cookies()).delete(COOKIE);}
export const getCurrentUser=cache(async()=>{const value=(await cookies()).get(COOKIE)?.value;if(!value)return null;const [id,sig]=value.split('.');if(!id||!sig)return null;const expected=sign(id);if(sig.length!==expected.length||!crypto.timingSafeEqual(Buffer.from(sig,'hex'),Buffer.from(expected,'hex')))return null;return prisma.user.findUnique({where:{id},select:{id:true,name:true,email:true,image:true,githubUrl:true,xUrl:true,linkedinUrl:true}});});
export async function requireUser(){const u=await getCurrentUser();if(!u)throw new Error('UNAUTHORIZED');return u;}
