import { Prisma, PrismaClient, QuestionType, TransactionType } from '@prisma/client';
import fs from 'node:fs';
import path from 'node:path';

const prisma = new PrismaClient();
type TopicPack = {track:string;trackName:string;module:string;moduleOrder:number;topicOrder:number;title:string;slug:string;content:{overview:string;diagram:string;example:string;commonMistakes:string;practice:string;interviewQuestion:string;codeExample:string}};
const packs: TopicPack[] = JSON.parse(fs.readFileSync(path.join(process.cwd(),'data','study-content.json'),'utf8'));

const slugify = (s:string)=>s.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'').slice(0,70);
const pick = <T,>(arr:T[], i:number)=>arr[i % arr.length];

function questionPair(t: TopicPack, nearby: string[]) {
  const distractors = nearby.filter(x=>x!==t.title).slice(0,3);
  while(distractors.length<3) distractors.push(pick(['Debugging','Testing','Performance','Security','Data modeling'], distractors.length));
  const q1Options=[t.title,...distractors].sort((a,b)=>a.localeCompare(b));
  const q1={type:QuestionType.MCQ,question:`Which concept best matches this description?\n\n${t.content.overview}`,options:q1Options,answer:t.title,explanation:`${t.title} is the concept described. Do not stop at the definition: connect it to the mechanism, example and failure cases in the lesson.`};
  const q2Options=['Build the smallest working example, test an edge case, and explain the trade-off','Memorize the API name and skip implementation details','Copy a solution without checking why it works','Assume a happy-path demo proves the design is production-ready'];
  const q2={type:t.track==='dsa'?QuestionType.DSA:QuestionType.SCENARIO,question:`You are learning “${t.title}”. Which study approach demonstrates practical understanding?`,options:q2Options,answer:q2Options[0],explanation:`The useful loop is explain → implement/solve → break → debug → compare alternatives → test boundaries. This turns ${t.title} into a transferable skill.`};
  const q3Options=['Ignore validation and trust the input','Trace the data flow, validate boundaries, and test failure cases','Only test the largest happy-path example','Move all logic into the UI and skip server-side checks'];
  const q3={type:QuestionType.DEBUGGING,question:`A feature involving “${t.title}” works for the happy path but fails for unexpected input. What should you do first?`,options:q3Options,answer:q3Options[1],explanation:`Boundary validation and a small reproducible failure expose the actual contract. From there, fix the underlying behavior rather than hiding the error.`};
  return [q1,q2,q3];
}

async function main(){
  const start=Date.now();
  const owner=await prisma.user.upsert({where:{email:'portfolio-owner@example.com'},update:{name:'Portfolio Owner'},create:{email:'portfolio-owner@example.com',name:'Portfolio Owner',passwordHash:null}});

  // Remove the small placeholder study seed from Parts 1–3 so the final curriculum is the single source of truth.
  await prisma.question.deleteMany({where:{id:{startsWith:'seed-q-'}}});
  await prisma.test.deleteMany({where:{id:{startsWith:'seed-test-'}}});
  await prisma.topicResource.deleteMany({where:{id:{startsWith:'seed-resource-'}}});
  await prisma.studyModule.deleteMany({where:{id:{in:['seed-full-stack-0','seed-full-stack-1','seed-full-stack-2','seed-dsa-0','seed-dsa-1','seed-ai-0','seed-ai-1']}}});

  // Keep the original finance defaults.
  const defaultCategories=[['Salary',TransactionType.INCOME],['Freelance',TransactionType.INCOME],['Food',TransactionType.EXPENSE],['Transport',TransactionType.EXPENSE],['Bills',TransactionType.EXPENSE],['Shopping',TransactionType.EXPENSE],['Education',TransactionType.EXPENSE],['Health',TransactionType.EXPENSE],['Other',TransactionType.EXPENSE]] as const;
  for(const [name,type] of defaultCategories){const id=`default-${type.toLowerCase()}-${slugify(name)}`;await prisma.financeCategory.upsert({where:{id},update:{name,type,isDefault:true,userId:null},create:{id,name,type,isDefault:true,userId:null}})}

  const grouped=new Map<string,TopicPack[]>();
  for(const p of packs){const key=`${p.track}::${p.module}`;(grouped.get(key)??grouped.set(key,[]).get(key)!).push(p)}
  const testsByTrack: Record<string,string[]>={ 'full-stack':[], dsa:[], ai:[] };
  const resourceRows: Array<{id:string;topicId:string;title:string;url:string;type:string}> = [];
  const questionRows: Prisma.QuestionCreateManyInput[] = [];

  for(const [track,trackName] of Object.entries(Object.fromEntries(Object.entries(packs.reduce((m,p)=>{m[p.track]=p.trackName;return m},{} as Record<string,string>))))) {
    const first=packs.find(p=>p.track===track)!;
    const category=await prisma.studyCategory.upsert({where:{slug:track},update:{name:trackName,description:first.track==='full-stack'?'Modern web development from browser fundamentals to production systems.':first.track==='dsa'?'Java data structures and algorithms for interview problem solving.':'Practical AI engineering from Python and ML foundations to LLM applications, RAG and agents.',sortOrder:track==='full-stack'?0:track==='dsa'?1:2},create:{slug:track,name:trackName,description:first.track==='full-stack'?'Modern web development from browser fundamentals to production systems.':first.track==='dsa'?'Java data structures and algorithms for interview problem solving.':'Practical AI engineering from Python and ML foundations to LLM applications, RAG and agents.',sortOrder:track==='full-stack'?0:track==='dsa'?1:2}});
    const modules=[...grouped.entries()].filter(([k])=>k.startsWith(track+'::')).sort((a,b)=>a[1][0].moduleOrder-b[1][0].moduleOrder);
    for(const [key,topicPacks] of modules){
      const firstTopic=topicPacks[0];
      const moduleId=`seed-${track}-${slugify(firstTopic.module)}`;
      const module=await prisma.studyModule.upsert({where:{id:moduleId},update:{name:firstTopic.module,description:`${firstTopic.module}: a structured set of ${topicPacks.length} focused learning topics.`,categoryId:category.id,sortOrder:firstTopic.moduleOrder},create:{id:moduleId,name:firstTopic.module,description:`${firstTopic.module}: a structured set of ${topicPacks.length} focused learning topics.`,categoryId:category.id,sortOrder:firstTopic.moduleOrder}});
      const topicIdBySlug = new Map<string,string>();
      for(const tp of topicPacks){
        const topic=await prisma.studyTopic.upsert({where:{moduleId_slug:{moduleId:module.id,slug:tp.slug}},update:{title:tp.title,description:tp.content.overview,example:tp.content.example,codeExample:tp.content.codeExample,content:tp.content.overview,diagram:tp.content.diagram,commonMistakes:tp.content.commonMistakes,practice:tp.content.practice,interviewQuestion:tp.content.interviewQuestion,sortOrder:tp.topicOrder,difficulty:2},create:{moduleId:module.id,title:tp.title,slug:tp.slug,description:tp.content.overview,example:tp.content.example,codeExample:tp.content.codeExample,content:tp.content.overview,diagram:tp.content.diagram,commonMistakes:tp.content.commonMistakes,practice:tp.content.practice,interviewQuestion:tp.content.interviewQuestion,sortOrder:tp.topicOrder,difficulty:2}});
        topicIdBySlug.set(tp.slug, topic.id);
        const resourceId=`seed-resource-${track}-${tp.slug}`;
        resourceRows.push({id:resourceId,topicId:topic.id,title:'Study checklist & explanation',url:`/dashboard/study/topic/${topic.id}`,type:'internal'});
      }

      const testId=`seed-test-${track}-${slugify(firstTopic.module)}`;
      const test=await prisma.test.upsert({where:{id:testId},update:{title:`${firstTopic.module} — Knowledge Check`,description:`A focused test covering ${firstTopic.module} in the ${trackName} track.`,categoryId:category.id,moduleId:module.id,difficulty:2,durationMin:Math.max(10,Math.ceil(topicPacks.length*1.5)),passingScore:70},create:{id:testId,title:`${firstTopic.module} — Knowledge Check`,description:`A focused test covering ${firstTopic.module} in the ${trackName} track.`,categoryId:category.id,moduleId:module.id,difficulty:2,durationMin:Math.max(10,Math.ceil(topicPacks.length*1.5)),passingScore:70}});
      testsByTrack[track].push(test.id);
      const titles=topicPacks.map(x=>x.title);
      for(const tp of topicPacks){
        const topicId = topicIdBySlug.get(tp.slug)!;
        const qs=questionPair(tp,titles);
        for(let qi=0;qi<qs.length;qi++){
          const q=qs[qi];
          const id=`seed-q-${track}-${slugify(firstTopic.module)}-${tp.slug}-${qi}`;
          questionRows.push({
            id,
            testId: test.id,
            topicId,
            type: q.type,
            question: q.question,
            options: q.options ?? Prisma.JsonNull,
            answer: q.answer,
            explanation: q.explanation,
            difficulty: 2,
          });
        }
      }
    }
  }

  if(resourceRows.length){
    for(let i=0;i<resourceRows.length;i+=200){
      await prisma.topicResource.createMany({data:resourceRows.slice(i,i+200),skipDuplicates:true});
    }
  }

  if(questionRows.length){
    for(let i=0;i<questionRows.length;i+=200){
      await prisma.question.createMany({data:questionRows.slice(i,i+200),skipDuplicates:true});
    }
  }

  console.log(`Seeded ${packs.length} detailed topics across Full Stack, DSA and AI.`);
  console.log(`Created/updated ${Object.values(testsByTrack).flat().length} module knowledge checks and ${packs.length*3} question-bank questions.`);
  console.log('Development owner:',owner.email);
  console.log(`Seed finished in ${((Date.now()-start)/1000).toFixed(2)}s`);
}
main().catch(e=>{console.error(e);process.exit(1)}).finally(()=>prisma.$disconnect());
