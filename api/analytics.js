import {createHmac} from 'node:crypto';
/* Consent-first analytics. Does NOT store the raw IP. Hashed client IP is rotated by date.
   Geolocation comes from Vercel's country code, not client claims. No third-party tracking pixels. */
export default async function handler(req,res){
 res.setHeader('Cache-Control','no-store');
 if(req.method!=='POST')return res.status(405).json({error:'Method not allowed'});
 const origin=process.env.LENTIS_ORIGIN||'https://lentis-optica.vercel.app';
 if(req.headers.origin!==origin)return res.status(403).json({error:'Origin not accepted'});
 const base=process.env.SUPABASE_URL,token=process.env.SUPABASE_SERVICE_ROLE_KEY,salt=process.env.LENTIS_ANALYTICS_SALT;
 if(!base||!token||!salt)return res.status(503).json({error:'Analytics not configured'});
 const d=typeof req.body==='string'?JSON.parse(req.body):req.body||{};
 if(typeof d.page!=='string'||d.page.length>300||!d.page.startsWith('/'))return res.status(400).json({error:'Invalid page'});
 const ip=String(req.headers['x-forwarded-for']||'unknown').split(',')[0].trim();
 const daily=new Date().toISOString().slice(0,10);
 const session=typeof d.session==='string' && /^[a-zA-Z0-9-]{1,80}$/.test(d.session)?d.session:'unknown';
 const session_hash=createHmac('sha256',salt).update(ip+':'+session+':'+daily).digest('hex');
 const country=String(req.headers['x-vercel-ip-country']||'Unknown').slice(0,2);
 const response=await fetch(base.replace(/\/$/,'')+'/rest/v1/analytics_events',{method:'POST',headers:{apikey:token,Authorization:'Bearer '+token,'Content-Type':'application/json',Prefer:'return=minimal'},body:JSON.stringify({session_hash,country,page:d.page})}).catch(()=>null);
 return response?.ok?res.status(200).json({ok:true}):res.status(503).json({error:'Analytics temporarily unavailable'});
}