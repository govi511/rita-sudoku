(function(root){
function shuffle(a){for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;}
function candidates(b,i){const r=Math.floor(i/9),c=i%9,used=new Set();for(let k=0;k<9;k++){used.add(b[r*9+k]);used.add(b[k*9+c]);}const br=r-r%3,bc=c-c%3;for(let y=0;y<3;y++)for(let x=0;x<3;x++)used.add(b[(br+y)*9+bc+x]);const out=[];for(let n=1;n<=9;n++)if(!used.has(n))out.push(n);return out;}
function countSolutions(b,limit){b=b.slice();let count=0;(function rec(){if(count>=limit)return;let best=-1,bc=null;for(let i=0;i<81;i++)if(!b[i]){const c=candidates(b,i);if(!c.length)return;if(!bc||c.length<bc.length){best=i;bc=c;if(c.length===1)break;}}if(best<0){count++;return;}for(const n of bc){b[best]=n;rec();if(count>=limit)break;}b[best]=0;})();return count;}
function solve(b){b=b.slice();function rec(){let best=-1,bc=null;for(let i=0;i<81;i++)if(!b[i]){const c=candidates(b,i);if(!c.length)return false;if(!bc||c.length<bc.length){best=i;bc=c;}}if(best<0)return true;for(const n of shuffle(bc)){b[best]=n;if(rec())return true;}b[best]=0;return false;}return rec()?b:null;}
const CLUES={easy:40,medium:32,hard:26};
function generate(diff){const sol=solve(new Array(81).fill(0));const p=sol.slice();const target=CLUES[diff]||32;let filled=81;for(const i of shuffle([...Array(81).keys()])){if(filled<=target)break;const v=p[i];p[i]=0;if(countSolutions(p,2)!==1)p[i]=v;else filled--;}return{puzzle:p,solution:sol};}
const api={generate,solve,countSolutions,candidates};
if(typeof module!=='undefined')module.exports=api;else root.Sudoku=api;
})(this);
