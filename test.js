const S=require('./sudoku.js');
function valid(b){for(let i=0;i<9;i++){const r=new Set(),c=new Set(),x=new Set();for(let j=0;j<9;j++){r.add(b[i*9+j]);c.add(b[j*9+i]);x.add(b[(3*Math.floor(i/3)+Math.floor(j/3))*9+3*(i%3)+j%3]);}if(r.size+c.size+x.size!==27||r.has(0))return false;}return true;}
for(const d of ['easy','medium','hard'])for(let t=0;t<5;t++){const s=Date.now(),{puzzle,solution}=S.generate(d);const clues=puzzle.filter(Boolean).length;
if(!valid(solution))throw 'bad sol';if(S.countSolutions(puzzle,2)!==1)throw 'not unique';puzzle.forEach((v,i)=>{if(v&&v!==solution[i])throw 'mismatch'});console.log(d,clues,'clues',Date.now()-s,'ms OK');}
