/* Supabase Auth + RLS admin console. Without a configured backend, the panel is locked.
Never rely on the secret URL for security, never embed admin credentials or service role keys. */
(()=>{
const config=window.LENTIS_CONFIG||{},host=(config.supabaseUrl||'').replace(/\/$/,''),pub=config.publishableKey||'';
const $=q=>document.querySelector(q), $$=q=>Array.from(document.querySelectorAll(q));
const apiHeaders=(token)=>({apikey:pub,Authorization:'Bearer '+token,'Content-Type':'application/json'});
let auth=null,products=[],partners=[],views=[],settings={};
const escapeHTML=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const configured=Boolean(host&&pub&&/^https:\/\//.test(host));
if(!configured){$('#configurationAlert').hidden=false;$('#loginForm button').disabled=true;$('#loginMessage').textContent='Activarea panoului necesită un proiect Supabase dedicat și cont de administrator.';}
const notify=msg=>{$('#status').textContent=msg;setTimeout(()=>{if($('#status').textContent===msg)$('#status').textContent='';},5000);};
async function endpoint(path,{method='GET',body,params={},headers={}}={}){
 if(!auth?.access_token)throw Error('Trebuie să te autentifici.');
 const uri=new URL(host+'/rest/v1/'+path);for(const [k,v]of Object.entries(params))uri.searchParams.set(k,v);
 let r=await fetch(uri,{method,headers:{...apiHeaders(auth.access_token),...headers},body:body===undefined?undefined:JSON.stringify(body)});
 if(!r.ok){const err=await r.text();throw Error(err.slice(0,300));}
 return r.status===204||r.headers.get('content-length')==='0'?null:await r.json();
}
async function login(email,password){const r=await fetch(host+'/auth/v1/token?grant_type=password',{method:'POST',headers:{apikey:pub,'Content-Type':'application/json'},body:JSON.stringify({email,password})});const d=await r.json();if(!r.ok)throw Error(d.error_description||d.msg||'Date de acces incorecte');auth=d;
 const admins=await endpoint('lentis_admins',{params:{select:'user_id',user_id:'eq.'+d.user.id}});
 if(!admins?.length){auth=null;throw Error('Acest cont nu are rol de administrator Lentis.');}
 $('#loginScreen').hidden=true;$('#dashboard').hidden=false;$('#adminName').textContent=email;await reload();}
$('#loginForm').addEventListener('submit',async e=>{e.preventDefault();$('#loginMessage').textContent='Verificăm autentificarea…';try{await login($('#loginEmail').value.trim(),$('#loginPassword').value);$('#loginMessage').textContent='';}catch(ex){$('#loginMessage').textContent=ex.message;}});
$('#logout').addEventListener('click',()=>{auth=null;$('#dashboard').hidden=true;$('#loginScreen').hidden=false;$('#loginPassword').value='';});
const titles={overview:'Privire de ansamblu',products:'Catalog produse',pages:'Pagini & texte',branding:'Identitate vizuală',partners:'Cereri parteneriat',visitors:'Statistici & sesiuni',seo:'SEO & indexare'};
$$('[data-tab]').forEach(b=>b.addEventListener('click',()=>{$$('[data-tab]').forEach(x=>x.classList.toggle('active',x===b));$$('.panel-page').forEach(x=>x.hidden=x.id!=='tab-'+b.dataset.tab);$('#crumb').textContent='ADMIN / '+b.dataset.tab.toUpperCase();$('#pageTitle').textContent=titles[b.dataset.tab];}));
async function reload(){try{
 const queries=await Promise.allSettled([
 endpoint('site_products',{params:{select:'*',order:'created_at.desc',limit:'200'}}),
 endpoint('partner_requests',{params:{select:'*',order:'created_at.desc',limit:'100'}}),
 endpoint('analytics_events',{params:{select:'*',order:'created_at.desc',limit:'200'}}),
 endpoint('site_settings',{params:{select:'key,value'}})]);
 [products,partners,views]=queries.slice(0,3).map(x=>x.status==='fulfilled'?x.value:[]);settings=Object.fromEntries((queries[3].status==='fulfilled'?queries[3].value:[]).map(x=>[x.key,x.value]));
 $('#metricProducts').textContent=products.length;$('#metricPartners').textContent=partners.length;
 const recent=views.filter(v=>Date.now()-Date.parse(v.created_at)<30*864e5);$('#metricViews').textContent=recent.length;
 const online=views.filter(v=>Date.now()-Date.parse(v.created_at)<5*60e3);$('#metricOnline').textContent=new Set(online.map(v=>v.session_hash).filter(Boolean)).size;
 renderProducts();renderPartners();renderViews();renderSettings();
 if(queries.some(q=>q.status==='rejected'))notify('Unele secțiuni nu au putut fi încărcate. Verifică schema și permisiunile.');
}catch(e){notify('Eroare la încărcare: '+e.message);}}
function renderProducts(){const body=$('#productsTable');body.innerHTML=products.length?products.map(p=>`<tr><td><b>${escapeHTML(p.name)}</b><small>${escapeHTML(p.description)}</small></td><td>${escapeHTML(p.category)}</td><td>${Number(p.price).toLocaleString('ro-RO')} lei</td><td>${Number(p.stock)||0}</td><td>${p.published?'Publicat':'Draft'}</td><td><button type="button" data-edit-id="${escapeHTML(p.id)}">Editează</button></td></tr>`).join(''):'<tr><td colspan="6">Nu există produse. Adaugă primul produs.</td></tr>';}
$('#addProduct').addEventListener('click',()=>editProduct(null));$('#cancelProduct').addEventListener('click',()=>$('#productEditor').hidden=true);
$('#productsTable').addEventListener('click',e=>{let b=e.target.closest('[data-edit-id]');if(b)editProduct(products.find(p=>p.id===b.dataset.editId));});
function editProduct(p){const f=$('#productForm');f.reset();f.elements.id.value=p?.id||'';for(const key of ['name','category','price','stock','image_url','tag','description'])if(p&&f.elements[key])f.elements[key].value=p[key]??'';f.elements.published.checked=p?.published??true;$('#productEditorTitle').textContent=p?'Editează produs':'Adaugă produs';$('#productEditor').hidden=false;$('#productEditor').scrollIntoView({behavior:'smooth'});}
$('#productForm').addEventListener('submit',async e=>{e.preventDefault();const f=e.target,data=Object.fromEntries(new FormData(f).entries());const id=data.id;delete data.id;data.price=Number(data.price);data.stock=Number(data.stock);data.published=f.elements.published.checked;if(data.image_url&&!/^https:\/\//i.test(data.image_url)){notify('Imaginea trebuie să folosească HTTPS.');return;}try{
 await endpoint('site_products',{method:id?'PATCH':'POST',params:id?{id:'eq.'+id}:{},body:data,headers:{Prefer:'return=minimal'}});
 $('#productEditor').hidden=true;await reload();notify('Produs salvat.');
 }catch(err){notify('Salvare eșuată: '+err.message);}});
function renderPartners(){$('#partnersTable').innerHTML=partners.length?partners.map(p=>`<tr><td><b>${escapeHTML(p.clinic)}</b><small>${escapeHTML(p.contact)}</small></td><td>${escapeHTML(p.email)}</td><td>${escapeHTML(p.city)}</td><td><select data-partner-id="${escapeHTML(p.id)}"><option value="new" ${p.status==='new'?'selected':''}>Nouă</option><option value="contacted" ${p.status==='contacted'?'selected':''}>Contactată</option><option value="approved" ${p.status==='approved'?'selected':''}>Aprobată</option><option value="rejected" ${p.status==='rejected'?'selected':''}>Respinsă</option></select></td><td>${new Date(p.created_at).toLocaleString('ro-RO')}</td></tr>`).join(''):'<tr><td colspan="5">Nu au fost înregistrate cereri de parteneriat.</td></tr>';}
$('#partnersTable').addEventListener('change',async e=>{let s=e.target.closest('[data-partner-id]');if(!s)return;try{await endpoint('partner_requests',{method:'PATCH',params:{id:'eq.'+s.dataset.partnerId},body:{status:s.value},headers:{Prefer:'return=minimal'}});notify('Status actualizat.');}catch(err){notify(err.message);}});
function renderViews(){$('#visitorsTable').innerHTML=views.length?views.map(v=>`<tr><td>${escapeHTML(v.country||'Necunoscută')}</td><td>${escapeHTML(v.page||'/')}</td><td>${new Date(v.created_at).toLocaleString('ro-RO')}</td><td>${escapeHTML((v.session_hash||'').slice(0,10))}…</td></tr>`).join(''):'<tr><td colspan="4">Nu sunt sesiuni înregistrate sau colectarea nu este configurată.</td></tr>';}
function renderSettings(){for(const id of ['pagesForm','brandingForm','seoForm']){const f=$('#'+id);for(const field of f.elements){if(!field.name||settings[field.name]===undefined)continue;field.value=String(settings[field.name]);}}}
for(const formId of ['pagesForm','brandingForm','seoForm'])$('#'+formId).addEventListener('submit',async e=>{e.preventDefault();try{const data=Object.fromEntries(new FormData(e.target).entries());for(const [key,value]of Object.entries(data)){if(key==='accent'&&!/^#[\da-f]{6}$/i.test(value))throw Error('Culoare invalidă');if(key==='logo_url'&&value&&!/^https:\/\//.test(value))throw Error('Folosește URL HTTPS');await endpoint('site_settings',{method:'POST',body:{key,value},params:{on_conflict:'key'},headers:{Prefer:'resolution=merge-duplicates,return=minimal'}});}await reload();notify('Modificările au fost salvate.');}catch(err){notify(err.message);}});
})();