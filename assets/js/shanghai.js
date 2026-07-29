/* ==========================================
   Load CSV Data
========================================== */

async function loadData() {

    console.log("Start loading...");

    const response = await fetch("assets/data/poi.csv");

    console.log(response);

    const csv = await response.text();

    console.log(csv);

}

loadData();
