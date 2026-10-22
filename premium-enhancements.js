/* Premium interaction layer for TamilTune. Keeps the existing vanilla app and its data model. */
(() => {
  'use strict';
  const $ = (s, root=document) => root.querySelector(s);
  const $$ = (s, root=document) => [...root.querySelectorAll(s)];
  const esc = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const read = (key, fallback) => { try { return JSON.parse(localStorage.getItem(`tt-ui-${key}`) || JSON.stringify(fallback)); } catch { return fallback; } };
  const write = (key, value) => { try { localStorage.setItem(`tt-ui-${key}`, JSON.stringify(value)); } catch {} };
  const sampleSongs = [
    {id:'s1',title:'Sample Melody One',artist:'Sample artist',album:'Illustrative album · Evergreen'},
    {id:'s2',title:'Golden Hour Tune',artist:'Sample artist',album:'Illustrative album · Classics'},
    {id:'s3',title:'A Quiet Evening',artist:'Sample artist',album:'Illustrative album · Romance'},
    {id:'s4',title:'Rain on the Window',artist:'Sample composer',album:'Illustrative album · Instrumental'},
    {id:'s5',title:'Village Festival Beat',artist:'Sample artist',album:'Illustrative album · Folk'},
    {id:'s6',title:'Morning Prayer',artist:'Sample vocalist',album:'Illustrative album · Devotional'},
    {id:'s7',title:'City Lights',artist:'Sample artist',album:'Illustrative album · New era'},
    {id:'s8',title:'Blue Horizon',artist:'Sample artist',album:'Illustrative album · International'},
    {id:'s9',title:'Old Radio Memories',artist:'Sample vocalist',album:'Illustrative album · Old songs'},
    {id:'s10',title:'Soft Monsoon',artist:'Sample artist',album:'Illustrative album · Melody'},
    {id:'s11',title:'Festival Lights',artist:'Sample artist',album:'Illustrative album · Dance'},
    {id:'s12',title:'Strings at Dawn',artist:'Sample composer',album:'Illustrative album · Classical'}
  ];
  // Add a curated, compact set of home collections so discovery feels deeper without overcrowding the hero.
  const homePage=$('#page-home');
  if(homePage && !$('#tt-home-collections')) {
    const collections=document.createElement('div');collections.id='tt-home-collections';
    collections.innerHTML=`<div class="sectionhead"><div><div class="eyebrow">CURATED FOR EVERY MOOD</div><h2>More music to discover</h2><p>Illustrative collections · not live rankings</p></div><button class="textbtn" data-go="explore">Explore all →</button></div><div id="tt-home-collection-rows"></div><div class="sectionhead"><div><div class="eyebrow">YOUR JOURNEY CONTINUES</div><h2>Recently recognised</h2><p>Recognition attempts saved on this browser</p></div><button class="textbtn" data-go="history">View history →</button></div><div id="tt-home-recognised"></div>`;
    const homeSongs=$('#homeSongs');if(homeSongs)homeSongs.insertAdjacentElement('afterend',collections);
  }
  function renderHomeCollections(){
    const root=$('#tt-home-collection-rows');if(!root)return;
    const groups=[['New releases',['s7','s11','s8']],['Golden age classics',['s2','s9','s12']],['Evergreen melodies',['s1','s3','s10']],['Folk & devotional',['s5','s6','s4']]];
    const card=s=>`<article class="songcard"><div class="cover ${({s1:'c1',s2:'c2',s3:'c3',s4:'c4',s5:'c5',s6:'c6',s7:'c7',s8:'c8',s9:'c2',s10:'c3',s11:'c7',s12:'c6'}[s.id]||'c1')}"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M4 12h3l2-6 3 12 3-9 2 5h3" stroke-linecap="round" stroke-linejoin="round"/></svg><span class="coverlabel">SAMPLE</span></div><div class="songline"><div class="songmeta"><b>${esc(s.title)}</b><span>${esc(s.album)} · Illustrative</span></div><button class="heart ${read('favourites',[]).includes(s.id)?'saved':''}" data-heart="${s.id}" aria-label="${read('favourites',[]).includes(s.id)?'Remove favourite':'Add favourite'} ${esc(s.title)}">${read('favourites',[]).includes(s.id)?'♥':'♡'}</button></div><button class="textbtn" data-song="${s.id}">View details ↗</button></article>`;
    root.innerHTML=groups.map(([title,ids])=>`<section class="tt-home-collection"><div class="sectionhead"><div><h2>${title}</h2><p>Selected examples from the sample catalogue</p></div><button class="textbtn" data-go="explore">View all →</button></div><div class="songgrid">${ids.map(id=>sampleSongs.find(s=>s.id===id)).filter(Boolean).map(card).join('')}</div></section>`).join('');
    const rec=$('#tt-home-recognised');if(rec){const items=read('history',[]).filter(x=>['recording','upload'].includes(x.type)).slice(0,3);rec.innerHTML=items.length?`<div class="listrows">${items.map(x=>`<div class="historyitem"><div class="historyicon">♫</div><div class="historyinfo"><b>${esc(x.title)}</b><small>${esc(x.type)} · ${esc(x.date)}</small></div><span class="demo-tag">Demo</span></div>`).join('')}</div>`:`<div class="panel"><p>No recognition attempts yet. When you record or select a file, your demo attempt will appear here. <button class="textbtn" data-go="record">Try recording →</button></p></div>`;}
  }

  const brandMark = `<svg viewBox="0 0 64 64" role="img" aria-label="TamilTune botanical sound loop" fill="none"><defs><linearGradient id="ttBrandGrad" x1="8" y1="10" x2="58" y2="55" gradientUnits="userSpaceOnUse"><stop stop-color="#8DAF91"/><stop offset=".55" stop-color="#254D3B"/><stop offset="1" stop-color="#18372B"/></linearGradient></defs><path class="loop" d="M48 17C58 27 56 42 45 50C33 59 16 53 12 40C8 27 17 13 30 12C38 11 45 15 49 22C54 31 48 40 39 42C30 44 22 38 23 30C24 24 29 21 35 22" stroke="url(#ttBrandGrad)" stroke-width="4.2" stroke-linecap="round"/><path d="M11 34H17L21 26L26 42L31 19L36 45L41 29L45 35H52" stroke="#254D3B" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/><path class="leaf" d="M38 10C42 2 53 4 56 10C51 17 43 18 38 10Z" fill="#8DAF91" stroke="#254D3B" stroke-width="1.4"/><path d="M39 11L51 9" stroke="#254D3B" stroke-width="1.2" stroke-linecap="round"/><circle cx="17" cy="48" r="2.2" fill="#C6A15B"/></svg>`;
  $$('[data-logo]').forEach(el => { el.innerHTML = brandMark; el.setAttribute('aria-label','TamilTune'); });

  // Sidebar collapse is a real preference, not a decorative control.
  const sidebar = $('.sidebar'), main = $('.main');
  if (sidebar && main && !$('.tt-nav-toggle')) {
    const toggle = document.createElement('button');
    toggle.className = 'tt-nav-toggle'; toggle.type = 'button'; toggle.innerHTML = '‹ <span>Collapse navigation</span>';
    toggle.setAttribute('aria-expanded','true');
    sidebar.insertBefore(toggle, $('.navlabel', sidebar));
    const applyCollapsed = collapsed => {
      sidebar.classList.toggle('collapsed', collapsed); main.classList.toggle('sidebar-collapsed', collapsed);
      toggle.setAttribute('aria-expanded', String(!collapsed));
      toggle.innerHTML = collapsed ? '› <span>Expand navigation</span>' : '‹ <span>Collapse navigation</span>';
      toggle.setAttribute('aria-label', collapsed ? 'Expand navigation' : 'Collapse navigation');
    };
    applyCollapsed(read('sidebarCollapsed', false));
    toggle.addEventListener('click', () => { const next = !sidebar.classList.contains('collapsed'); applyCollapsed(next); write('sidebarCollapsed', next); });
  }

  // Add a dedicated Playlists view to the existing application shell.
  const mainEl = $('.main');
  if (mainEl && !$('#page-playlists')) {
    const page = document.createElement('section');
    page.className = 'page'; page.id = 'page-playlists';
    page.innerHTML = `<div class="pagehead"><div class="eyebrow">YOUR PERSONAL SOUNDTRACK</div><h1>Playlists</h1><p>Gather the sample songs that belong together. Playlists are saved locally in this browser.</p></div><div class="tt-playlist-head"><div><h2 style="margin:0">Your collections</h2><p style="margin:5px 0 0;color:var(--muted);font-size:13px">Create a mood, memory, or moment of your own.</p></div><button class="btn primary" id="tt-create-playlist">＋ Create playlist</button></div><div id="tt-playlist-list" class="tt-playlist-grid" style="margin-top:18px"></div><div class="resultnote" style="margin-top:22px">Demo mode: playlists and selected song IDs are stored in this browser only.</div>`;
    const historyPage = $('#page-history');
    if (historyPage) mainEl.insertBefore(page, historyPage);
  }
  // Dedicated live-listening screen. It visualises actual microphone input only while permission is active.
  if (mainEl && !$('#page-live')) {
    const live=document.createElement('section');live.className='page';live.id='page-live';
    live.innerHTML=`<div class="pagehead"><div class="eyebrow">LISTEN IN REAL TIME</div><h1>Live recognition</h1><p>Listen to your environment or hum a melody. The waveform uses actual microphone input only after you start listening.</p></div><div class="panel tt-live-panel"><span class="tt-live-indicator" id="tt-live-status">Microphone off</span><h2 style="font-family:Georgia,serif;font-weight:500;font-size:28px;margin:18px 0 6px" id="tt-live-title">Ready when you are</h2><p id="tt-live-copy" style="color:var(--muted);margin:0">Nothing is being recorded or listened to yet.</p><div style="font:500 25px Georgia,serif;color:var(--forest);margin-top:16px" id="tt-live-timer">00:00</div><canvas class="tt-live-canvas" id="tt-live-wave" width="900" height="120" aria-label="Live microphone waveform; static sample until listening starts"></canvas><div class="tt-live-controls"><button class="btn primary" id="tt-live-start">Start listening</button><button class="btn secondary" id="tt-live-stop" disabled>Stop listening</button></div><p class="tt-live-note">Privacy: microphone access is requested only after you press Start. Audio stays in this browser and is not sent to a recognition service. Song matching is not connected.</p><div class="resultnote" style="text-align:left;margin-top:20px"><b>Candidate results</b><p style="margin:5px 0 0">No candidates yet. This prototype does not run a live song-identification engine.</p></div></div>`;
    const recordPage=$('#page-record');if(recordPage)mainEl.insertBefore(live,recordPage.nextSibling);
  }
  let liveStream=null,liveContext=null,liveAnalyser=null,liveRaf=0,liveStartedAt=0,liveClock=null;
  const liveCanvas=$('#tt-live-wave'),liveCtx=liveCanvas?.getContext('2d');
  function drawLiveWave(actual=false){if(!liveCanvas||!liveCtx)return;const w=liveCanvas.width,h=liveCanvas.height;liveCtx.clearRect(0,0,w,h);liveCtx.strokeStyle='#d4e0d0';liveCtx.lineWidth=1;liveCtx.beginPath();liveCtx.moveTo(0,h/2);liveCtx.lineTo(w,h/2);liveCtx.stroke();if(actual&&liveAnalyser){const d=new Uint8Array(liveAnalyser.fftSize);liveAnalyser.getByteTimeDomainData(d);liveCtx.strokeStyle='#254D3B';liveCtx.lineWidth=2;liveCtx.beginPath();d.forEach((v,i)=>{const x=i/(d.length-1)*w,y=v/255*h;i?liveCtx.lineTo(x,y):liveCtx.moveTo(x,y)});liveCtx.stroke();}else{for(let i=0;i<72;i++){const bh=4+Math.abs(Math.sin(i*.51))*9;liveCtx.fillStyle='#b7cdb5';liveCtx.fillRect(i/72*w,h/2-bh/2,3,bh);}}}
  drawLiveWave(false);
  function stopLive(){if(!liveStream&&!$('#page-live.active'))return;clearInterval(liveClock);cancelAnimationFrame(liveRaf);liveStream?.getTracks().forEach(t=>t.stop());liveStream=null;if(liveContext){liveContext.close().catch(()=>{});liveContext=null;}liveAnalyser=null;const status=$('#tt-live-status');if(status){status.classList.remove('is-live');status.textContent='Microphone off';$('#tt-live-title').textContent='Listening stopped';$('#tt-live-copy').textContent='No audio is being captured. Start again whenever you are ready.';$('#tt-live-start').disabled=false;$('#tt-live-stop').disabled=true;liveCanvas?.setAttribute('aria-label','Sample waveform; microphone is off');drawLiveWave(false);}}
  async function startLive(){$('#tt-live-timer').textContent='00:00';if(!navigator.mediaDevices?.getUserMedia||!(window.AudioContext||window.webkitAudioContext)){ $('#tt-live-copy').textContent='This browser cannot access microphone input here. Try a current browser on localhost or HTTPS.';return;}$('#tt-live-start').disabled=true;$('#tt-live-title').textContent='Requesting microphone access…';try{liveStream=await navigator.mediaDevices.getUserMedia({audio:{echoCancellation:true,noiseSuppression:true,autoGainControl:true}});liveContext=new(window.AudioContext||window.webkitAudioContext)();liveAnalyser=liveContext.createAnalyser();liveAnalyser.fftSize=1024;liveContext.createMediaStreamSource(liveStream).connect(liveAnalyser);liveStartedAt=Date.now();$('#tt-live-status').classList.add('is-live');$('#tt-live-status').textContent='Listening · microphone active';$('#tt-live-title').textContent='Listening to your melody…';$('#tt-live-copy').textContent='The waveform reflects your actual microphone input. Song matching is not connected.';$('#tt-live-start').disabled=true;$('#tt-live-stop').disabled=false;liveCanvas.setAttribute('aria-label','Actual microphone input waveform');liveClock=setInterval(()=>{const secs=Math.floor((Date.now()-liveStartedAt)/1000);$('#tt-live-timer').textContent=`${String(Math.floor(secs/60)).padStart(2,'0')}:${String(secs%60).padStart(2,'0')}`;},250);const draw=()=>{if(liveStream){drawLiveWave(true);liveRaf=requestAnimationFrame(draw);}};draw();}catch(err){liveStream?.getTracks().forEach(t=>t.stop());liveStream=null;$('#tt-live-start').disabled=false;$('#tt-live-status').classList.remove('is-live');$('#tt-live-status').textContent='Microphone unavailable';$('#tt-live-title').textContent=err.name==='NotAllowedError'?'Microphone permission denied':'Could not start listening';$('#tt-live-copy').textContent='Allow microphone access in your browser settings and use localhost or HTTPS. No audio has been sent anywhere.';drawLiveWave(false);}}
  $('#tt-live-start')?.addEventListener('click',startLive);$('#tt-live-stop')?.addEventListener('click',stopLive);document.addEventListener('click',e=>{const go=e.target.closest('[data-go]');if(go&&go.dataset.go!=='live')stopLive();});window.addEventListener('pagehide',stopLive);

  const sideNav = $('#sideNav');
  const mobileNav = $('#mobileNav');
  if (mobileNav && !mobileNav.querySelector('[data-nav="playlists"]')) {
    const b=document.createElement('button');b.dataset.go='playlists';b.dataset.nav='playlists';b.innerHTML='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="4" y="4" width="16" height="16" rx="3"/><path d="M8 9h8M8 13h8M8 17h4"/></svg><span>Playlists</span>';
    const lib=mobileNav.querySelector('[data-nav="library"]');if(lib?.nextSibling)mobileNav.insertBefore(b,lib.nextSibling);else mobileNav.appendChild(b);
  }
  if (sideNav && !sideNav.querySelector('[data-nav="playlists"]')) {
    const b = document.createElement('button'); b.dataset.go='playlists'; b.dataset.nav='playlists';
    b.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="4" y="4" width="16" height="16" rx="3"/><path d="M8 9h8M8 13h8M8 17h4"/></svg><span>Playlists</span>`;
    const libraryNav = sideNav.querySelector('[data-nav="library"]');
    if (libraryNav?.nextSibling) sideNav.insertBefore(b, libraryNav.nextSibling); else sideNav.appendChild(b);
  }

  let playlistOpen = null;
  const playlistData = () => read('playlists', []);
  const savePlaylists = list => write('playlists', list);
  const songById = id => sampleSongs.find(s => s.id === id) || {id, title:'Unavailable sample song', artist:'Metadata unavailable', album:'Sample entry'};
  let activeDialog = null, returnFocus = null;
  function closeDialog() { if (!activeDialog) return; activeDialog.remove(); activeDialog = null; returnFocus?.focus?.(); }
  function dialog(title, description, content, actions) {
    closeDialog(); returnFocus = document.activeElement;
    const back = document.createElement('div'); back.className = 'modalback show'; back.style.zIndex='90'; back.setAttribute('role','presentation');
    back.innerHTML = `<div class="tt-modal-content" role="dialog" aria-modal="true" aria-labelledby="tt-dialog-title" aria-describedby="tt-dialog-copy"><h2 id="tt-dialog-title">${esc(title)}</h2><p id="tt-dialog-copy">${esc(description)}</p>${content}<div class="tt-modal-actions">${actions}</div></div>`;
    back.addEventListener('click', e => { if (e.target === back) closeDialog(); });
    back.addEventListener('keydown', e => { if (e.key === 'Escape') { e.preventDefault(); closeDialog(); } if (e.key === 'Tab') { const f=$$('button,input,select,[tabindex="0"]',back).filter(x=>!x.disabled); if(!f.length)return; if(e.shiftKey&&document.activeElement===f[0]){e.preventDefault();f[f.length-1].focus()}else if(!e.shiftKey&&document.activeElement===f[f.length-1]){e.preventDefault();f[0].focus()} } });
    document.body.appendChild(back); activeDialog=back; $('button,input,select',back)?.focus(); return back;
  }
  function renderPlaylists() {
    const root = $('#tt-playlist-list'); if (!root) return;
    const playlists = playlistData();
    if (!playlists.length) {
      root.innerHTML = `<div class="empty" style="grid-column:1/-1"><div class="emptyicon">♫</div><h3>Your first playlist starts here</h3><p>Collect sample songs by mood, memory, or moment. Your playlists stay in this browser.</p><button class="btn primary" data-tt-playlist="create">＋ Create playlist</button></div>`; return;
    }
    root.innerHTML = playlists.map(p => {
      const songs = (p.songs||[]).map(songById);
      const expanded = playlistOpen === p.id;
      return `<article class="tt-playlist-card"><div class="tt-playlist-art" aria-hidden="true"><svg viewBox="0 0 80 80" fill="none" stroke="currentColor" stroke-width="1.4"><circle cx="40" cy="40" r="27"/><circle cx="40" cy="40" r="18"/><circle cx="40" cy="40" r="6" fill="#C6A15B"/><path d="M12 40C20 14 52 9 66 28" stroke-linecap="round"/><path d="M24 60C40 69 60 59 66 44" stroke-linecap="round"/></svg></div><h3>${esc(p.name)}</h3><p>${songs.length} ${songs.length===1?'song':'songs'} · Local playlist</p><div class="tt-playlist-actions"><button class="btn soft" data-tt-playlist="view" data-id="${esc(p.id)}">${expanded?'Hide songs':'View songs'}</button><button class="btn secondary" data-tt-playlist="add" data-id="${esc(p.id)}">＋ Add songs</button><button class="btn secondary" data-tt-playlist="rename" data-id="${esc(p.id)}">Rename</button><button class="btn secondary" data-tt-playlist="delete" data-id="${esc(p.id)}">Delete</button></div><div class="tt-playlist-songs" ${expanded?'':'hidden'}>${songs.length?songs.map(s=>`<div class="tt-playlist-song"><span>${esc(s.title)} <small style="color:var(--muted)">· ${esc(s.artist)}</small></span><button type="button" aria-label="Remove ${esc(s.title)} from ${esc(p.name)}" title="Remove from playlist" data-tt-playlist="remove-song" data-id="${esc(p.id)}" data-song-id="${esc(s.id)}">×</button></div>`).join(''):'<p style="font-size:12px;color:var(--muted)">No songs yet. Choose “Add songs” to begin.</p>'}</div></article>`;
    }).join('');
  }
  function createPlaylist() {
    const back = dialog('Create a playlist','Give this collection a name. You can add songs next.',`<label for="tt-playlist-name" style="display:block;font-size:12px;font-weight:700;margin-bottom:7px">Playlist name</label><input class="field" id="tt-playlist-name" maxlength="60" placeholder="e.g. Quiet evenings" style="width:100%"><p id="tt-playlist-error" style="color:#9c3d34;font-size:12px;margin:7px 0 0" aria-live="polite"></p>`,`<button class="btn secondary" data-tt-dialog="cancel">Cancel</button><button class="btn primary" data-tt-dialog="create">Create playlist</button>`);
    $('#tt-playlist-name',back).addEventListener('keydown',e=>{if(e.key==='Enter'){e.preventDefault();$('[data-tt-dialog="create"]',back).click();}});
  }
  function editPlaylist(id, mode) {
    const list=playlistData(), p=list.find(x=>x.id===id); if(!p)return;
    if(mode==='rename') {
      const back=dialog('Rename playlist','Choose a name that is easy to recognise.',`<label for="tt-playlist-name" style="display:block;font-size:12px;font-weight:700;margin-bottom:7px">Playlist name</label><input class="field" id="tt-playlist-name" maxlength="60" value="${esc(p.name)}" style="width:100%"><p id="tt-playlist-error" style="color:#9c3d34;font-size:12px;margin:7px 0 0" aria-live="polite"></p>`,`<button class="btn secondary" data-tt-dialog="cancel">Cancel</button><button class="btn primary" data-tt-dialog="rename" data-id="${esc(id)}">Save name</button>`); $('#tt-playlist-name',back).focus();
    } else if(mode==='add') {
      const existing=new Set(p.songs||[]);
      const choices=sampleSongs.map(s=>`<label class="tt-song-option"><input type="checkbox" value="${s.id}" ${existing.has(s.id)?'checked':''}><span><b>${esc(s.title)}</b><br><small style="color:var(--muted)">${esc(s.artist)} · illustrative sample</small></span></label>`).join('');
      const back=dialog('Add songs','Select the illustrative songs you want in this playlist.',`<div class="tt-song-picker">${choices}</div><p id="tt-playlist-error" style="color:#9c3d34;font-size:12px;margin:7px 0 0" aria-live="polite"></p>`,`<button class="btn secondary" data-tt-dialog="cancel">Cancel</button><button class="btn primary" data-tt-dialog="add" data-id="${esc(id)}">Save songs</button>`);
      back.dataset.playlistId=id;
    } else if(mode==='delete') {
      const back=dialog('Delete this playlist?','This permanently removes this local playlist. Your library and history will not be deleted.',`<p style="padding:12px;background:#f3e8df;border-radius:10px;color:#704c3d">${esc(p.name)} · ${(p.songs||[]).length} saved song references</p>`,`<button class="btn secondary" data-tt-dialog="cancel">Keep playlist</button><button class="btn primary" data-tt-dialog="delete" data-id="${esc(id)}">Delete playlist</button>`);
    }
  }
  document.addEventListener('click', e => {
    const playlistAction=e.target.closest('[data-tt-playlist]');
    if (playlistAction) {
      const action=playlistAction.dataset.ttPlaylist, id=playlistAction.dataset.id;
      if(action==='create'){createPlaylist();return;}
      if(action==='view'){playlistOpen=playlistOpen===id?null:id;renderPlaylists();return;}
      if(['rename','add','delete'].includes(action)){editPlaylist(id,action);return;}
      if(action==='remove-song'){const list=playlistData(),p=list.find(x=>x.id===id);if(p){p.songs=(p.songs||[]).filter(s=>s!==playlistAction.dataset.songId);savePlaylists(list);renderPlaylists();}return;}
    }
    const dialogAction=e.target.closest('[data-tt-dialog]');
    if(dialogAction && activeDialog?.contains(dialogAction)) {
      const action=dialogAction.dataset.ttDialog, id=dialogAction.dataset.id;
      if(action==='cancel'){closeDialog();return;}
      if(action==='create'||action==='rename') {
        const input=$('#tt-playlist-name',activeDialog), name=input.value.trim(), err=$('#tt-playlist-error',activeDialog);
        if(!name){err.textContent='Enter a playlist name to continue.';input.focus();return;}
        const list=playlistData();
        if(action==='create')list.unshift({id:`pl-${Date.now()}`,name,songs:[],createdAt:new Date().toISOString()});
        else {const p=list.find(x=>x.id===id);if(p)p.name=name;}
        savePlaylists(list);closeDialog();renderPlaylists();return;
      }
      if(action==='add') {const selected=$$('.tt-song-picker input:checked',activeDialog).map(x=>x.value);const list=playlistData(),p=list.find(x=>x.id===id);if(p){p.songs=[...new Set(selected)];savePlaylists(list);}closeDialog();renderPlaylists();return;}
      if(action==='delete'){savePlaylists(playlistData().filter(x=>x.id!==id));if(playlistOpen===id)playlistOpen=null;closeDialog();renderPlaylists();return;}
    }
  });
  $('#tt-create-playlist')?.addEventListener('click',createPlaylist);
  const existingNavigateButtons = $$('[data-go="playlists"]');
  existingNavigateButtons.forEach(b => b.addEventListener('click', () => setTimeout(renderPlaylists, 0)));
  // Expose a small, documented navigation bridge for new enhancement components.
  document.addEventListener('click', e => { if(e.target.closest('[data-go="playlists"]')) setTimeout(renderPlaylists, 0); });

  // Search suggestions use the same sample catalogue as the existing Explore screen.
  const globalSearch=$('#globalSearch');
  if(globalSearch && !$('.tt-search-suggestions')) {
    const box=document.createElement('div');box.className='tt-search-suggestions';box.hidden=true;box.setAttribute('role','listbox');
    globalSearch.parentElement.appendChild(box);
    let activeIndex=-1;
    function showSuggestions() {
      const q=globalSearch.value.trim().toLowerCase(); if(!q){box.hidden=true;globalSearch.removeAttribute('aria-expanded');return;}
      const matches=sampleSongs.filter(s=>[s.title,s.artist,s.album].some(v=>v.toLowerCase().includes(q))).slice(0,6);
      const recent=read('searches',[]).filter(x=>x.toLowerCase().includes(q)).slice(0,3);
      box.innerHTML=matches.length?matches.map((s,i)=>`<button class="tt-suggest" role="option" aria-selected="${i===activeIndex}" data-tt-suggest-song="${s.id}"><span class="tt-suggest-art">♫</span><span class="tt-suggest-copy"><b>${esc(s.title)}</b><small>${esc(s.artist)} · sample catalogue</small></span></button>`).join(''):'<p style="padding:10px 12px;margin:0;color:var(--muted);font-size:12px">No sample songs match this search.</p>';
      if(recent.length)box.insertAdjacentHTML('beforeend',`<div style="padding:8px 12px 4px;color:var(--muted);font-size:10px;font-weight:800;letter-spacing:1px">RECENT SEARCHES</div>${recent.map(x=>`<button class="tt-suggest" data-tt-recent="${esc(x)}"><span class="tt-suggest-art">↺</span><span class="tt-suggest-copy"><b>${esc(x)}</b><small>Recent search · local browser</small></span></button>`).join('')}`);
      box.hidden=false;globalSearch.setAttribute('aria-expanded','true');
    }
    globalSearch.addEventListener('input',()=>{activeIndex=-1;globalSearch.removeAttribute('aria-activedescendant');showSuggestions();});
    globalSearch.addEventListener('keydown',e=>{
      const opts=$$('.tt-suggest[data-tt-suggest-song]',box);
      if(e.key==='ArrowDown'&&!box.hidden&&opts.length){e.preventDefault();activeIndex=Math.min(opts.length-1,activeIndex+1);opts.forEach((x,i)=>x.setAttribute('aria-selected',String(i===activeIndex)));globalSearch.setAttribute('aria-activedescendant',opts[activeIndex].id||(opts[activeIndex].id=`tt-suggest-${activeIndex}`));}
      if(e.key==='ArrowUp'&&!box.hidden&&opts.length){e.preventDefault();activeIndex=Math.max(0,activeIndex-1);opts.forEach((x,i)=>x.setAttribute('aria-selected',String(i===activeIndex)));globalSearch.setAttribute('aria-activedescendant',opts[activeIndex].id||(opts[activeIndex].id=`tt-suggest-${activeIndex}`));}
      if(e.key==='Escape'){box.hidden=true;globalSearch.setAttribute('aria-expanded','false');globalSearch.removeAttribute('aria-activedescendant');}
      if(e.key==='Enter') {const q=globalSearch.value.trim();if(q){if(activeIndex>=0&&opts[activeIndex]){e.preventDefault();opts[activeIndex].click();}write('searches',[q,...read('searches',[]).filter(x=>x!==q)].slice(0,8));box.hidden=true;}}
    });
    box.addEventListener('click',e=>{
      const songButton=e.target.closest('[data-tt-suggest-song]');
      if(songButton){const s=songButton.dataset.ttSuggestSong;const song=sampleSongs.find(x=>x.id===s);if(song){write('searches',[song.title,...read('searches',[]).filter(x=>x!==song.title)].slice(0,8));globalSearch.value=song.title;box.hidden=true;const trigger=document.createElement('button');trigger.dataset.song=s;trigger.hidden=true;document.body.appendChild(trigger);trigger.click();trigger.remove();}return;}
      const recentButton=e.target.closest('[data-tt-recent]');if(recentButton){globalSearch.value=recentButton.dataset.ttRecent;box.hidden=true;$('#exploreSearch').value=globalSearch.value;$('#exploreSearch').dispatchEvent(new Event('input',{bubbles:true}));$('[data-go="explore"]')?.click();}
    });
    document.addEventListener('click',e=>{if(!e.target.closest('.searchbox'))box.hidden=true;});
  }

  // Full-page English/Tamil UI translation layer for visible labels, controls and dynamically rendered text.
  const ta = {
    'Home':'முகப்பு','Explore Songs':'பாடல்களை ஆராயுங்கள்','My Library':'என் இசை நூலகம்','History':'வரலாறு','Settings':'அமைப்புகள்','Help':'உதவி','About':'எங்களைப் பற்றி','Playlists':'பாடல் தொகுப்புகள்',
    'YOUR MUSIC SPACE':'உங்கள் இசை உலகம்','Collapse navigation':'வழிசெலுத்தலைச் சுருக்கவும்','Expand navigation':'வழிசெலுத்தலை விரிவாக்கவும்','Find Any Song.':'எந்தப் பாடலையும் கண்டுபிடியுங்கள்.','Your Way.':'உங்கள் முறையில்.','Identify a Song':'ஒரு பாடலைக் கண்டறியுங்கள்','Record Audio':'ஒலியைப் பதிவு செய்','Upload Audio':'ஒலிக்கோப்பைப் பதிவேற்று','Live Recognition':'நேரடி அடையாளம் காணல்','Try Demo':'மாதிரியை முயற்சி செய்','Explore songs':'பாடல்களை ஆராயுங்கள்','Popular Tamil songs':'பிரபலமான தமிழ் பாடல்கள்','Explore by mood':'மனநிலைக்கேற்ற இசை','Recently explored':'சமீபத்தில் பார்த்தவை','Explore songs →':'பாடல்களை ஆராயுங்கள் →','View history →':'வரலாற்றைப் பார்க்கவும் →',
    'Explore songs':'பாடல்களை ஆராயுங்கள்','A WORLD OF MELODIES':'மெட்டுகளின் உலகம்','Explore songs':'பாடல்களை ஆராயுங்கள்','All languages':'அனைத்து மொழிகளும்','Any era':'எந்தக் காலமும்','Featured':'சிறப்பு தேர்வுகள்','Title A–Z':'தலைப்பு அகரவரிசை','Release year':'வெளியீட்டு ஆண்டு','List view':'பட்டியல் காட்சி','Grid view':'கட்டம் காட்சி','Clear filters':'வடிப்பான்களை அழி','Featured picks':'சிறப்பு தேர்வுகள்','Record your melody':'உங்கள் மெட்டை பதிவு செய்யுங்கள்','Ready when you are':'நீங்கள் தயாரானதும் தொடங்கலாம்','Start microphone recording':'ஒலிவாங்கிப் பதிவைத் தொடங்கு','Pause':'இடைநிறுத்து','Resume':'மீண்டும் தொடங்கு','Stop':'நிறுத்து','Cancel':'ரத்து செய்','Back to home':'முகப்புக்குத் திரும்பு','Analyze demo recording':'மாதிரிப் பதிவை ஆய்வு செய்','Upload audio':'ஒலிக்கோப்பைப் பதிவேற்று','Drop your audio here':'உங்கள் ஒலிக்கோப்பை இங்கே விடுங்கள்','or choose a file from your device':'அல்லது உங்கள் சாதனத்திலிருந்து கோப்பைத் தேர்ந்தெடுக்கவும்','Choose audio file':'ஒலிக்கோப்பைத் தேர்ந்தெடு','Analyze audio (demo)':'ஒலியை ஆய்வு செய் (மாதிரி)','Remove file':'கோப்பை அகற்று',
    'Song result preview':'பாடல் முடிவு முன்னோட்டம்','My library':'என் இசை நூலகம்','History':'வரலாறு','All activity':'அனைத்து செயல்பாடுகள்','Recognition attempts':'அடையாள முயற்சிகள்','Explore history':'ஆராய்ந்த வரலாறு','Clear history':'வரலாற்றை அழி','Make it yours':'உங்களுக்கேற்றவாறு அமைக்கவும்','Language preferences':'மொழி விருப்பங்கள்','Interface language':'இடைமுக மொழி','Preferred song language':'விருப்பமான பாடல் மொழி','Speech recognition language':'குரல் அடையாள மொழி','Appearance':'தோற்றம்','Accessibility':'அணுகல்தன்மை','Privacy':'தனியுரிமை','Save preferences':'விருப்பங்களைச் சேமி','Preferences saved in this browser.':'இந்த உலாவியில் விருப்பங்கள் சேமிக்கப்பட்டன.','Help & support':'உதவியும் ஆதரவும்','About TamilTune':'TamilTune பற்றி','Create playlist':'பாடல் தொகுப்பை உருவாக்கு','Your collections':'உங்கள் தொகுப்புகள்','View songs':'பாடல்களைப் பார்க்கவும்','Hide songs':'பாடல்களை மறை','Add songs':'பாடல்களைச் சேர்','Rename':'பெயரை மாற்று','Delete':'நீக்கு','Save name':'பெயரைச் சேமி','Delete playlist':'பாடல் தொகுப்பை நீக்கு','Cancel':'ரத்து செய்','No songs to show yet':'காட்டுவதற்கு பாடல்கள் இல்லை','Try a different search or category. This is a sample catalogue.':'வேறு தேடல் அல்லது வகையை முயற்சிக்கவும். இது மாதிரி பட்டியல்.','No activity here yet':'இங்கு இன்னும் செயல்பாடுகள் இல்லை','Explore songs':'பாடல்களை ஆராயுங்கள்','Your first playlist starts here':'உங்கள் முதல் பாடல் தொகுப்பு இங்கே தொடங்குகிறது','Enter a playlist name to continue.':'தொடர பாடல் தொகுப்பின் பெயரை உள்ளிடவும்.','Playlist name':'பாடல் தொகுப்பின் பெயர்','Choose a name that is easy to recognise.':'எளிதில் அடையாளம் காணக்கூடிய பெயரைத் தேர்ந்தெடுக்கவும்.','This permanently removes this local playlist. Your library and history will not be deleted.':'இந்த உள்ளூர் பாடல் தொகுப்பு நிரந்தரமாக நீக்கப்படும். உங்கள் நூலகமும் வரலாறும் நீக்கப்படாது.','Keep playlist':'தொகுப்பை வைத்திருக்கவும்','Delete this playlist?':'இந்த பாடல் தொகுப்பை நீக்கவா?','Add songs':'பாடல்களைச் சேர்','Save songs':'பாடல்களைச் சேமி','No sample songs match this search.':'இந்தத் தேடலுக்கு மாதிரிப் பாடல்கள் இல்லை.','RECENT SEARCHES':'சமீபத்திய தேடல்கள்','Live recognition':'நேரடி அடையாளம் காணல்','LISTEN IN REAL TIME':'நேரலையில் கேளுங்கள்','Microphone off':'ஒலிவாங்கி அணைக்கப்பட்டுள்ளது','Ready when you are':'நீங்கள் தயாரானதும் தொடங்கலாம்','Nothing is being recorded or listened to yet.':'இதுவரை எந்த ஒலியும் பதிவு செய்யப்படவில்லை அல்லது கேட்கப்படவில்லை.','Start listening':'கேட்கத் தொடங்கு','Stop listening':'கேட்பதை நிறுத்து','Listening stopped':'கேட்பது நிறுத்தப்பட்டது','No audio is being captured. Start again whenever you are ready.':'ஒலி எதுவும் பதிவு செய்யப்படவில்லை. தயாரானதும் மீண்டும் தொடங்கலாம்.','Requesting microphone access…':'ஒலிவாங்கி அனுமதி கோரப்படுகிறது…','Listening · microphone active':'கேட்கிறது · ஒலிவாங்கி செயல்பாட்டில் உள்ளது','Listening to your melody…':'உங்கள் மெட்டைக் கேட்கிறது…','Microphone unavailable':'ஒலிவாங்கி கிடைக்கவில்லை','Microphone permission denied':'ஒலிவாங்கி அனுமதி மறுக்கப்பட்டது','Could not start listening':'கேட்பதைத் தொடங்க முடியவில்லை','Candidate results':'சாத்தியமான முடிவுகள்','No candidates yet. This prototype does not run a live song-identification engine.':'இன்னும் முடிவுகள் இல்லை. இந்த மாதிரியில் நேரடி பாடல் அடையாள இயந்திரம் இல்லை.' ,'RECENT SEARCHES':'சமீபத்திய தேடல்கள்','Recent search · local browser':'சமீபத்திய தேடல் · உள்ளூர் உலாவி','Preferences saved.':'விருப்பங்கள் சேமிக்கப்பட்டன.','Saved to your local demo library.':'உங்கள் உள்ளூர் மாதிரி நூலகத்தில் சேமிக்கப்பட்டது.','Added to favourites.':'விருப்பங்களில் சேர்க்கப்பட்டது.','Removed from favourites.':'விருப்பங்களிலிருந்து நீக்கப்பட்டது.','History cleared.':'வரலாறு அழிக்கப்பட்டது.','Interface language set to English.':'இடைமுக மொழி ஆங்கிலமாக அமைக்கப்பட்டது.'
  };

  Object.assign(ta, {
    'YOUR MUSIC, YOUR MOMENT':'உங்கள் இசை, உங்கள் தருணம்',
    'Sing it, hum it, whistle it, or upload a melody. Discover the song behind the sound.':'பாடுங்கள், முணுமுணுங்கள், விசில் அடியுங்கள் அல்லது மெட்டை பதிவேற்றுங்கள். ஒலிக்குப் பின்னுள்ள பாடலைக் கண்டறியுங்கள்.',
    '♪ Sing':'♪ பாடுங்கள்','Hum':'முணுமுணுங்கள்','Whistle':'விசில்','Prototype · no real AI match':'மாதிரி · உண்மையான AI பொருத்தம் இல்லை',
    'Sing, hum or whistle a tune':'ஒரு மெட்டை பாடுங்கள், முணுமுணுங்கள் அல்லது விசில் அடியுங்கள்','Choose a clip from your device':'உங்கள் சாதனத்திலிருந்து ஒலிக்கோப்பைத் தேர்ந்தெடுக்கவும்','Explore the live listening UI':'நேரடி கேட்பு திரையைப் பாருங்கள்','Preview a clearly labelled sample result':'தெளிவாகக் குறிக்கப்பட்ட மாதிரி முடிவைப் பாருங்கள்',
    'A LITTLE INSPIRATION':'சிறிய இசை ஊக்கம்','Illustrative sample cards for the prototype':'மாதிரி பயன்பாட்டிற்கான எடுத்துக்காட்டு அட்டைகள்','FOLLOW THE FEELING':'உணர்வைப் பின்தொடருங்கள்','Start with the feeling you\'re looking for':'நீங்கள் தேடும் உணர்விலிருந்து தொடங்குங்கள்','Folk & village':'நாட்டுப்புறமும் கிராமியமும்','PICK UP WHERE YOU LEFT OFF':'நீங்கள் நிறுத்திய இடத்திலிருந்து தொடருங்கள்','A WORLD OF MELODIES':'மெட்டுகளின் உலகம்','Sample songs for visual preview':'காட்சி முன்னோட்டத்திற்கான மாதிரிப் பாடல்கள்',
    'LISTEN CLOSELY':'கவனமாகக் கேளுங்கள்','Microphone UI prototype':'ஒலிவாங்கி இடைமுக மாதிரி','Allow microphone access when your browser asks. Your recording stays in this page.':'உலாவி கேட்கும்போது ஒலிவாங்கி அனுமதி வழங்கவும். உங்கள் பதிவு இந்தப் பக்கத்திலேயே இருக்கும்.','Analyze demo recording':'மாதிரிப் பதிவை ஆய்வு செய்','Back to home':'முகப்புக்குத் திரும்பு','Prototype note: this button displays a demo no-match state. It does not send audio to an AI recognition engine.':'மாதிரி குறிப்பு: இந்த பொத்தான் பொருத்தம் கிடைக்காத மாதிரி நிலையை காட்டும். ஒலி AI அடையாள இயந்திரத்துக்கு அனுப்பப்படாது.',
    'BRING YOUR OWN SOUND':'உங்கள் ஒலியைக் கொண்டு வாருங்கள்','Select an audio clip to preview it locally. Analysis is a frontend demo and won\'t identify the real song.':'ஒலிக்கோப்பை உங்கள் சாதனத்திலேயே முன்னோட்டம் பார்க்கத் தேர்ந்தெடுக்கவும். இது முன்பக்க மாதிரி; உண்மையான பாடலை அடையாளம் காணாது.','Drop your audio here':'உங்கள் ஒலிக்கோப்பை இங்கே விடுங்கள்','or choose a file from your device':'அல்லது உங்கள் சாதனத்திலிருந்து கோப்பைத் தேர்ந்தெடுக்கவும்','Choose audio file':'ஒலிக்கோப்பைத் தேர்ந்தெடு','Analyze audio (demo)':'ஒலியை ஆய்வு செய் (மாதிரி)','Remove file':'கோப்பை அகற்று','Files are only previewed in your browser. No upload service or AI recognition model is connected.':'கோப்புகள் உங்கள் உலாவியில் மட்டுமே முன்னோட்டம் பார்க்கப்படும். பதிவேற்ற சேவையோ AI அடையாள மாதிரியோ இணைக்கப்படவில்லை.',
    'YOUR MELODY JOURNEY':'உங்கள் மெட்டுப் பயணம்','A sample result screen to preview how TamilTune may present song details. This is not an AI prediction.':'TamilTune பாடல் விவரங்களைக் காட்டும் முறையைப் பார்ப்பதற்கான மாதிரி திரை. இது AI கணிப்பு அல்ல.','SAVED BY YOU':'நீங்கள் சேமித்தவை','Your favourites and saved demo songs, stored in this browser.':'உங்கள் விருப்பங்களும் மாதிரிப் பாடல்களும் இந்த உலாவியில் சேமிக்கப்படும்.','Recently added':'சமீபத்தில் சேர்த்தவை','YOUR RECENT ACTIVITY':'உங்கள் சமீபத்திய செயல்பாடுகள்','See the demo songs you\'ve explored and audio interactions you\'ve tried on this device.':'இந்தச் சாதனத்தில் நீங்கள் ஆராய்ந்த மாதிரிப் பாடல்களையும் ஒலி முயற்சிகளையும் பார்க்கவும்.',
    'MAKE IT YOURS':'உங்களுக்கேற்றவாறு அமைக்கவும்','Personalise the interface and prototype behaviour. Preferences are saved in this browser.':'இடைமுகத்தையும் மாதிரி செயல்பாடுகளையும் தனிப்பயனாக்குங்கள். விருப்பங்கள் இந்த உலாவியில் சேமிக்கப்படும்.','Language preferences':'மொழி விருப்பங்கள்','Interface language is different from song language and speech-recognition language.':'இடைமுக மொழி, பாடல் மொழி, பேச்சு அடையாள மொழி ஆகியவை வேறுபட்டவை.','Preferred song language':'விருப்பமான பாடல் மொழி','Speech-recognition language':'பேச்சு அடையாள மொழி','Save preferences':'விருப்பங்களைச் சேமி','Accessibility & appearance':'அணுகல்தன்மையும் தோற்றமும்','Keep controls comfortable and readable.':'கட்டுப்பாடுகளை வசதியாகவும் தெளிவாகவும் வைத்திருங்கள்.','Larger interface text':'பெரிய இடைமுக எழுத்துகள்','Reduce motion':'அசைவைக் குறை','Show demo labels':'மாதிரி குறிச்சொற்களைக் காட்டு',
    'Microphone preferences':'ஒலிவாங்கி விருப்பங்கள்','Microphone access is requested only when you start recording. Browser support and permission are required.':'பதிவைத் தொடங்கும்போது மட்டுமே ஒலிவாங்கி அனுமதி கோரப்படும். உலாவி ஆதரவும் அனுமதியும் தேவை.','Recording duration':'பதிவு நேரம்','Keep audio recordings':'ஒலிப் பதிவுகளை வைத்திரு','Privacy & local data':'தனியுரிமையும் உள்ளூர் தரவும்','Library, history and settings are stored locally in this browser. No account or cloud sync is active.':'நூலகம், வரலாறு, அமைப்புகள் இந்த உலாவியில் சேமிக்கப்படும். கணக்கோ மேக ஒத்திசைவோ செயல்பாட்டில் இல்லை.','Export demo data':'மாதிரி தரவை ஏற்றுமதி செய்','Clear local data':'உள்ளூர் தரவை அழி','Preferences haven\'t been changed yet.':'விருப்பங்கள் இன்னும் மாற்றப்படவில்லை.',
    'A LITTLE GUIDANCE':'சிறிய வழிகாட்டுதல்','Helpful tips for getting the most from your music discovery experience.':'இசையைக் கண்டறியும் அனுபவத்தை சிறப்பாகப் பயன்படுத்த உதவும் குறிப்புகள்.','How do I identify a song?':'ஒரு பாடலை எப்படிக் கண்டறிவது?','How should I hum or whistle?':'எப்படி முணுமுணுக்க அல்லது விசில் அடிக்க வேண்டும்?','How do I upload a clip?':'ஒலிக்கோப்பை எப்படிப் பதிவேற்றுவது?','Why can\'t TamilTune identify my song?':'TamilTune ஏன் என் பாடலை அடையாளம் காண முடியவில்லை?','Microphone troubleshooting':'ஒலிவாங்கி சிக்கல் தீர்வு','Open recording screen':'பதிவு திரையைத் திற','Need a simpler place to start?':'எளிமையாகத் தொடங்க வேண்டுமா?','Try the sample result to explore the interface without using your microphone.':'ஒலிவாங்கியைப் பயன்படுத்தாமல் இடைமுகத்தைப் பார்க்க மாதிரி முடிவை முயற்சிக்கவும்.','Try demo result':'மாதிரி முடிவைப் பார்க்கவும்',
    'OUR STORY':'எங்கள் கதை','Frontend prototype':'முன்பக்க மாதிரி','Every tune holds a memory.':'ஒவ்வொரு மெட்டிலும் ஒரு நினைவு உள்ளது.','Our mission':'எங்கள் நோக்கம்','What this demo includes':'இந்த மாதிரியில் உள்ளவை','Privacy & terms':'தனியுரிமையும் விதிமுறைகளும்','Prototype notice':'மாதிரி அறிவிப்பு','DEMO PROFILE':'மாதிரி சுயவிவரம்','Hello, Harish':'வணக்கம்','Guest profile · no account connected':'விருந்தினர் சுயவிவரம் · கணக்கு இணைக்கப்படவில்லை','Return to login page':'உள்நுழைவு பக்கத்திற்குத் திரும்பு','LOCAL AUDIO PREVIEW':'உள்ளூர் ஒலி முன்னோட்டம்','Choose a supported audio file. Nothing is sent to a server.':'ஆதரிக்கப்படும் ஒலிக்கோப்பைத் தேர்ந்தெடுக்கவும். எதுவும் சேவையகத்துக்கு அனுப்பப்படாது.','PLEASE CONFIRM':'உறுதிப்படுத்தவும்','Clear history?':'வரலாற்றை அழிக்கவா?','This removes activity stored in this browser.':'இந்த உலாவியில் சேமிக்கப்பட்ட செயல்பாடுகள் நீக்கப்படும்.','Keep history':'வரலாற்றை வைத்திரு','Delete history':'வரலாற்றை நீக்கு',
    'Search songs, singers, movies…':'பாடல், பாடகர், திரைப்படம் தேடுங்கள்…','Search by song, singer, movie…':'பாடல், பாடகர், திரைப்படம் மூலம் தேடுங்கள்…','Search your library…':'உங்கள் நூலகத்தில் தேடுங்கள்…','Choose a playlist name':'பாடல் தொகுப்பின் பெயரைத் தேர்ந்தெடுக்கவும்','Create a playlist':'பாடல் தொகுப்பை உருவாக்கு','Give this collection a name. You can add songs next.':'இந்தத் தொகுப்பிற்குப் பெயரிடுங்கள். அடுத்து பாடல்களைச் சேர்க்கலாம்.','Your personal soundtrack':'உங்கள் தனிப்பட்ட இசைத்தொகுப்பு','Gather the sample songs that belong together. Playlists are saved locally in this browser.':'ஒன்றாகச் சேரும் மாதிரிப் பாடல்களைத் தொகுக்கவும். பாடல் தொகுப்புகள் இந்த உலாவியில் சேமிக்கப்படும்.','Create a mood, memory, or moment of your own.':'உங்கள் மனநிலை, நினைவு அல்லது தருணத்திற்கான தொகுப்பை உருவாக்குங்கள்.','Selected examples from the sample catalogue':'மாதிரிப் பட்டியலிலிருந்து தேர்ந்தெடுத்த எடுத்துக்காட்டுகள்','View all →':'அனைத்தையும் பார்க்கவும் →','No recognition attempts yet. When you record or select a file, your demo attempt will appear here.':'அடையாள முயற்சிகள் இன்னும் இல்லை. பதிவு செய்தாலோ கோப்பைத் தேர்ந்தெடுத்தாலோ உங்கள் மாதிரி முயற்சி இங்கே தோன்றும்.','Try recording →':'பதிவை முயற்சிக்கவும் →'
  });
  const en = Object.fromEntries(Object.entries(ta).map(([k,v])=>[v,k]));
  const baseText = new WeakMap();
  function applyLanguage(lang) {
    const tamil=lang==='ta'; document.documentElement.lang=tamil?'ta':'en'; document.documentElement.dataset.interfaceLanguage=tamil?'ta':'en';
    const map=tamil?ta:en;
    const walker=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT);
    const nodes=[];while(walker.nextNode())nodes.push(walker.currentNode);
    nodes.forEach(node=>{if(!baseText.has(node))baseText.set(node,node.nodeValue);const original=baseText.get(node);const key=original.trim();if(!key)return;const englishKey=en[key]||key;const translated=tamil?(ta[englishKey]||englishKey):englishKey;if(translated){const leading=original.match(/^\s*/)?.[0]||'', trailing=original.match(/\s*$/)?.[0]||'';node.nodeValue=leading+translated+trailing;}});
    $$('input[placeholder],textarea[placeholder]').forEach(el=>{if(!el.dataset.ttPlaceholderEn)el.dataset.ttPlaceholderEn=el.placeholder;const original=el.dataset.ttPlaceholderEn;const translated=tamil?(ta[original]||original):original;if(translated)el.placeholder=translated;});
    $$('[aria-label],[title]').forEach(el=>{for(const attr of ['aria-label','title'])if(el.hasAttribute(attr)){const key=`tt${attr.replace(/(^|-)(\w)/g,(_,a,b)=>b.toUpperCase())}En`;if(!el.dataset[key])el.dataset[key]=el.getAttribute(attr);const original=el.dataset[key];const englishKey=en[original]||original;const translated=tamil?(ta[englishKey]||englishKey):englishKey;if(translated)el.setAttribute(attr,translated);}});
    const hero=$('[data-i18n="identify"]');if(hero)hero.textContent=tamil?'ஒரு பாடலைக் கண்டறியுங்கள்':'Identify a Song';
    const top=$('#topLang');if(top)top.value=tamil?'ta':'en';const pref=$('#interfaceLanguage');if(pref)pref.value=tamil?'ta':'en';
  }
  // The main app's original language handler is intentionally wrapped rather than replaced.
  const topLang=$('#topLang'), interfaceLanguage=$('#interfaceLanguage');
  topLang?.addEventListener('change',()=>{applyLanguage(topLang.value);write('settings',{...read('settings',{}),interfaceLanguage:topLang.value});});
  interfaceLanguage?.addEventListener('change',()=>applyLanguage(interfaceLanguage.value));
  const savePrefs=$('#savePrefs');savePrefs?.addEventListener('click',()=>setTimeout(()=>applyLanguage($('#interfaceLanguage')?.value||'en'),0));
  const originalSettings=read('settings',{});if(originalSettings.interfaceLanguage==='ta'){setTimeout(()=>applyLanguage('ta'),0);}
  // Translate newly rendered text nodes without changing the source copy used for switching back.
  const translationObserver = new MutationObserver(records => {
    const lang=document.documentElement.dataset.interfaceLanguage;if(lang!=='ta'&&lang!=='en')return;
    records.forEach(record=>record.addedNodes.forEach(node=>{
      if(node.nodeType===Node.TEXT_NODE){if(!baseText.has(node))baseText.set(node,node.nodeValue);const original=baseText.get(node),key=original.trim(),translated=(lang==='ta'?ta:en)[key];if(translated)node.nodeValue=original.replace(key,translated);}
      else if(node.nodeType===Node.ELEMENT_NODE){const walker=document.createTreeWalker(node,NodeFilter.SHOW_TEXT);while(walker.nextNode()){const n=walker.currentNode;if(!baseText.has(n))baseText.set(n,n.nodeValue);const original=baseText.get(n),key=original.trim(),englishKey=en[key]||key,translated=lang==='ta'?(ta[englishKey]||englishKey):englishKey;if(translated)n.nodeValue=original.replace(key,translated);} }
    }));
  });
  translationObserver.observe(document.body,{childList:true,subtree:true});
  // A visible toast helper for new playlist/search flows; use existing toast when available.
  function announce(message){const toast=$('#toast');if(toast){toast.textContent=message;toast.classList.add('show');setTimeout(()=>toast.classList.remove('show'),2500);return;}let t=$('.tt-toast');if(!t){t=document.createElement('div');t.className='tt-toast';t.setAttribute('role','status');t.setAttribute('aria-live','polite');document.body.appendChild(t);}t.textContent=message;t.classList.add('show');setTimeout(()=>t.classList.remove('show'),2500);}
  window.addEventListener('storage',e=>{if(e.key==='tt-ui-playlists')renderPlaylists();});
  document.addEventListener('click',e=>{if(e.target.closest('[data-heart]'))setTimeout(renderHomeCollections,0);if(e.target.closest('[data-go="home"]'))setTimeout(renderHomeCollections,0);});
  renderPlaylists();
  renderHomeCollections();
})();
