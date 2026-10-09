/* Lentis Virtual Try-On: local camera / file, client-only image processing.
   Optional MediaPipe face landmark tracking; manual sliders always work. */
(()=>{
 let stream=null, landmarker=null, frameId=0, lastDetect=0, mode='manual', x=50,y=47,scale=62, style='classic', latestFileUrl=null;
 const markup=()=>`<div class="eyebrow">LENTIS SMART VISION · BETA</div><h2>Probează-ți ochelarii virtual</h2><p>Camera și fotografiile sunt procesate pe dispozitivul tău, nu le încărcăm pe server. Proba oferă o <b>simulare vizuală</b>, nu măsurători optometrice precise.</p>
 <div class="vt-layout"><div class="vt-stage" id="vtStage"><video id="vtVideo" autoplay playsinline muted></video><img id="vtPhoto" alt="Fotografia încărcată" hidden/><div class="vt-placeholder" id="vtPlaceholder"><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="7" r="4"/><path d="M2 22c0-6 4-9 10-9s10 3 10 9"/></svg><span>Pornește camera sau alege o fotografie</span></div><img id="vtGlasses" class="vt-glasses" src="./assets/try-classic.svg" alt="Ramă virtuală"/></div>
 <div class="vt-controls"><label for="vtStyle">Model de ramă</label><select id="vtStyle"><option value="classic">Clasic bleumarin</option><option value="blue">Modern albastru</option><option value="gold">Elegant auriu</option></select>
 <div class="vt-buttons"><button type="button" id="vtStart" class="button button-primary">Pornește camera</button><label class="vt-file button button-secondary">Încarcă foto <input type="file" id="vtFile" accept="image/*"/></label></div>
 <button type="button" class="vt-auto" id="vtAuto">Activează ajustarea automată pe față</button><div class="vt-adjust"><label>Poziție orizontală <input type="range" id="vtX" min="10" max="90" value="50"></label><label>Poziție verticală <input type="range" id="vtY" min="15" max="80" value="47"></label><label>Mărime <input type="range" id="vtScale" min="30" max="100" value="62"></label></div>
 <div id="vtFeedback" class="vt-feedback" aria-live="polite">Ramele pot fi poziționate manual pentru a se potrivi pe fotografie.</div><button type="button" id="vtStop" class="button button-secondary">Oprește camera</button></div></div>`;
 const $=(q)=>document.querySelector(q);
 const setFeedback=(t)=>{if($('#vtFeedback'))$('#vtFeedback').textContent=t;};
 function draw(){let g=$('#vtGlasses');if(g){g.style.left=x+'%';g.style.top=y+'%';g.style.width=scale+'%';g.src='./assets/try-'+style+'.svg';}}
 function stop(){if(stream){stream.getTracks().forEach(t=>t.stop());stream=null;}cancelAnimationFrame(frameId); if($('#vtVideo')){$('#vtVideo').srcObject=null;$('#vtVideo').style.display='none';}mode='manual';}
 async function camera(){stop();if(!navigator.mediaDevices?.getUserMedia){setFeedback('Acest browser nu oferă acces la cameră. Poți încărca o fotografie.');return;}try{stream=await navigator.mediaDevices.getUserMedia({video:{facingMode:'user',width:{ideal:960}},audio:false});const v=$('#vtVideo');if(!v){stop();return;}v.srcObject=stream;v.style.display='block';await v.play();$('#vtPhoto').hidden=true;$('#vtPlaceholder').hidden=true;setFeedback('Camera este activă. Ajustează ramele sau activează detectarea automată.');if(mode==='auto')tick();}catch{setFeedback('Accesul la cameră nu a fost acordat. Încarcă o fotografie sau verifică permisiunile.');}}
 async function auto(){setFeedback('Se descarcă detectorul facial. Fotografiile rămân pe dispozitiv.');try{
  const {FilesetResolver,FaceLandmarker}=await import('https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.22/+esm');
  const vision=await FilesetResolver.forVisionTasks('https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.22/wasm');
  landmarker=await FaceLandmarker.createFromOptions(vision,{baseOptions:{modelAssetPath:'https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task',delegate:'GPU'},runningMode:'VIDEO',numFaces:1});
  mode='auto';setFeedback('Ajustarea automată este activă. Dacă poziția nu e perfectă, folosește cursoarele.');tick();
 }catch(e){console.warn('Face tracking unavailable',e);mode='manual';setFeedback('Detectarea automată nu este disponibilă aici. Poți folosi ajustarea manuală.');}}
 function tick(){if(mode!=='auto')return;const v=$('#vtVideo');const now=performance.now();if(v?.readyState>=2 && v.videoWidth && now-lastDetect>120){lastDetect=now;try{
   const result=landmarker.detectForVideo(v,now);const face=result.faceLandmarks?.[0];if(face){
    // iris center landmark approx 468/473; fallback eye inner/outer corners.
    const l=face[468]||face[33],r=face[473]||face[263];if(l&&r){let cx=(l.x+r.x)*50;let cy=(l.y+r.y)*50;let dist=Math.abs(l.x-r.x)*100;
    // Video element is mirrored to match the user's view; overlay center is mirrored too.
    x=Math.max(10,Math.min(90,100-cx));y=Math.max(15,Math.min(80,cy+2));scale=Math.max(36,Math.min(92,dist*2.5));
    $('#vtX').value=x;$('#vtY').value=y;$('#vtScale').value=scale;draw();}
   }
  }catch{mode='manual';setFeedback('Ajustarea automată s-a întrerupt. Folosește cursoarele.');}}
 frameId=requestAnimationFrame(tick);}
 function open(){stop();let m=$('#modal');$('#modalContent').innerHTML=markup();m.showModal();draw();
  $('#vtStyle').addEventListener('change',e=>{style=e.target.value;draw();});
  for(let [id,key] of [['vtX','x'],['vtY','y'],['vtScale','scale']])$('#'+id).addEventListener('input',e=>{mode='manual';if(key==='x')x=+e.target.value;if(key==='y')y=+e.target.value;if(key==='scale')scale=+e.target.value;draw();});
  $('#vtStart').addEventListener('click',camera);$('#vtAuto').addEventListener('click',auto);$('#vtStop').addEventListener('click',()=>{stop();setFeedback('Camera oprită.');});
  $('#vtFile').addEventListener('change',e=>{let file=e.target.files?.[0];if(!file)return;if(!file.type.startsWith('image/')||file.size>12e6){setFeedback('Alege o imagine de maximum 12 MB.');return;}stop();if(latestFileUrl)URL.revokeObjectURL(latestFileUrl);latestFileUrl=URL.createObjectURL(file);$('#vtPhoto').src=latestFileUrl;$('#vtPhoto').hidden=false;$('#vtPlaceholder').hidden=true;setFeedback('Fotografia este afișată local. Ajustează poziția ramelor cu glisoarele.');});
  m.addEventListener('close',()=>{stop();if(latestFileUrl){URL.revokeObjectURL(latestFileUrl);latestFileUrl=null;}},{once:true});}
 window.LentisTryOn={open,stop};
})();