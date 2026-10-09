/* Optional public content connection and consent-first analytics. Never stores camera data. */
(()=>{
const config=window.LENTIS_CONFIG||{}, url=(config.supabaseUrl||'').replace(/\/$/,''), key=config.publishableKey||'';
const safeText=(v)=>String(v||'').replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
window.LentisPlatform={partnerSubmissionEnabled:!!(config.partnerSubmissionEnabled&&url&&key),
 async submitPartner(data){if(!this.partnerSubmissionEnabled)throw Error('Not configured');const res=await fetch('/api/partner-request',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({clinic:data.clinic,contact:data.contact,email:data.email,city:data.city,consent:Boolean(data.consent)})});if(!res.ok)throw Error('Cannot submit');}};
if(url&&key){(async()=>{try{
const r=await fetch(url+'/rest/v1/site_settings?select=key,value',{headers:{apikey:key,Authorization:'Bearer '+key}});if(!r.ok)return;const rows=await r.json();const values=Object.fromEntries(rows.map(x=>[x.key,x.value]));
const apply=(selector,value)=>{const el=document.querySelector(selector);if(el&&typeof value==='string'){el.textContent=value;}};
apply('.announcement > span:first-child',values.motto);apply('.hero-content h1',values.hero_title);apply('.hero-content p',values.hero_description);apply('.footer-brand p',values.footer_description);
if(values.theme==='dark')document.documentElement.dataset.theme='dark'; if(/^#[\da-f]{6}$/i.test(values.accent||''))document.documentElement.style.setProperty('--blue',values.accent);
if(values.logo_url && /^https:\/\//.test(values.logo_url))document.querySelectorAll('.brand-word').forEach(x=>x.src=values.logo_url);
apply('.clinic-lead > p',values.clinic_description);apply('.partner-card > div > p',values.partners_description);
if(values.seo_title)document.title=values.seo_title; if(values.seo_description)document.querySelector('meta[name="description"]')?.setAttribute('content',values.seo_description);

const p=await fetch(url+'/rest/v1/site_products?select=*&published=eq.true&order=created_at.desc',{headers:{apikey:key,Authorization:'Bearer '+key}});
if(p.ok){const data=await p.json();if(data.length)window.LentisCatalogUpdate?.(data);}
}catch(e){console.warn('Lentis dynamic content unavailable',e);}})();}
const consentKey='lentis-analytics-consent-v1',banner=document.querySelector('#consentBanner');
const local=(()=>{try{return localStorage.getItem(consentKey)}catch{return null}})();
const sessionId=(()=>{try{let s=sessionStorage.getItem('lentis-visitor-session');if(!s){s=crypto.randomUUID();sessionStorage.setItem('lentis-visitor-session',s);}return s;}catch{return 'ephemeral';}})();
const send=()=>{if(!config.analyticsEnabled || !url || !key)return;fetch('/api/analytics',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({page:location.pathname,session:sessionId,referrer:document.referrer?new URL(document.referrer).origin:''}),keepalive:true}).catch(()=>{});};
if(config.analyticsEnabled && local===null)banner.hidden=false;else if(local==='yes')send();
// Only record heartbeats while the visitor has explicitly opted in.
setInterval(()=>{try{if(localStorage.getItem(consentKey)==='yes' && document.visibilityState==='visible')send();}catch{}},90000);
document.querySelector('#acceptAnalytics')?.addEventListener('click',()=>{localStorage.setItem(consentKey,'yes');banner.hidden=true;send();});
document.querySelector('#rejectAnalytics')?.addEventListener('click',()=>{localStorage.setItem(consentKey,'no');banner.hidden=true;});
})();