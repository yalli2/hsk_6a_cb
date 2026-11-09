/* HSK Standard Course study site — core (i18n · TTS · helpers · top bar) */
(function(){
"use strict";
const LS = window.LS = {
  k:(k)=>"hskcb:"+(window.BOOK?BOOK.id:"x")+":"+k,
  get(k,d){ try{const v=localStorage.getItem(this.k(k)); return v==null?d:JSON.parse(v);}catch(e){return d} },
  set(k,v){ try{localStorage.setItem(this.k(k),JSON.stringify(v))}catch(e){} },
  gget(k,d){ try{const v=localStorage.getItem("hskcb:"+k); return v==null?d:JSON.parse(v);}catch(e){return d} },
  gset(k,v){ try{localStorage.setItem("hskcb:"+k,JSON.stringify(v))}catch(e){} }
};

/* ---------- i18n ---------- */
window.LANG = LS.gget("lang", (navigator.language||"ko").slice(0,2)==="ko"?"ko":"en");
const UI = window.UI = {
  home:{ko:"전체 과 목록",en:"All lessons"},
  lesson:{ko:"제{n}과",en:"Lesson {n}"},
  lessons:{ko:"과",en:"lessons"},
  words:{ko:"단어",en:"words"},
  grammarN:{ko:"문법 포인트",en:"grammar points"},
  exN:{ko:"연습문제",en:"exercises"},
  myProg:{ko:"나의 학습 진도",en:"My progress"},
  done:{ko:"완료",en:"done"},
  search:{ko:"과 제목·단어·문법으로 검색 (예: 什么, 了, 날씨)",en:"Search lessons, words or grammar (e.g. 什么, 了, weather)"},
  noResult:{ko:"검색 결과가 없어요.",en:"No results."},
  tabText:{ko:"📖 본문",en:"📖 Texts"},
  tabVocab:{ko:"🔤 단어",en:"🔤 Words"},
  tabGram:{ko:"📐 문법",en:"📐 Grammar"},
  tabEx:{ko:"✍️ 연습문제",en:"✍️ Exercises"},
  showPy:{ko:"병음",en:"Pinyin"},
  showTr:{ko:"번역",en:"Translation"},
  playAll:{ko:"▶ 전체 듣기",en:"▶ Play all"},
  stop:{ko:"■ 정지",en:"■ Stop"},
  list:{ko:"목록",en:"List"},
  flash:{ko:"플래시카드",en:"Flashcards"},
  flip:{ko:"카드를 눌러 뒤집기",en:"Tap the card to flip"},
  prev:{ko:"◀ 이전",en:"◀ Prev"},
  next:{ko:"다음 ▶",en:"Next ▶"},
  shuffle:{ko:"🔀 섞기",en:"🔀 Shuffle"},
  goals:{ko:"이번 과의 학습 목표",en:"Goals of this lesson"},
  culture:{ko:"문화 엿보기",en:"Culture corner"},
  examples:{ko:"예문",en:"Examples"},
  check:{ko:"채점하기",en:"Check"},
  checkAll:{ko:"전체 채점",en:"Check all"},
  reset:{ko:"다시 풀기",en:"Retry"},
  newSet:{ko:"🔀 새 문제",en:"🔀 New set"},
  showAns:{ko:"정답 보기",en:"Show answers"},
  total:{ko:"총점",en:"Total score"},
  best:{ko:"최고 기록",en:"Best"},
  answered:{ko:"{a}/{t} 문항 답함",en:"{a}/{t} answered"},
  correct:{ko:"정답!",en:"Correct!"},
  wrong:{ko:"오답 — 정답: ",en:"Wrong — answer: "},
  T:{ko:"맞다 ✓",en:"True ✓"},
  F:{ko:"틀리다 ✗",en:"False ✗"},
  tapOrder:{ko:"단어를 눌러 순서대로 배열하세요 (다시 누르면 빠짐)",en:"Tap the words in order (tap again to remove)"},
  choose:{ko:"선택",en:"choose"},
  voice:{ko:"음성",en:"Voice"},
  voiceSel:{ko:"중국어 음성 선택",en:"Chinese voice"},
  autoVoice:{ko:"자동(가장 자연스러운 음성)",en:"Auto (most natural)"},
  speed:{ko:"속도",en:"Speed"},
  test:{ko:"🔊 들어보기",en:"🔊 Test"},
  voiceHint:{ko:"가장 자연스러운 원어민 음성은 Microsoft Edge의 'Xiaoxiao/Yunxi (Natural)' 또는 Chrome의 'Google 普通话'입니다. iPad·Mac은 'Tingting'이 자동 선택됩니다.",en:"For the most natural native voice use Microsoft Edge ('Xiaoxiao/Yunxi Natural') or Chrome ('Google 普通话'). iPad/Mac use 'Tingting'."},
  noVoice:{ko:"🔇 중국어 음성이 없어요 — Edge 또는 Chrome을 사용해 보세요",en:"🔇 No Chinese voice — try Edge or Chrome"},
  exMeaning:{ko:"뜻 고르기",en:"Choose the meaning"},
  exMeaningI:{ko:"중국어 단어를 듣고 알맞은 뜻을 고르세요.",en:"Listen to the word and choose its meaning."},
  exListen:{ko:"듣고 고르기",en:"Listen and choose"},
  exListenI:{ko:"🔊를 눌러 듣고 들리는 단어를 고르세요.",en:"Tap 🔊, listen, and choose the word you hear."},
  exPinyin:{ko:"병음 고르기",en:"Choose the pinyin"},
  exPinyinI:{ko:"단어의 올바른 병음(성조 포함)을 고르세요.",en:"Choose the correct pinyin (with tones)."},
  exReverse:{ko:"알맞은 단어 고르기",en:"Choose the word"},
  exReverseI:{ko:"뜻에 맞는 중국어 단어를 고르세요.",en:"Choose the Chinese word for the meaning."},
  exFill:{ko:"빈칸 채우기",en:"Fill in the blanks"},
  exFillI:{ko:"보기에서 알맞은 단어를 골라 빈칸을 채우세요.",en:"Fill each blank with a word from the box."},
  exOrder:{ko:"문장 만들기",en:"Build the sentence"},
  exOrderI:{ko:"단어를 올바른 순서로 배열해 문장을 완성하세요.",en:"Put the words in the correct order."},
  exTF:{ko:"본문 내용 확인 (O/X)",en:"True or false (texts)"},
  exTFI:{ko:"본문 내용과 맞으면 '맞다', 틀리면 '틀리다'를 고르세요.",en:"Decide whether each statement matches the texts."},
  exMCQ:{ko:"알맞은 답 고르기",en:"Multiple choice"},
  exMCQI:{ko:"질문을 읽고 가장 알맞은 답을 고르세요.",en:"Read each question and choose the best answer."},
  exRead:{ko:"독해",en:"Reading"},
  exReadI:{ko:"글을 읽고 질문에 답하세요.",en:"Read the passage and answer the questions."},
  levels:{ko:"다른 급수",en:"Other levels"},
  footer:{ko:"수업용 학습 사이트 · 본문과 예문은 교재의 주제·어휘·문법을 바탕으로 새로 구성한 것입니다.",en:"Class study site · Texts and examples are newly written from the textbook's topics, vocabulary and grammar."},
  great:{ko:"훌륭해요! 🎉",en:"Excellent! 🎉"},
  good:{ko:"잘했어요! 👍",en:"Good job! 👍"},
  more:{ko:"조금 더 연습해요 💪",en:"Keep practicing 💪"},
  unanswered:{ko:"아직 안 푼 문제가 있어요",en:"Some questions are unanswered"},
  speaker:{ko:"화자",en:"Speaker"}
};
window.t = function(k,vars){ const o=UI[k]; let s=o?(o[LANG]||o.en||o.ko):k; if(vars) for(const v in vars) s=s.replace("{"+v+"}",vars[v]); return s; };
/* content strings: {ko,en} or [ko,en] */
window.L = function(o){ if(o==null) return ""; if(typeof o==="string") return o; if(Array.isArray(o)) return (LANG==="en"?o[1]:o[0])||o[0]||""; return o[LANG]||o.en||o.ko||""; };
window.setLang = function(l){ LANG=l; LS.gset("lang",l); document.documentElement.lang=l; document.dispatchEvent(new Event("langchange")); };

/* ---------- DOM helpers ---------- */
window.$ = (s,r=document)=>r.querySelector(s);
window.$$ = (s,r=document)=>[...r.querySelectorAll(s)];
window.h = function(tag, attrs, ...kids){
  const e=document.createElement(tag);
  if(attrs) for(const k in attrs){ const v=attrs[k]; if(v==null||v===false) continue;
    if(k.startsWith("on")) e.addEventListener(k.slice(2),v);
    else if(k==="html") e.innerHTML=v; else if(k==="class") e.className=v; else e.setAttribute(k,v===true?"":v); }
  for(const c of kids.flat(9)){ if(c==null||c===false) continue; e.append(c.nodeType?c:document.createTextNode(c)); }
  return e;
};
window.seeded = function(seed){ let s=(seed>>>0)||1; return ()=>{ s^=s<<13; s>>>=0; s^=s>>17; s^=s<<5; s>>>=0; return (s%1000003)/1000003; }; };
window.shuffle = function(a, rnd=Math.random){ a=a.slice(); for(let i=a.length-1;i>0;i--){const j=Math.floor(rnd()*(i+1));[a[i],a[j]]=[a[j],a[i]]} return a; };
window.toast = function(msg){ let el=$(".toast"); if(!el){el=h("div",{class:"toast"});document.body.append(el)} el.textContent=msg; el.classList.add("on"); clearTimeout(el._t); el._t=setTimeout(()=>el.classList.remove("on"),2400); };
window.esc = s=>String(s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));

/* ruby: zh string + space-separated syllables for each Han char */
const HAN=/[㐀-鿿豈-﫿]/;
window.ruby = function(zh, py, hl){
  const sy=(py||"").split(" ").filter(Boolean); let i=0; const out=h("span",{class:"zhline hz"});
  const hlset = hl? new Set(hl): null;
  for(const ch of [...zh]){
    if(HAN.test(ch)){ const r=h("ruby",null,ch,h("rt",null,sy[i++]||"")); out.append(r); }
    else out.append(document.createTextNode(ch));
  }
  return out;
};
window.pyWord = function(py){ return (py||"").split(" ").join(""); };

/* ---------- TTS (native Mandarin, best available voice) ---------- */
const TTS = window.TTS = {
  voices:[], voice:null, rate:LS.gget("rate",0.9), pref:LS.gget("voice","auto"), curBtn:null, queue:0,
  score(v){
    const n=v.name, l=(v.lang||"").replace("_","-").toLowerCase();
    if(!/^zh|^cmn/.test(l) && !/chinese|普通话|中文|mandarin/i.test(n)) return -1;
    if(/hk|yue|cantonese|粤|廣東|粵/i.test(l+n)) return -1;
    let s=0;
    if(/zh-cn|cmn|zh-hans/.test(l)) s+=20; else if(/zh-tw/.test(l)) s+=6; else s+=10;
    if(/natural|neural|online/i.test(n)) s+=30;
    if(/xiaoxiao|yunxi|xiaoyi|yunjian|xiaochen|xiaohan|xiaomo|xiaoxuan|yunyang|xiaorui/i.test(n)) s+=15;
    if(/google/i.test(n)) s+=18;
    if(/tingting|ting-ting|lili|yu-shu|lilian|meijia/i.test(n)) s+=12;
    if(/premium|enhanced|高品质|增强|siri/i.test(n)) s+=10;
    if(/huihui|kangkang|yaoyao/i.test(n)) s+=3;
    return s;
  },
  load(){ if(!("speechSynthesis" in window)) return;
    this.voices=speechSynthesis.getVoices().filter(v=>this.score(v)>=0).sort((a,b)=>this.score(b)-this.score(a)); this.pick(); },
  pick(){ if(this.pref!=="auto"){ const v=this.voices.find(v=>v.name===this.pref); if(v){this.voice=v;return;} } this.voice=this.voices[0]||null; },
  clean(s){ return String(s).replace(/[（(][^)）]*[)）]/g,"").replace(/_{2,}|＿+/g,"，").replace(/…+|\.{3}/g,"，").replace(/[A-Z]：|[A-Z]:/g,"").trim(); },
  stop(){ this.queue++; try{speechSynthesis.cancel()}catch(e){} if(this.curBtn){this.curBtn.classList.remove("playing");this.curBtn=null} },
  speak(text,opt={}){
    text=this.clean(text); if(!text) return Promise.resolve();
    if(!opt.keep) this.stop();
    const btn=opt.btn; if(btn){btn.classList.add("playing");this.curBtn=btn}
    return new Promise(res=>{
      const fin=()=>{ if(btn) btn.classList.remove("playing"); res(); };
      if(!("speechSynthesis" in window)){ toast(t("noVoice")); return fin(); }
      if(!this.voices.length) this.load();
      const u=new SpeechSynthesisUtterance(text);
      if(this.voice){u.voice=this.voice;u.lang=this.voice.lang} else { u.lang="zh-CN"; if(!this._warned){this._warned=1;toast(t("noVoice"))} }
      u.rate=opt.rate||this.rate; u.pitch=1; u.onend=fin; u.onerror=fin;
      speechSynthesis.speak(u);
      const guard=setInterval(()=>{ if(!speechSynthesis.speaking&&!speechSynthesis.pending){clearInterval(guard);fin();} },400);
    });
  },
  async seq(items, onEach){ // items: [{text, el}]
    this.stop(); const my=++this.queue;
    for(const it of items){ if(my!==this.queue) break; onEach&&onEach(it,true); await this.speak(it.text,{keep:true}); onEach&&onEach(it,false); if(my!==this.queue) break; await new Promise(r=>setTimeout(r,280)); }
  }
};
if("speechSynthesis" in window){ TTS.load(); speechSynthesis.onvoiceschanged=()=>{TTS.load(); window.renderVoiceMenu&&renderVoiceMenu();}; setTimeout(()=>TTS.load(),700); }
window.sayBtn = function(text,cls=""){ return h("button",{class:"say "+cls,title:"🔊","aria-label":"play",onclick:e=>{e.stopPropagation();TTS.speak(text,{btn:e.currentTarget})}},"🔊"); };

/* ---------- top bar ---------- */
window.LEVELS=[["hsk_1_cb","HSK 1"],["hsk_2_cb","HSK 2"],["hsk_3_cb","HSK 3"],["hsk_4a_cb","4上"],["hsk_4b_cb","4下"],["hsk_5a_cb","5上"],["hsk_5b_cb","5下"],["hsk_6a_cb","6上"],["hsk_6b_cb","6下"]];
window.topBar = function(){
  const bar=h("div",{class:"top"}); const w=h("div",{class:"wrap"}); bar.append(w);
  w.append(h("a",{class:"brand",href:"index.html"},h("span",{class:"logo"},BOOK.logo||"汉"),h("span",null,h("b",null,L(BOOK.name)),h("small",null,BOOK.sub))));
  const nav=h("div",{class:"lv-nav"}); const base=location.hostname.endsWith("github.io")?"/":"../";
  LEVELS.forEach(([r,lab])=>nav.append(h("a",{href:base+r+"/",class:r===BOOK.repo?"cur":null},lab)));
  w.append(h("span",{class:"sp"}),nav);
  // voice
  const vm=h("div",{class:"menu"}); const vpop=h("div",{class:"pop",onclick:e=>e.stopPropagation()});
  vm.append(h("button",{class:"tbtn",onclick:e=>{e.stopPropagation();$$(".menu.open").forEach(m=>m!==vm&&m.classList.remove("open"));vm.classList.toggle("open")}},"🔊",h("span",{class:"lbl"},t("voice"))),vpop);
  window.renderVoiceMenu=function(){
    vpop.innerHTML="";
    const sel=h("select",{onchange:e=>{TTS.pref=e.target.value;LS.gset("voice",TTS.pref);TTS.pick();}});
    sel.append(h("option",{value:"auto"},t("autoVoice")+(TTS.voices[0]?" — "+TTS.voices[0].name:"")));
    TTS.voices.forEach(v=>sel.append(h("option",{value:v.name},v.name)));
    sel.value=TTS.voices.find(v=>v.name===TTS.pref)?TTS.pref:"auto";
    const rv=h("b",null,TTS.rate.toFixed(2)+"×");
    const rng=h("input",{type:"range",min:"0.5",max:"1.3",step:"0.05",value:String(TTS.rate),oninput:e=>{TTS.rate=+e.target.value;rv.textContent=TTS.rate.toFixed(2)+"×";LS.gset("rate",TTS.rate)}});
    vpop.append(h("label",null,t("voiceSel")),sel,h("label",null,t("speed")," ",rv),rng,
      h("div",{style:"margin-top:10px"},h("button",{class:"btn sm",onclick:e=>TTS.speak("你好！欢迎来到汉语课。我们一起学习吧！",{btn:e.currentTarget})},t("test"))),
      h("div",{class:"hint"},t("voiceHint")));
  };
  renderVoiceMenu();
  const lb=h("button",{class:"tbtn",onclick:()=>setLang(LANG==="ko"?"en":"ko")},"🌐",h("span",null,LANG==="ko"?"English":"한국어"));
  w.append(vm,lb);
  document.addEventListener("click",()=>$$(".menu.open").forEach(m=>m.classList.remove("open")));
  return bar;
};
window.applyTheme = function(){ const r=document.documentElement.style; r.setProperty("--c",BOOK.color); r.setProperty("--c2",BOOK.color2); r.setProperty("--cbg",BOOK.colorbg); document.documentElement.lang=LANG; };
window.footerEl = ()=>h("footer",null,BOOK.sub+" · "+t("footer"));
window.bestScore = n=>LS.get("best:"+n,null);
})();
