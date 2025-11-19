import * as texts from "./texts.js";
import { items } from "./items.js";
import { monsters } from "./monsters.js";

  let health = 10; // Start health in topbar
  let maxhealth = 10; // Max HP at start, not shown in topbar. Gets higher with LVL see fight()
  let howMuchHP = 0;
  let level = 1; // Start exp in topbar
  let exp = 0; // Start exp in topbar
  let gold = 0; // Start gold in topbar
  let monsterIndex = null;

function changeText(text) {
  if (text == "wildlands") {
    let bild = "images/wildlands.jpg";
    document.getElementById("contentTextLeft").innerHTML = `<p>${texts.wildlandsText}</p>`; // <button onclick="fight()">Fight</button>
    document.getElementById("contentTextLeft2").innerHTML = ""; //hides the shop items, need to change this when I have created what needs to be shown here for this view
    document.getElementById("contentTextRight").innerHTML = `<img src="${bild}" alt="Image">`;
    showFight();
  } else if (text == "market") {
    let bild = "images/market.jpg";
    document.getElementById("contentTextLeft").innerHTML = `<p>${texts.marketText}</p>`;
    showShop(); // Shows the shop items listed in items.js
    document.getElementById("contentTextRight").innerHTML = `<img src="${bild}" alt="Image">`;
  } else if (text == "quest"){
    let bild = "images/quest.jpg";
    document.getElementById("contentTextLeft").innerHTML = `<p>${texts.questText}</p>`;
    document.getElementById("contentTextLeft2").innerHTML = ""; //hides the shop items, need to change this when I have created what needs to be shown here for this view
    document.getElementById("contentTextRight").innerHTML = `<img src="${bild}" alt="Image">`;
  }
  else {
    alert('No bueno, no value in string from menu');
  }
}

function fight() { // The function that handles fights
//let monster = monsters[Math.floor(Math.random() * monsters.length)];
let monster = monsters[monsterIndex];
let success = Math.random() * 20;
let goldAmount = Math.floor(Math.random() * 4) + 1; //+ 1 makes it 1-4

  if (success >= monster.ac) {
    monster.hp -= 1; // decrease monster HP
    if (monster.hp >= 1) {
      showAlert(`You hit the ${monster.name}!`, "green");
      document.getElementById("monsterHp").textContent = `HP: ${monster.hp}`;
      updateInfoBar()
    } else {
      if (exp >= 9) { // Raises level with +1 if player has enough EXP
        gold += goldAmount
        exp = 0;
        level ++;
        howMuchHP = Math.floor(Math.random() * 5) + 1; // Calculates how much maxhealth should be raised with
        maxhealth += howMuchHP; // Adds together the new maxhealth after level up
        health = maxhealth; // Updates maxhealth to new value
        showAlert(`You won. After all your battles you feel stronger and more experienced. You gained one level, looted ${goldAmount} gold and gained ${howMuchHP} max HP.`, "green");
        document.getElementById("monsterHp").textContent = `HP: ${monster.hp}`;
        updateInfoBar()
        document.getElementById("attackButton").disabled = true;
      } else {
        gold += goldAmount
        showAlert(`You won. Gained 1 EXP and looted ${goldAmount} gold.`, "green");
        exp ++;
        updateInfoBar()
        document.getElementById("monsterHp").textContent = `HP: ${monster.hp}`;
        document.getElementById("attackButton").disabled = true;
      }
    }
  } else {
    if (health <= 1) { // If player have 1hp and lose a battle = killed
      showAlert('You died :(');
      health --;
      updateInfoBar()
    } else {
      showAlert(`You got hit my the ${monster.name} and took some damage.`, "orange");
      health --;
      updateInfoBar()
    }
  }
}

function updateInfoBar() { // The function that updates infobar
  document.getElementById("level").textContent = level;
  document.getElementById("exp").textContent = exp;
  document.getElementById("expBar").value = exp;
  document.getElementById("health").textContent = health;
  document.getElementById("healthBar").value = health;
  document.getElementById("healthBar").max = maxhealth;
  document.getElementById("gold").textContent = gold;
}

function showAlert(message, type = "red") {
  // Create the alert div
  const alertDiv = document.createElement("div");
  alertDiv.classList.add("alert");
  alertDiv.style.backgroundColor = type; // you can pass other colors too

  // Create the close button
  const closeBtn = document.createElement("span");
  closeBtn.classList.add("closebtn");
  closeBtn.innerHTML = "&times;";
  closeBtn.onclick = () => alertDiv.remove(); // remove alert when clicked

  // Add the message
  alertDiv.textContent = message;
  alertDiv.appendChild(closeBtn);

  // Append to alert container
  const container = document.getElementById("alertContainer");
  container.appendChild(alertDiv);

  // Optional: auto-hide after 5 seconds
  setTimeout(() => {
    alertDiv.remove();
  }, 5000);
}

// The code for item shop that is showcased on /market
function showShop() {
  const parent = document.getElementById("contentTextLeft2");

  // Convert each item to HTML text
  const html = items.map(item => `
    <div class="shopItem">
      <p><b>${item.name}</b><br>${item.price}</p>
      <p>${item.description}</p>
      <button onclick="buyItem('${item.name}', ${item.price}, '${item.notification}', ${item.usable}, '${item.type}', ${item.amount})">Buy</button>
    </div>
  `).join('');

  parent.innerHTML = html;
}

// The code for monster fight that is showcased on /wildlands
function showFight() {
  const parent = document.getElementById("contentTextLeft2");

  // Pick one random monster and store it in the global variable
  monsterIndex = Math.floor(Math.random() * monsters.length);
  const monster = monsters[monsterIndex];

  // Build HTML for that one monster
  const html = `
    <div class="monsterEntry">
      <img src="${monster.img}" alt="${monster.name}" class="monsterImg">
      <p><b>${monster.name}</b></p>
      <p id="monsterHp">HP: ${monster.hp}</p>
      <p>AC: ${monster.ac}</p>
    </div>
    <div class="buttonDiv">
      <button id="attackButton" onclick="fight()">Attack</button>
      <button id="newMonsterButton" onclick="changeText('wildlands')">New Monster</button>
    </div>
  `;

  parent.innerHTML = html;
}

function buyItem(item, price, notification, usable, type, amount) {

  if (gold >= price) {  // check if enough gold
    gold -= price;      // deduct gold
    updateInfoBar();    // update gold display immediately

    if (usable) {
      if (type === "health") {
        heal(type, amount, notification); // call heal
      } else {
        showAlert('No bueno');
      }
    } 
    // Maybe add something here for items that aren't usable? Equipment? Inventory?
  } else {
    showAlert(`You don't have enough gold`);
  }
}

function heal(type, amount, notification) {
  if (type === "health") {
    health += amount;               // add health
    if (health > maxhealth) health = maxhealth; // cap at max
    updateInfoBar();                // refresh topbar
    showAlert(notification, "green"); // show alert
  }
}

window.changeText = changeText;
window.fight = fight;
window.showAlert = showAlert;
window.showShop = showShop;
window.showFight = showFight;
window.buyItem = buyItem;