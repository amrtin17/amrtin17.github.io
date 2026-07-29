/* ==========================================
   Load CSV Data
========================================== */

async function loadData(){
   const response = await fetch("assets/data/shanghai_data.csv");
   
   const csv = await response.text();
   
   console.log(csv);
}

async function init(){

    await loadData();

}

init();


