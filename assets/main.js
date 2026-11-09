/* Main page: all lessons */
window.renderMain = function(){
  applyTheme();
  document.title = BOOK.sub+" · "+L(BOOK.name);
  document.body.innerHTML=""; document.body.className="lv"+BOOK.level;
  document.body.append(topBar());
  const ls=BOOK.lessons;
  const bests=ls.map(x=>bestScore(x.n));
  const doneN=bests.filter(b=>b!=null&&b>=60).length;
  const avg=bests.filter(b=>b!=null); const avgS=avg.length?Math.round(avg.reduce((a,b)=>a+b,0)/avg.length):0;
  const totalW=ls.reduce((a,x)=>a+x.nv,0), totalG=ls.reduce((a,x)=>a+x.ng,0), totalE=ls.reduce((a,x)=>a+x.ne,0);
  const hero=h("section",{class:"hero","data-big":BOOK.big||"汉"},h("div",{class:"wrap"},
    h("span",{class:"badge"},BOOK.badge),
    h("h1",{html:L(BOOK.heroTitle)}),
    h("p",null,L(BOOK.heroLead)),
    h("div",{class:"stats"},
      h("div",{class:"stat"},h("b",null,ls.length),h("span",null,t("lessons"))),
      h("div",{class:"stat"},h("b",null,totalW),h("span",null,t("words"))),
      h("div",{class:"stat"},h("b",null,totalG),h("span",null,t("grammarN"))),
      h("div",{class:"stat"},h("b",null,totalE),h("span",null,t("exN"))),
      h("div",{class:"stat",style:"min-width:200px"},h("span",null,t("myProg")+" · "+doneN+"/"+ls.length+" "+t("done")+(avg.length?" · "+t("best")+" avg "+avgS+"%":"")),h("div",{class:"prog"},h("i",{style:"width:"+(doneN/ls.length*100)+"%"})))
    )));
  const main=h("main",{class:"wrap"});
  const inp=h("input",{type:"search",placeholder:t("search"),"aria-label":"search"});
  main.append(h("div",{class:"toolbar"},h("div",{class:"search"},inp)));
  const list=h("div"); main.append(list);
  function draw(q){
    list.innerHTML=""; q=(q||"").trim().toLowerCase();
    const groups = BOOK.units||[{t:null,from:ls[0].n,to:ls[ls.length-1].n}];
    let shown=0;
    groups.forEach(g=>{
      const items=ls.filter(x=>x.n>=g.from&&x.n<=g.to).filter(x=>!q||[x.zh,x.py,x.ko,x.en,x.s,JSON.stringify(x.tags||[])].join(" ").toLowerCase().includes(q));
      if(!items.length) return;
      if(g.t) list.append(h("div",{class:"unit-h"},L(g.t)));
      const grid=h("div",{class:"grid"});
      items.forEach(x=>{ shown++;
        const b=bestScore(x.n);
        grid.append(h("a",{class:"lcard",href:"lesson.html?n="+x.n},
          h("span",{class:"score-badge"+(b==null?"":b>=80?" good":" mid")},b==null?"—":b+"%"),
          h("span",{class:"no"},t("lesson",{n:x.n}).toUpperCase()),
          h("span",{class:"zh"},x.zh),
          h("span",{class:"py"},x.py),
          h("span",{class:"tr"},LANG==="en"?x.en:x.ko),
          h("div",{class:"tags"},(x.tags||[]).slice(0,4).map(g=>h("span",{class:"tag"},L(g))))
        ));
      });
      list.append(grid);
    });
    if(!shown) list.append(h("div",{class:"empty"},t("noResult")));
  }
  inp.addEventListener("input",()=>draw(inp.value));
  draw("");
  document.body.append(hero,main,footerEl());
};
