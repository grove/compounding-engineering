"use strict";
function simulate(trace,policy){
  const free=[4,4],held=[0,0];let accepted=0,requests=0,opportunities=0;
  const check=()=>{if([...free,...held].some(x=>x<0)||free[0]+free[1]+held[0]+held[1]!==8)throw Error("capacity invariant");};
  for(const {demand,available} of trace){
    for(const i of demand){
      opportunities++;const j=1-i;
      if(policy==="pooled"){
        requests++;
        if(!available||free[0]+free[1]===0){check();continue;}
        free[free[i]>0?i:j]--;
      }else{
        if(free[i]===0&&policy!=="fixed"){
          requests++;
          const n=available?(policy==="transfer-one"?Math.min(1,free[j]):free[j]):0;
          free[j]-=n;free[i]+=n;
        }
        if(!free[i]){check();continue;}
        free[i]--;
      }
      held[i]++;accepted++;check();
    }
    for(let i=0;i<2;i++){free[i]+=held[i];held[i]=0;}
    check();
  }
  return {opportunities,accepted,requests};
}
function traces(){
  const repeat=(make)=>Array.from({length:10},(_,i)=>({demand:make(i),available:true}));
  return {
    balanced:repeat(()=>[0,1,0,1,0,1,0,1]),
    persistent:repeat(()=>Array(8).fill(0)),
    alternating:repeat(i=>Array(8).fill(i%2)),
    overload:repeat(()=>[0,1,0,1,0,1,0,1,0,1]),
    outage:[{demand:Array(8).fill(0),available:true},{demand:Array(8).fill(1),available:false}]
  };
}
const policies={"pooled":"Pooled check","fixed":"Fixed rights","transfer-one":"Transfer one","transfer-all":"Transfer all"};
const workloads=traces();
const controls=document.getElementById("coordination-controls");
const select=document.getElementById("demand-pattern");
const results=document.getElementById("model-results");
function update(){
  const trace=workloads[select.value];
  const rows=Object.entries(policies).map(([policy,label])=>{
    const r=simulate(trace,policy);
    const row=document.createElement("tr");
    for(const [i,value] of [label,r.accepted,r.opportunities-r.accepted,r.requests].entries()){
      const cell=document.createElement(i===0?"th":"td");
      if(i===0)cell.scope="row";
      cell.textContent=String(value);row.appendChild(cell);
    }
    return row;
  });
  results.replaceChildren(...rows);
  const total=simulate(trace,"pooled").opportunities;
  document.getElementById("model-status").textContent=select.options[select.selectedIndex].text+": "+total+" opportunities. Shared requests include unsuccessful attempts; discharge interactions excluded.";
}
select.addEventListener("change",update);
update();
controls.hidden=false;
