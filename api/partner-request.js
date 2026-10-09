/* Server-side partner intake. Requires Vercel env SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY and LENTIS_ORIGIN.
   Client never receives the service role key. Production hardening: Turnstile + durable per-IP rate limiting. */
export default async function handler(req,res){
 res.setHeader('Cache-Control','no-store');
 if(req.method!=='POST')return res.status(405).json({error:'Method not allowed'});
 const origin=process.env.LENTIS_ORIGIN||'https://lentis-optica.vercel.app';
 if(req.headers.origin!==origin)return res.status(403).json({error:'Origin not accepted'});
 const base=process.env.SUPABASE_URL,token=process.env.SUPABASE_SERVICE_ROLE_KEY;
 if(!base||!token)return res.status(503).json({error:'Partner submissions not configured'});
 const d=typeof req.body==='string'?JSON.parse(req.body):req.body||{};
 // Basic honeypot for automated form submissions.
 if(d.website)return res.status(200).json({ok:true});
 for(const k of ['clinic','contact','email','city'])if(typeof d[k]!=='string'||d[k].trim().length<2||d[k].length>200)return res.status(400).json({error:'Invalid field: '+k});
 if(!/^\S+@\S+\.\S+$/.test(d.email)||d.consent!==true)return res.status(400).json({error:'Valid email and consent required'});
 try{const response=await fetch(base.replace(/\/$/,'')+'/rest/v1/partner_requests',{method:'POST',headers:{apikey:token,Authorization:'Bearer '+token,'Content-Type':'application/json',Prefer:'return=minimal'},body:JSON.stringify({clinic:d.clinic.trim(),contact:d.contact.trim(),email:d.email.trim(),city:d.city.trim()})});if(!response.ok)return res.status(502).json({error:'Cannot store request'});return res.status(200).json({ok:true});}catch{return res.status(502).json({error:'Service unavailable'});}
}