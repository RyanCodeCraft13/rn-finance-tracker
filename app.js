// ------------------- DATA -------------------
let unlocked=false;
let attempts=0;

let data=JSON.parse(localStorage.getItem("rnData"))||{
  users:{default:{pin:"1234"}},
  currentUser:"default",
  banks:{GCash:0,Maya:0,GoTyme:0,MariBank:0,BDO:0},
  transactions:[],
  budgets:{Food:5000,Bills:8000,General:10000,Entertainment:3000}
};

const bankList=Object.keys(data.banks);

// ------------------- PIN -------------------
function save(){localStorage.setItem("rnData",JSON.stringify(data));}

function checkPIN(){
  let pin=document.getElementById("pinInput").value;
  if(pin===data.users[data.currentUser].pin){
    document.getElementById("pinScreen").style.display="none";
    unlocked=true;
    render();
  } else {
    attempts++;
    alert("Wrong PIN!");
    if(attempts>=3){alert("Too many attempts. Try again later.");}
  }
}

function changePIN(){
  let newPin=prompt("Enter new 4-digit PIN:");
  if(newPin && newPin.length===4){
    data.users[data.currentUser].pin=newPin;
    save();
    alert("PIN updated!");
  } else {alert("Invalid PIN");}
}

// ------------------- RENDER BANKS -------------------
function populateBanks(){
  let bankSel=document.getElementById("bank");
  let transferSel=document.getElementById("transferBank");
  bankSel.innerHTML=""; transferSel.innerHTML="";
  bankList.forEach(b=>{
    bankSel.innerHTML+=`<option>${b}</option>`;
    transferSel.innerHTML+=`<option>${b}</option>`;
  });
}

// ------------------- ADD TRANSACTION -------------------
function addTransaction(){
  if(!unlocked){alert("Unlock first"); return;}
  let bank=document.getElementById("bank").value;
  let type=document.getElementById("type").value;
  let amount=parseFloat(document.getElementById("amount").value);
  let category=document.getElementById("category").value;
  let transferBank=document.getElementById("transferBank").value;
  let note=document.getElementById("note").value;

  if(!amount||amount<=0){alert("Enter valid amount"); return;}
  if(type==="transfer" && bank===transferBank){alert("Select different bank for transfer"); return;}

  if(type==="deposit") data.banks[bank]+=amount;
  if(type==="withdraw") data.banks[bank]-=amount;
  if(type==="transfer"){
    data.banks[bank]-=amount;
    data.banks[transferBank]+=amount;
  }

  data.transactions.push({
    bank,type,amount,category,note,date:new Date().toISOString(),
    transferBank:type==="transfer"?transferBank:""
  });

  save();
  render();

  document.getElementById("amount").value="";
  document.getElementById("note").value="";
}

// ------------------- RENDER -------------------
function render(){
  if(!unlocked) return;
  populateBanks();

  let balancesDiv=document.getElementById("balances");
  balancesDiv.innerHTML="";
  for(let b in data.banks){
    balancesDiv.innerHTML+=`<div>${b}: ₱${data.banks[b]}</div>`;
  }

  renderSummary();
  renderPie();
}

// ------------------- MONTHLY SUMMARY -------------------
function renderSummary(){
  let income=0, expense=0;
  data.transactions.forEach(t=>{
    if(t.type==="deposit") income+=t.amount;
    else expense+=t.amount;
  });
  document.getElementById("summary").innerHTML=
    `Income: ₱${income}<br>Expense: ₱${expense}<br>Net: ₱${income-expense}`;
}

// ------------------- PIE CHART -------------------
let pieChart=null;
function renderPie(){
  let cat={};
  data.transactions.forEach(t=>{
    if(!cat[t.category]) cat[t.category]=0;
    cat[t.category]+=t.amount;
  });
  const ctx=document.getElementById("pieChart").getContext("2d");
  if(pieChart) pieChart.destroy();
  pieChart=new Chart(ctx,{
    type:'pie',
    data:{
      labels:Object.keys(cat),
      datasets:[{data:Object.values(cat),backgroundColor:['#00c6ff','#ff6347','#32cd32','#ffdd57']}]
    }
  });
}

// ------------------- BACKUP / RESTORE -------------------
function exportBackup(){
  const blob=new Blob([JSON.stringify(data)],{type:"application/json"});
  const a=document.createElement("a");
  a.href=URL.createObjectURL(blob);
  a.download="rn-finance-backup.json";
  a.click();
}

function importBackup(e){
  const file=e.target.files[0];
  const reader=new FileReader();
  reader.onload=()=>{
    data=JSON.parse(reader.result);
    save();
    render();
    alert("Backup imported!");
  };
  reader.readAsText(file);
}

// ------------------- INITIAL -------------------
populateBanks();
render();
