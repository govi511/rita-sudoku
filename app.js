(()=>{
const $=id=>document.getElementById(id),LS='ritaSudoku.';
const store={get:(k,d)=>{try{return JSON.parse(localStorage.getItem(LS+k))??d}catch{return d}},set:(k,v)=>{try{localStorage.setItem(LS+k,JSON.stringify(v))}catch{}}};
const DIFF_BONUS={easy:100,medium:250,hard:500},PAR={easy:600,medium:900,hard:1500};
const SWEET=["Perfect, Rita! 💕","You're amazing! ✨","Go Rita! 🌹","Big brain energy 💜","Shining like Lux! ⭐"];
let S,sel=-1,notesMode=false,tick=null;
const boardEl=$('board'),padEl=$('pad'),cells=[];
for(let i=0;i<81;i++){const b=document.createElement('button');b.className='cell';b.setAttribute('role','gridcell');b.onclick=()=>select(i);boardEl.appendChild(b);cells.push(b);}
for(let n=1;n<=9;n++){const b=document.createElement('button');b.innerHTML=n+'<small></small>';b.setAttribute('aria-label','Enter '+n);b.onclick=()=>input(n);padEl.appendChild(b);}
function newGame(){const d=$('diff').value,{puzzle,solution}=Sudoku.generate(d);
S={diff:d,puzzle,solution,vals:puzzle.slice(),notes:Array.from({length:81},()=>[]),score:0,streak:0,mistakes:0,hints:0,time:0,history:[],done:false};
sel=puzzle.findIndex(v=>!v);startTimer();save();render();}
function startTimer(){clearInterval(tick);tick=setInterval(()=>{if(!S.done&&!document.hidden){S.time++;$('timer').textContent=fmt(S.time);if(S.time%5==0)save();}},1000);}
const fmt=t=>Math.floor(t/60)+':'+String(t%60).padStart(2,'0');
function save(){store.set('game',S);}
function select(i){sel=i;render();cells[i].focus({preventScroll:true});}
function conflicts(i){const v=S.vals[i];if(!v)return false;const r=Math.floor(i/9),c=i%9;for(let j=0;j<81;j++){if(j===i||S.vals[j]!==v)continue;const r2=Math.floor(j/9),c2=j%9;if(r2===r||c2===c||(Math.floor(r/3)===Math.floor(r2/3)&&Math.floor(c/3)===Math.floor(c2/3)))return true;}return false;}
function peers(a,b){const r=Math.floor(a/9),c=a%9,r2=Math.floor(b/9),c2=b%9;return r===r2||c===c2||(Math.floor(r/3)===Math.floor(r2/3)&&Math.floor(c/3)===Math.floor(c2/3));}
function push(){S.history.push({i:sel,v:S.vals[sel],n:S.notes[sel].slice()});if(S.history.length>200)S.history.shift();}
function input(n){if(S.done||sel<0||S.puzzle[sel])return;
 if(notesMode){if(S.vals[sel])return;push();const a=S.notes[sel],k=a.indexOf(n);k<0?a.push(n):a.splice(k,1);a.sort();}
 else{if(S.vals[sel]===n)return;push();S.vals[sel]=n;S.notes[sel]=[];
  if(n===S.solution[sel]){S.streak++;S.score+=10+Math.min(20,(S.streak-1)*2);
   for(let j=0;j<81;j++)if(peers(sel,j)){const k=S.notes[j].indexOf(n);if(k>=0)S.notes[j].splice(k,1);}
   toast(S.streak>0&&S.streak%5===0?`🔥 ${S.streak} streak! `+SWEET[Math.random()*SWEET.length|0]:null);}
  else{S.streak=0;S.mistakes++;S.score=Math.max(0,S.score-15);}
  cells[sel].classList.remove('pop');void cells[sel].offsetWidth;cells[sel].classList.add('pop');}
 check();save();render();}
function erase(){if(S.done||sel<0||S.puzzle[sel])return;if(!S.vals[sel]&&!S.notes[sel].length)return;push();S.vals[sel]=0;S.notes[sel]=[];save();render();}
function undo(){const h=S.history.pop();if(!h||S.done)return;S.vals[h.i]=h.v;S.notes[h.i]=h.n;sel=h.i;save();render();}
function hint(){if(S.done)return;let i=sel>=0&&!S.puzzle[sel]&&S.vals[sel]!==S.solution[sel]?sel:S.vals.findIndex((v,k)=>v!==S.solution[k]);if(i<0)return;
 sel=i;push();S.vals[i]=S.solution[i];S.notes[i]=[];S.puzzle[i]=S.solution[i];S.hints++;S.score=Math.max(0,S.score-25);check();save();render();}
function check(){if(!S.vals.every((v,i)=>v===S.solution[i]))return;S.done=true;clearInterval(tick);
 const speed=Math.max(0,Math.round((PAR[S.diff]-S.time)/2)),perfect=S.mistakes===0&&S.hints===0?200:0,bonus=DIFF_BONUS[S.diff];
 S.score+=speed+perfect+bonus;const total=store.get('total',0)+S.score;store.set('total',total);
 const best=store.get('best',{});const prev=best[S.diff];const isBest=!prev||S.score>prev.score;if(isBest)best[S.diff]={score:S.score,time:S.time};store.set('best',best);
 const w=store.get('wins',0)+1;store.set('wins',w);
 $('winMsg').innerHTML=`Solved ${S.diff} in ${fmt(S.time)}! 🎉<br>Score: <b>${S.score}</b> (difficulty +${bonus}, speed +${speed}${perfect?', flawless +200':''})${isBest?'<br>🏆 New personal best!':''}<br><br>You're the smartest, cutest puzzle queen I know. I love you, Rita! 💖<br><small>Puzzles solved: ${w}</small>`;
 $('win').hidden=false;$('again').focus();confetti();}
function confetti(){const c=$('confetti'),em=document.documentElement.dataset.theme==='lux'?['✨','⭐','🌹','🌿','💛']:['🎀','💖','💀','🖤','🌸','💜'];
 for(let k=0;k<60;k++){const s=document.createElement('span');s.textContent=em[k%em.length];s.style.left=Math.random()*100+'vw';s.style.animationDuration=2+Math.random()*3+'s';s.style.animationDelay=Math.random()*1.5+'s';c.appendChild(s);}setTimeout(()=>c.innerHTML='',6000);}
let toastT;function toast(m){if(!m)return;$('welcome').textContent=m;clearTimeout(toastT);toastT=setTimeout(()=>$('welcome').textContent=WELCOME,2500);}
const WELCOME=$('welcome').textContent;
function render(){const sv=sel>=0?S.vals[sel]:0,counts=Array(10).fill(0);
 S.vals.forEach((v,i)=>{if(v===S.solution[i])counts[v]++;});
 cells.forEach((el,i)=>{const v=S.vals[i],r=Math.floor(i/9)+1,c=i%9+1;el.className='cell'+(S.puzzle[i]?' given':'')+(sel>=0&&i!==sel&&peers(i,sel)?' peer':'')+(sv&&v===sv&&i!==sel?' same':'')+(i===sel?' sel':'')+(v&&!S.puzzle[i]&&v!==S.solution[i]?' wrong':'')+(conflicts(i)?' conflict':'');
  if(v)el.textContent=v;else el.innerHTML=S.notes[i].length?'<div class="notes">'+[1,2,3,4,5,6,7,8,9].map(n=>`<span>${S.notes[i].includes(n)?n:''}</span>`).join('')+'</div>':'';
  el.setAttribute('aria-label',`Row ${r} column ${c}, ${v?v+(S.puzzle[i]?' given':v!==S.solution[i]?' incorrect':''):'empty'}${S.notes[i].length?', notes '+S.notes[i].join(' '):''}`);
  el.tabIndex=i===sel?0:-1;});
 [...padEl.children].forEach((b,k)=>{const left=9-counts[k+1];b.querySelector('small').textContent=left||'✓';b.classList.toggle('done',!left);});
 $('timer').textContent=fmt(S.time);$('score').textContent=S.score;$('streak').textContent=S.streak;$('mistakes').textContent=S.mistakes;$('total').textContent=store.get('total',0);
 $('notes').setAttribute('aria-pressed',notesMode);$('notesState').textContent=notesMode?'on':'off';
 const best=store.get('best',{});$('best').textContent='🏆 Best — '+['easy','medium','hard'].map(d=>`${d[0].toUpperCase()+d.slice(1)}: ${best[d]?best[d].score+' ('+fmt(best[d].time)+')':'—'}`).join(' · ');}
document.addEventListener('keydown',e=>{if(e.target.tagName==='SELECT'||!$('win').hidden)return;const k=e.key;
 if(/^[1-9]$/.test(k)){input(+k);e.preventDefault();}
 else if(k==='Backspace'||k==='Delete'||k==='0'){erase();e.preventDefault();}
 else if((e.ctrlKey||e.metaKey)&&k.toLowerCase()==='z'){undo();e.preventDefault();}
 else if(k==='n'||k==='N'){toggleNotes();}else if(k==='h'||k==='H'){hint();}
 else if(k.startsWith('Arrow')){if(sel<0)sel=0;const r=Math.floor(sel/9),c=sel%9,d={ArrowUp:[-1,0],ArrowDown:[1,0],ArrowLeft:[0,-1],ArrowRight:[0,1]}[k];select(((r+d[0]+9)%9)*9+(c+d[1]+9)%9);e.preventDefault();}});
function toggleNotes(){notesMode=!notesMode;render();}
$('notes').onclick=toggleNotes;$('undo').onclick=undo;$('erase').onclick=erase;$('hint').onclick=hint;
$('newGame').onclick=()=>{if(S.done||S.vals.every((v,i)=>v===S.puzzle[i])||confirm('Start a new puzzle? Current progress will be lost.'))newGame();};
$('again').onclick=()=>{$('win').hidden=true;newGame();};
$('diff').onchange=()=>{store.set('diff',$('diff').value);$('newGame').onclick();};
$('theme').onchange=()=>{document.documentElement.dataset.theme=$('theme').value;store.set('theme',$('theme').value);};
const qs=new URLSearchParams(location.search).get('skin');const th=['kitty','lux'].includes(qs)?qs:store.get('theme','kitty');$('theme').value=th;document.documentElement.dataset.theme=th;$('diff').value=store.get('diff','medium');
const saved=store.get('game',null);if(saved&&!saved.done&&saved.solution){S=saved;$('diff').value=S.diff;sel=S.vals.findIndex(v=>!v);startTimer();render();}else newGame();
})();
