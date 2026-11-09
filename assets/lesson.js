/* Lesson page */
(function(){
const params=new URLSearchParams(location.search);
const N=parseInt(params.get("n")||"0",10)||BOOK.lessons[0].n;
const s=document.createElement("script"); s.src="data/l"+String(N).padStart(2,"0")+".js";
s.onload=()=>{ renderLesson(); document.addEventListener("langchange",renderLesson); };
s.onerror=()=>{ location.href="index.html"; };
document.head.append(s);
let state={tab:LS.get("tab","text"), py:LS.get("py",BOOK.level<=3), tr:LS.get("tr",true), vmode:"list", fi:0, seed:LS.get("seed:"+N,1)};
const answers={}; // persistent within page across lang switch: key -> value

function renderLesson(){
  const X=window.LESSON; applyTheme();
  document.title=t("lesson",{n:X.n})+" "+X.zh+" · "+BOOK.sub;
  document.body.innerHTML=""; document.body.className="lv"+BOOK.level+(state.py?"":" nopy")+(state.tr?"":" notr");
  document.body.append(topBar());
  const idx=BOOK.lessons.findIndex(x=>x.n===X.n); const prev=BOOK.lessons[idx-1], next=BOOK.lessons[idx+1];
  const head=h("section",{class:"lhead"},h("div",{class:"wrap"},
    h("div",{class:"crumb"},h("a",{href:"index.html"},"← "+t("home")),"  ·  "+BOOK.sub+" · "+t("lesson",{n:X.n})),
    h("h1",null,X.zh,sayBtn(X.zh)),
    h("div",{class:"py"},X.py),
    h("div",{class:"tr"},L([X.ko,X.en])),
    X.topic?h("div",{class:"topic"},"🎯 "+L(X.topic)):null,
    h("div",{class:"tabs"},[["text","tabText"],["vocab","tabVocab"],["gram","tabGram"],["ex","tabEx"]].map(([k,lab])=>
      h("button",{class:state.tab===k?"on":null,onclick:()=>{state.tab=k;LS.set("tab",k);TTS.stop();renderLesson();scrollTo(0,0)}},t(lab))))
  ));
  const main=h("main",{class:"wrap"});
  const panes={text:paneText,vocab:paneVocab,gram:paneGram,ex:paneEx};
  main.append(h("div",{class:"pane on"},panes[state.tab](X)));
  main.append(h("div",{class:"navl"},
    prev?h("a",{href:"lesson.html?n="+prev.n},"◀ "+t("lesson",{n:prev.n})+" "+prev.zh):h("span"),
    next?h("a",{href:"lesson.html?n="+next.n},t("lesson",{n:next.n})+" "+next.zh+" ▶"):h("span")));
  document.body.append(head,main,footerEl());
}
function toggles(){
  return h("div",{class:"opts"},
    h("button",{class:"chip"+(state.py?" on":""),onclick:()=>{state.py=!state.py;LS.set("py",state.py);document.body.classList.toggle("nopy",!state.py);event.currentTarget.classList.toggle("on",state.py)}},"拼 "+t("showPy")),
    h("button",{class:"chip"+(state.tr?" on":""),onclick:()=>{state.tr=!state.tr;LS.set("tr",state.tr);document.body.classList.toggle("notr",!state.tr);event.currentTarget.classList.toggle("on",state.tr)}},"🌐 "+t("showTr")));
}

/* ---------- Texts ---------- */
function paneText(X){
  const f=document.createDocumentFragment();
  if(X.goals&&X.goals.length) f.append(h("div",{class:"box"},h("h2",null,"🎯 "+t("goals")),h("ul",{class:"goal"},X.goals.map(g=>h("li",null,L(g))))));
  f.append(toggles());
  X.texts.forEach((tx,i)=>{
    const box=h("div",{class:"box"});
    const lines=[];
    const playBtn=h("button",{class:"btn sm"},t("playAll"));
    playBtn.onclick=()=>{ if(playBtn._on){TTS.stop();playBtn._on=0;playBtn.textContent=t("playAll");return}
      playBtn._on=1; playBtn.textContent=t("stop");
      TTS.seq(lines,(it,on)=>it.el.classList.toggle("hl",on)).then(()=>{playBtn._on=0;playBtn.textContent=t("playAll")}); };
    box.append(h("h2",null,(X.texts.length>1?"课文 "+(i+1)+" · ":"课文 · "),tx.title?h("span",{class:"hz"},tx.title.zh):null,tx.title?h("span",{class:"sub"},L(tx.title)):null,h("span",{class:"sp",style:"flex:1"}),playBtn));
    if(tx.scene) box.append(h("div",{class:"scene"},"📍 "+L(tx.scene)));
    tx.lines.forEach(ln=>{
      const zl=ruby(ln.zh,ln.py);
      lines.push({text:ln.zh,el:zl});
      box.append(h("div",{class:"line"},
        ln.s?h("span",{class:"who "+(ln.sk||"")},ln.s):h("span",{class:"who P"},"¶"),
        h("div",{class:"lbody"},zl,h("div",{class:"trline"},L([ln.ko,ln.en]))),
        sayBtn(ln.zh)));
    });
    f.append(box);
  });
  if(X.culture) f.append(h("div",{class:"box culture"},h("h2",null,"🏮 "+t("culture")+(X.culture.t?" · "+L(X.culture.t):"")),h("p",{style:"margin:0"},L(X.culture.d||X.culture))));
  return f;
}

/* ---------- Vocab ---------- */
function paneVocab(X){
  const f=document.createDocumentFragment();
  const playAll=h("button",{class:"chip"},t("playAll"));
  playAll.onclick=()=>TTS.seq(X.vocab.map(v=>({text:v.w,el:document.getElementById("v-"+v.w)})),(it,on)=>it.el&&it.el.classList.toggle("hl",on));
  f.append(h("div",{class:"opts"},
    h("button",{class:"chip"+(state.vmode==="list"?" on":""),onclick:()=>{state.vmode="list";renderLesson()}},"☰ "+t("list")),
    h("button",{class:"chip"+(state.vmode==="flash"?" on":""),onclick:()=>{state.vmode="flash";state.fi=0;renderLesson()}},"🃏 "+t("flash")),
    state.vmode==="list"?playAll:null));
  if(state.vmode==="list"){
    const g=h("div",{class:"vgrid"});
    X.vocab.forEach((v,i)=>g.append(h("div",{class:"vcard",id:"v-"+v.w},
      h("div",{class:"vi"},h("div",{class:"w"},v.w),h("div",{class:"p"},pyWord(v.py)),
        h("div",{class:"m"},v.pos?h("span",{class:"pos"},v.pos):null,L([v.ko,v.en]))),
      sayBtn(v.w))));
    f.append(h("div",{class:"box"},h("h2",null,"🔤 生词 ",h("span",{class:"sub"},X.vocab.length+" "+t("words"))),g));
  } else {
    const deck=state.deck||X.vocab; const v=deck[state.fi%deck.length];
    const card=h("div",{class:"fcard",onclick:()=>{card.classList.toggle("flip"); if(card.classList.contains("flip")) TTS.speak(v.w);}},
      h("div",{class:"in"},h("div",{class:"f"},h("div",{class:"w"},v.w),h("div",{style:"color:var(--mut);font-size:13px"},t("flip"))),
        h("div",{class:"b"},h("div",{class:"hz",style:"font-size:30px;font-weight:700"},v.w),h("div",{class:"p"},pyWord(v.py)),h("div",{class:"m"},L([v.ko,v.en])))));
    f.append(h("div",{class:"box"},h("div",{class:"flash"},card,
      h("div",{class:"fnav"},
        h("button",{class:"btn ghost sm",onclick:()=>{state.fi=(state.fi-1+deck.length)%deck.length;renderLesson()}},t("prev")),
        h("b",null,(state.fi%deck.length+1)+" / "+deck.length), sayBtn(v.w),
        h("button",{class:"btn ghost sm",onclick:()=>{state.fi=(state.fi+1)%deck.length;renderLesson()}},t("next"))),
      h("div",{style:"margin-top:10px"},h("button",{class:"chip",onclick:()=>{state.deck=shuffle(X.vocab);state.fi=0;renderLesson()}},t("shuffle"))))));
  }
  return f;
}

/* ---------- Grammar ---------- */
function paneGram(X){
  const f=document.createDocumentFragment(); f.append(toggles());
  const box=h("div",{class:"box"},h("h2",null,"📐 注释 ",h("span",{class:"sub"},X.grammar.length+" "+t("grammarN"))));
  X.grammar.forEach((g,i)=>{
    box.append(h("div",{class:"gpt"},
      h("h3",null,h("span",{class:"n"},i+1),L(g.t)),
      g.p?h("div",{class:"pattern"},g.p):null,
      h("div",{html:esc(L(g.d)).replace(/\n/g,"<br>")}),
      g.ex.map(e=>h("div",{class:"gex"},h("div",{class:"lbody"},ruby(e.zh,e.py),h("div",{class:"trline"},L([e.ko,e.en]))),sayBtn(e.zh)))));
  });
  f.append(box); return f;
}

/* ---------- Exercises ---------- */
function paneEx(X){
  const f=document.createDocumentFragment();
  const rnd=seeded(N*7919+state.seed*104729);
  const secs=[]; let qn=0;
  const V=X.vocab.filter(v=>!v.nq);
  const lang=()=>LANG;
  function mkSection(key,title,inst,build){
    const items=[]; const body=h("div",{class:"body"});
    build(body,items);
    if(!items.length) return;
    const sc=h("span",{class:"secscore"},"0/"+items.length);
    const sec=h("section",{class:"exsec"},h("header",null,h("h3",null,title),sc,h("div",{class:"inst"},inst)),body,
      h("div",{class:"exactions"},h("button",{class:"btn sm",onclick:()=>{grade(S);upd()}},t("check")),h("button",{class:"btn ghost sm",onclick:()=>{items.forEach(it=>it.reveal());}},t("showAns"))));
    const S={key,items,sc,sec}; secs.push(S); f.append(sec);
  }
  function grade(S){ let ok=0; S.items.forEach(it=>{ const r=it.check(); if(r) ok++; }); S.sc.textContent=ok+"/"+S.items.length; S.sc.classList.add("done"); S.graded=ok; return ok; }
  function qwrap(body,content,fbText){
    qn++; const q=h("div",{class:"q"},h("div",{class:"qh"},h("span",{class:"qn"},qn),h("div",{class:"qt"},content)));
    body.append(q); return q;
  }
  function mark(q,ok,ansText){ q.classList.remove("ok","no"); q.classList.add(ok?"ok":"no");
    let fb=q.querySelector(".fb"); if(!fb){fb=h("div",{class:"fb"});q.append(fb)} fb.textContent=ok?t("correct"):t("wrong")+ansText; }
  function choiceQ(body,items,content,opts,ai,akey,render){
    const q=qwrap(body,content); const box=h("div",{class:"choices"}); q.append(box);
    let sel=answers[akey]; const btns=opts.map((o,i)=>{ const b=h("button",{class:"choice"+(sel===i?" sel":""),onclick:()=>{sel=i;answers[akey]=i;btns.forEach(x=>x.classList.remove("sel","right","wrong"));b.classList.add("sel");q.classList.remove("ok","no");}},render?render(o):o); return b; });
    box.append(...btns);
    items.push({check(){ if(sel==null){mark(q,false,txt(opts[ai],render));return false} const ok=sel===ai; btns[sel].classList.add(ok?"right":"wrong"); if(!ok) btns[ai].classList.add("right"); mark(q,ok,txt(opts[ai],render)); return ok; },
      reveal(){ btns[ai].classList.add("right"); }, answered:()=>sel!=null});
  }
  const txt=(o,r)=>{ if(!r) return typeof o==="string"?o:""; const e=r(o); return e.textContent||e; };
  function distract(v,pool,keyf,k=3){ const others=shuffle(pool.filter(x=>x!==v&&keyf(x)!==keyf(v)),rnd); const seen=new Set([keyf(v)]); const out=[]; for(const o of others){ if(!seen.has(keyf(o))){seen.add(keyf(o));out.push(o)} if(out.length>=k)break;} return out; }
  const pool = V.length>=4?V:V.concat(window.EXTRA_POOL||[]);

  // 1 meaning
  mkSection("mean",t("exMeaning"),t("exMeaningI"),(body,items)=>{
    if(pool.length<4) return;
    shuffle(V,rnd).slice(0,Math.min(10,V.length)).forEach((v,i)=>{
      const opts=shuffle([v,...distract(v,pool,x=>L([x.ko,x.en]))],rnd);
      choiceQ(body,items,h("span",null,h("span",{class:"hz",style:"font-size:24px;font-weight:700;margin-right:8px"},v.w),sayBtn(v.w)),opts,opts.indexOf(v),"mean"+i,o=>h("span",null,L([o.ko,o.en])));
    });
  });
  // 2 listen
  mkSection("listen",t("exListen"),t("exListenI"),(body,items)=>{
    if(pool.length<4) return;
    shuffle(V,rnd).slice(0,Math.min(8,V.length)).forEach((v,i)=>{
      const opts=shuffle([v,...distract(v,pool,x=>x.w)],rnd);
      choiceQ(body,items,sayBtn(v.w,"big"),opts,opts.indexOf(v),"lis"+i,o=>h("span",{class:"hz"},o.w));
    });
  });
  // 3 pinyin (1-3) / reverse (4-6)
  if(BOOK.level<=3) mkSection("py",t("exPinyin"),t("exPinyinI"),(body,items)=>{
    if(pool.length<4) return;
    shuffle(V,rnd).slice(0,Math.min(8,V.length)).forEach((v,i)=>{
      const right=pyWord(v.py); const fake=tonesVariant(right,rnd);
      const opts=shuffle([right,...fake],rnd);
      choiceQ(body,items,h("span",null,h("span",{class:"hz",style:"font-size:24px;font-weight:700;margin-right:8px"},v.w),sayBtn(v.w)),opts,opts.indexOf(right),"py"+i);
    });
  });
  else mkSection("rev",t("exReverse"),t("exReverseI"),(body,items)=>{
    if(pool.length<4) return;
    shuffle(V,rnd).slice(0,Math.min(8,V.length)).forEach((v,i)=>{
      const opts=shuffle([v,...distract(v,pool,x=>x.w)],rnd);
      choiceQ(body,items,h("b",null,L([v.ko,v.en])),opts,opts.indexOf(v),"rev"+i,o=>h("span",{class:"hz"},o.w));
    });
  });
  const E=X.ex||{};
  // 4 fill
  (E.fill||[]).forEach((F,fi)=>mkSection("fill"+fi,t("exFill")+(E.fill.length>1?" "+(fi+1):""),t("exFillI"),(body,items)=>{
    body.append(h("div",{class:"bank"},F.bank.map(w=>h("span",null,w))));
    F.items.forEach((it,ii)=>{
      const parts=it.zh.split(/_{2,}/); const sels=[];
      const line=h("span",{class:"zhline hz"});
      parts.forEach((p,pi)=>{ line.append(p); if(pi<parts.length-1){
        const k="fill"+fi+"-"+ii+"-"+pi;
        const s=h("select",{class:"fillin",onchange:e=>{answers[k]=e.target.value;s.classList.remove("right","wrong");q.classList.remove("ok","no")}},h("option",{value:""},"—"),F.bank.map(w=>h("option",{value:w},w)));
        if(answers[k]) s.value=answers[k]; sels.push(s); line.append(s);} });
      const q=qwrap(body,h("div",null,line,it.ko||it.en?h("div",{class:"trline"},L([it.ko,it.en])):null));
      items.push({check(){ let all=true; sels.forEach((s,si)=>{ const ok=s.value===it.a[si]; s.classList.add(ok?"right":"wrong"); s.classList.remove(ok?"wrong":"right"); if(!ok) all=false; }); mark(q,all,it.a.join(" / ")); return all; },
        reveal(){ sels.forEach((s,si)=>{s.value=it.a[si];s.classList.add("right")}) }, answered:()=>sels.every(s=>s.value)});
    });
  }));
  // 5 order
  if(E.order&&E.order.length) mkSection("ord",t("exOrder"),t("exOrderI"),(body,items)=>{
    E.order.forEach((o,oi)=>{
      const k="ord"+oi; const toks=shuffle(o.tok.map((w,i)=>({w,i})),rnd);
      if(toks.map(x=>x.w).join("")===o.tok.join("")&&toks.length>1) toks.push(toks.shift());
      let picked=answers[k]||[];
      const ans=h("div",{class:"ordans"}), poolEl=h("div",{class:"ordpool"});
      const q=qwrap(body,h("div",null,h("div",{style:"font-size:13px;color:var(--mut)"},t("tapOrder")),o.ko||o.en?h("div",{class:"trline",style:"display:block"},"💬 "+L([o.ko,o.en])):null));
      const wrap=h("div",{class:"ordwrap"},ans,poolEl); q.append(wrap);
      function draw(){ ans.innerHTML="";poolEl.innerHTML=""; ans.classList.remove("right","wrong");
        picked.forEach(pi=>ans.append(h("button",{class:"tok",onclick:()=>{picked=picked.filter(x=>x!==pi);answers[k]=picked;q.classList.remove("ok","no");draw()}},toks[pi].w)));
        toks.forEach((tk,ti)=>{ if(!picked.includes(ti)) poolEl.append(h("button",{class:"tok",onclick:()=>{picked=[...picked,ti];answers[k]=picked;q.classList.remove("ok","no");draw()}},tk.w)); });
        if(picked.length===toks.length) { const s=picked.map(i=>toks[i].w).join(""); TTS.speak(s); } }
      draw();
      const right=o.tok.join(""); const alts=[right,...(o.alt||[])].map(x=>x.replace(/\s/g,""));
      items.push({check(){ const s=picked.map(i=>toks[i].w).join(""); const ok=alts.includes(s); ans.classList.add(ok?"right":"wrong"); mark(q,ok,right+o.end); return ok; },
        reveal(){ const used=[]; picked=o.tok.map(w=>{const ti=toks.findIndex((x,j)=>x.w===w&&!used.includes(j)); used.push(ti); return ti;}); answers[k]=picked; draw(); ans.classList.add("right"); },
        answered:()=>picked.length===toks.length});
    });
  });
  // 6 true/false
  if(E.tf&&E.tf.length) mkSection("tf",t("exTF"),t("exTFI"),(body,items)=>{
    E.tf.forEach((x,i)=>{
      choiceQ(body,items,h("div",null,ruby(x.zh,x.py),h("div",{class:"trline"},L([x.ko,x.en]))),[t("T"),t("F")],x.a?0:1,"tf"+i);
      const qs=body.lastChild; const ch=qs.querySelector(".choices"); ch.className="tfbtns";
    });
  });
  // 7 multiple choice
  if(E.mcq&&E.mcq.length) mkSection("mcq",t("exMCQ"),t("exMCQI"),(body,items)=>{
    E.mcq.forEach((x,i)=>{
      const content=h("div",null,x.q.zh?ruby(x.q.zh,x.q.py):h("b",null,L(x.q)),x.q.zh&&(x.q.ko||x.q.en)?h("div",{class:"trline"},L([x.q.ko,x.q.en])):null);
      choiceQ(body,items,content,x.o,x.a,"mcq"+i,o=>h("span",{class:"hz"},L(o)));
    });
  });
  // 8 reading
  (E.read||[]).forEach((R,ri)=>mkSection("read"+ri,t("exRead")+(E.read.length>1?" "+(ri+1):""),t("exReadI"),(body,items)=>{
    const ps=h("div",{class:"passage"},h("div",{style:"display:flex;gap:8px;align-items:flex-start"},h("div",{style:"flex:1"},ruby(R.zh,R.py),h("div",{class:"trline"},L([R.ko,R.en]))),sayBtn(R.zh)));
    body.append(ps);
    R.qs.forEach((x,i)=>{
      choiceQ(body,items,h("div",null,ruby(x.q,x.qpy)),x.o,x.a,"rd"+ri+"-"+i,o=>h("span",{class:"hz"},L(o)));
    });
  }));

  // total bar
  const allItems=()=>secs.flatMap(s=>s.items);
  const ring=h("div",{class:"ring",style:"--p:0"},h("span",null,"0%"));
  const info=h("div",{class:"info"},h("b",null,t("total")),h("div"));
  const best=bestScore(N);
  function upd(){ const all=allItems(); const a=all.filter(i=>i.answered()).length; const g=secs.reduce((s,x)=>s+(x.graded||0),0);
    const gradedSecs=secs.filter(s=>s.graded!=null); const tot=all.length; const p=Math.round(g/tot*100);
    ring.style.setProperty("--p",p); ring.lastChild.textContent=p+"%";
    info.lastChild.textContent=t("answered",{a,t:tot})+" · "+g+"/"+tot+(bestScore(N)!=null?" · "+t("best")+" "+bestScore(N)+"%":"");
    if(gradedSecs.length===secs.length){ const b=bestScore(N); if(b==null||p>b) LS.set("best:"+N,p); }
  }
  f.append(h("div",{class:"total"},ring,info,
    h("button",{class:"btn",onclick:()=>{ const all=allItems(); const un=all.filter(i=>!i.answered()).length; secs.forEach(grade); upd();
      const g=secs.reduce((s,x)=>s+(x.graded||0),0); const p=Math.round(g/all.length*100);
      toast((p>=90?t("great"):p>=70?t("good"):t("more"))+" "+p+"%"+(un?" · "+t("unanswered"):"")); }},t("checkAll")),
    h("button",{class:"btn ghost",onclick:()=>{ for(const k in answers) delete answers[k]; renderLesson(); }},t("reset")),
    h("button",{class:"btn ghost",onclick:()=>{ for(const k in answers) delete answers[k]; state.seed++; LS.set("seed:"+N,state.seed); renderLesson(); }},t("newSet"))));
  setTimeout(upd,0);
  return f;
}
/* fake pinyin options by altering tones */
const TONES={a:"āáǎà",e:"ēéěè",i:"īíǐì",o:"ōóǒò",u:"ūúǔù","ü":"ǖǘǚǜ"};
const REV={}; for(const b in TONES) [...TONES[b]].forEach((c,i)=>REV[c]=[b,i]);
function tonesVariant(py,rnd){
  const chars=[...py]; const pos=chars.map((c,i)=>REV[c]?i:-1).filter(i=>i>=0);
  const out=new Set(); let guard=0;
  while(out.size<3&&guard++<60){
    const c=chars.slice();
    if(pos.length){ const p=pos[Math.floor(rnd()*pos.length)]; const [b,ti]=REV[c[p]]; let nt=Math.floor(rnd()*4); if(nt===ti) nt=(nt+1)%4; c[p]=TONES[b][nt];
      if(pos.length>1&&rnd()<.5){ const p2=pos[Math.floor(rnd()*pos.length)]; if(p2!==p){const [b2,t2]=REV[c[p2]]; c[p2]=TONES[b2][(t2+1+Math.floor(rnd()*3))%4];} } }
    else { // neutral-only: add a tone to a vowel
      const vi=chars.findIndex(ch=>TONES[ch]); if(vi<0) break; c[vi]=TONES[chars[vi]][Math.floor(rnd()*4)]; }
    const s=c.join(""); if(s!==py) out.add(s);
  }
  // fallback: swap aspirated initials
  const swaps=[["zh","z"],["ch","c"],["sh","s"],["b","p"],["d","t"],["g","k"],["j","q"],["n","l"]];
  for(const [a,b] of swaps){ if(out.size>=3) break; if(py.startsWith(a)) out.add(b+py.slice(a.length)); else if(py.startsWith(b)) out.add(a+py.slice(b.length)); }
  while(out.size<3) out.add(py+"r".repeat(out.size+1));
  return [...out].slice(0,3);
}
})();
