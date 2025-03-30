// Job Finder script - now with listeners and stuff, ugh
const sampleJobs = [
  {title: "Software Engineer", company_name: "TechCorp", location: "Berlin, Germany", continent: "Europe", description: "Build cool web stuff", tags: ["IT", "Software Dev", "FullTime"], url: "https://example.com/apply/1"},
  {title: "Data Analyst", company_name: "DataSys", location: "Remote", continent: "Remote", description: "Crunch numbers from home", tags: ["Data", "Remote", "FullTime"], url: "https://example.com/apply/2"},
  {title: "Product Manager", company_name: "Innovate Ltd", location: "London, UK", continent: "Europe", description: "Boss people around nicely", tags: ["Management", "Product", "FullTime"], url: "https://example.com/apply/3"},
  {title: "Marketing Specialist", company_name: "GrowEasy", location: "Remote", continent: "Remote", description: "Make ads that sell", tags: ["Marketing", "Remote", "FullTime"], url: "https://example.com/apply/4"},
  {title: "Field Researcher", company_name: "Antarctic Surveys", location: "McMurdo Station, Antarctica", continent: "Antarctica", description: "Freeze for science", tags: ["Science", "Research", "Contract"], url: "https://example.com/apply/5"},
  {title: "AI Developer", company_name: "AsiaTech", location: "Tokyo, Japan", continent: "Asia", description: "Code smart machines", tags: ["IT", "AI", "FullTime"], url: "https://example.com/apply/6"},
  {title: "Mining Engineer", company_name: "AusMinerals", location: "Perth, Australia", continent: "Australia", description: "Dig stuff up", tags: ["Engineering", "Mining", "FullTime"], url: "https://example.com/apply/7"},
  {title: "Nurse", company_name: "MediCare", location: "Toronto, Canada", continent: "North America", description: "Help sick folks", tags: ["Healthcare", "Nursing", "FullTime"], url: "https://example.com/apply/8"},
  {title: "Agricultural Specialist", company_name: "AgriCorp", location: "Sao Paulo, Brazil", continent: "South America", description: "Grow better crops", tags: ["Agriculture", "FullTime"], url: "https://example.com/apply/9"},
  {title: "Wildlife Biologist", company_name: "EcoAfrica", location: "Nairobi, Kenya", continent: "Africa", description: "Watch animals", tags: ["Science", "Biology", "FullTime"], url: "https://example.com/apply/10"}
];

let jobListings = [];
let jobCats = new Set();
let companies = new Set(); // new set for company names, sweet!
let totallyUselessCounter = 0; // lol why did i add this

// Kick things off
function startLoadingJobs() {
  let jobsDiv = document.getElementById('jobList');
  jobsDiv.innerHTML = "<p>Hang on, grabbing jobs...</p>";

  fetch('https://remoteok.io/api', {mode: 'cors'})
  .then(response => {
      if (!response.ok) throw new Error("Oops, API messed up: " + response.status);
      return response.json();
  })
  .then(data => {
      console.log("Got some jobs:", data); // peek at what we got
      jobListings = data.slice(1).map(function(job) { // old school function, why not
          let whereItsAt = figureOutContinent(job.location || "Remote");
          let jobTags = job.tags && Array.isArray(job.tags) ? job.tags.map(t => t.trim()) : ["NoCategory"];
          console.log(`Job: ${job.position}, Place: ${job.location || "Remote"}, Tags: ${jobTags}`);
          totallyUselessCounter++; // counting for no reason, ha
          return {
              title: job.position,
              company_name: job.company,
              location: job.location || "Remote",
              continent: whereItsAt,
              description: job.description || "No details, sorry",
              tags: jobTags,
              url: job.url || "#"
          };
      });
      jobListings = jobListings.concat(sampleJobs); // toss in my sample ones too
      loadCategories();
      loadCompanies();
      showJobs(jobListings);
      setupListeners(); // new listener setup
  })
  .catch(err => {
      console.log("Fetch failed, dang it:", err);
      jobsDiv.innerHTML = "<p>API's down, using backup jobs.</p>";
      jobListings = sampleJobs;
      loadCategories();
      loadCompanies();
      showJobs(jobListings);
      setupListeners();
  });
}

// Figure out where the heck this job is
function figureOutContinent(place) {
  if (!place) return "Dunno";
  let spot = place.toLowerCase();
  if (spot.includes("remote") || spot.includes("home")) return "Remote";

  let continents = {
      "Africa": ["egypt", "nigeria", "kenya", "ghana", "south africa", "morocco"],
      "Asia": ["china", "india", "japan", "singapore", "korea", "philippines", "thailand"],
      "Australia": ["australia", "new zealand"],
      "Europe": ["germany", "france", "uk", "spain", "italy", "poland", "sweden"],
      "North America": ["usa", "canada", "mexico", "united states"],
      "South America": ["brazil", "argentina", "chile", "colombia", "peru"],
      "Antarctica": ["antarctica"]
  };

  for (let cont in continents) {
      if (continents[cont].some(c => spot.includes(c))) return cont;
  }
  console.log("Couldn’t place this one:", place);
  return "Dunno";
}

// DRY function for dropdowns—finally stopped copying code!
function loadDropdown(dropdownId, itemsSet, defaultText) {
  let box = document.getElementById(dropdownId);
  box.innerHTML = `<option value="">${defaultText}</option>`;
  let tempArray = Array.from(itemsSet); // why did i do this
  tempArray.sort();
  for (let i = 0; i < tempArray.length; i++) { // old school loop for no reason
      let opt = document.createElement("option");
      opt.value = tempArray[i];
      opt.text = tempArray[i];
      box.appendChild(opt);
  }
  console.log(`${dropdownId} loaded:`, tempArray);
}

// Fill up that category dropdown
function loadCategories() {
  jobCats.clear();
  jobListings.forEach(job => {
      if (job.tags) {
          for (let t of job.tags) { // mixed up the loop style, heh
              jobCats.add(t);
          }
      }
  });
  loadDropdown("category", jobCats, "Pick any category");
}

// Load company dropdown
function loadCompanies() {
  companies.clear();
  jobListings.forEach(job => {
      if (job.company_name) companies.add(job.company_name);
  });
  loadDropdown("companySelect", companies, "Any Company");
}

// Filter stuff when someone searches
function filterJobs() {
  let continentPick = document.getElementById("continent").value.toLowerCase();
  let catPick = document.getElementById("category").value.toLowerCase();
  let compPick = document.getElementById("companySelect").value.toLowerCase();
  let searchComp = document.getElementById("company").value.toLowerCase().trim();
  let someRandomVar = "why do i even have this"; // lol pointless

  console.log("Searching with:", continentPick, catPick, compPick, searchComp, someRandomVar);

  let matches = [];
  for (let job of jobListings) { // switched to for...of for variety
      let contMatch = !continentPick || (job.continent.toLowerCase() == continentPick);
      let tags = [];
      for (let t of job.tags) { // another loop style, why not
          tags.push(t.toLowerCase());
      }
      let catMatch = !catPick || tags.includes(catPick);
      let compMatch = !compPick || job.company_name.toLowerCase() == compPick;
      let textMatch = !searchComp || job.company_name.toLowerCase().includes(searchComp);

      if (!contMatch || !catMatch || !compMatch || !textMatch) {
          console.log(`Dropped ${job.title}:`, {contMatch, catMatch, compMatch, textMatch});
      }

      if (contMatch && catMatch && compMatch && textMatch) {
          matches.push(job);
      }
  }

  showJobs(matches);
}

// Show the jobs on the page
function showJobs(jobsToShow) {
  let jobArea = document.getElementById("jobList");
  if (jobsToShow.length == 0) {
      jobArea.innerHTML = "<p>No luck, try something else!</p>";
  } else {
      jobArea.innerHTML = "";
      for (let i = 0; i < jobsToShow.length; i++) { // back to old school loops
          let job = jobsToShow[i];
          let div = document.createElement("div");
          div.className = "job-item";
          div.innerHTML = `<strong>${job.title}</strong> - ${job.company_name}<br><small>${job.location} (${job.continent})</small>`;
          div.addEventListener("click", function() { // mixed up the function style
              showDetails(job);
          });
          jobArea.appendChild(div);
      }
  }
}

// Pop up the job details
function showDetails(job) {
  let details = document.getElementById("detailsContent");
  details.innerHTML = `
  <h3>${job.title}</h3>
  <p><strong>Company:</strong> ${job.company_name}</p>
  <p><strong>Where:</strong> ${job.location} (${job.continent})</p>
  <p><strong>About:</strong> ${job.description}</p>
  <p><strong>Tags:</strong> ${job.tags.join(", ")}</p>
  <a href="${job.url}" target="_blank">Apply here</a>
  `;
  console.log("Showing details for:", job.title); // extra log for no reason
}

// Set up the event listeners—finally got this right
function setupListeners() {
  let searchBtn = document.getElementById("searchBtn");
  searchBtn.addEventListener("click", handleSearch);

  let continentBox = document.getElementById("continent");
  continentBox.addEventListener("change", handleFilterChange);

  let compInput = document.getElementById("company");
  compInput.addEventListener("input", handleTextInput);
}

function handleSearch() {
  console.log("Search button clicked, let’s go!");
  filterJobs();
}

function handleFilterChange() {
  console.log("Dropdown changed, filtering...");
  filterJobs();
}

function handleTextInput() {
  console.log("Typing in company field, updating...");
  filterJobs();
}

startLoadingJobs();