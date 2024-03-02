/**
 * Gesamtpunktzahl
 *
 * @var number
 */
var score = 0;
var bisSechsScore = 0;
/**
 * Anzahl der getätigten Würfe in dieser Runde
 *
 * @var number
 */
var wurfenUbrig = 3;
var assigned = 0;

/**
 * Alle aktuellen Würfelwerte
 *
 * @var array
 */
var values = [];
var combiCells = [];
var combiCellsInitialized = false;

/**
 * Alle Würfel werfen
 *
 * @return void
 */
function rollDices() {
	// Alle HTML Elemente mit der CSS Klasse "dice" ermitteln
	var dices = document.querySelectorAll('.dice');
	var combis = document.querySelectorAll('.combi');

	if(combiCellsInitialized == false){
		let combiNodes = document.querySelectorAll(".punktefelder td.combi");

		for(let i = 0; i < combiNodes.length; i++){
			combiCells[i] = combiNodes[i].parentNode.classList[0];
		}

		combiCellsInitialized = true;
	}

	dices.forEach(dice => {
		dice.classList.remove('disabled');
	});
	combis.forEach(combi => {
		if(!combi.textContent){
			combi.classList.remove('disabled');
		}
	})

	// Die aktuellen Würfelwerte zurücksetzen
	values = [];

	for (var i = 0; i < dices.length; i++) {
		// @TODO Würfel nicht würfeln, wenn dieser gehalten wird
		if(!dices[i].getAttribute("data-hold")){
			dices[i].value = Math.floor((Math.random() * 6) + 1);
		}

		// Aktuellen Würfelwert merken
		var value = parseInt(dices[i].value);
		values.push(value);
	}
	values.sort();

	for(let i = 0; i < values.length; i++){
		console.log(i + ' - ' + values[i]);
	}

	// Anzahl der getätigten Würfe erhöhen
	wurfenUbrig--;
	document.querySelector(".wurfenUbrig").textContent = 'Noch: ' + wurfenUbrig;
	if(wurfenUbrig < 0){
		let cellRowName = combiCells[Math.floor((Math.random() * combiCells.length))];
		let cellNode = document.querySelector("." + cellRowName + " td");
		cellNode.click();
	}
}

function saveDices(type) {
	var dices = document.querySelectorAll('.dice');
	var combi;
	var savedCell;
	switch(type){
		case 1:
			combi = 'einser';
			break;
		case 2:
			combi = 'zweier';
			break;
		case 3:
			combi = 'dreier';
			break;
		case 4:
			combi = 'vierer';
			break;
		case 5:
			combi = 'funfer';
			break;
		case 6:
			combi = 'sechser';
			break;
		default:
			combi = type;
	}

	savedCell = document.querySelector(".punktefelder ." + combi + " .savedDices");

	savedCell.textContent = '';
	for(let i = 0; i < dices.length; i++){
		savedCell.textContent += (dices[i].value + ' ');
	}
}

/**
 * Würfel einem Feld zuweisen
 *
 * @param HTMLElement field
 * @param mixed type
 * @return void
 */
function assignDices(field, type) {
	// @TODO Verhindern Sie, dass die Würfel einem Feld mehr als einmal zugewiesen werden können
	field.classList.add("disabled");

	combiCells = combiCells.filter(el => el != field.parentNode.classList[0]);

	// Die zu vergebenden Punkte
	var points = 0;

	// Punkte berechnen
	switch (type) {
		// Einser bis Sechser @TODO Erweitern Sie, damit auch Dreier, Vierer, Fünfer und Sechser berechnet werden
		case 1:
		case 2:
		case 3:
		case 4:
		case 5:
		case 6:
			points = getEinserBisSechser(type);
			bisSechsScore += points;
			break;

		case 'dreierpasch':
			points = getPasch(3);
			break;

		case 'viererpasch':
			points = getPasch(4);
			break;

		case 'fullhouse':
			points = Fullhouse();
			break;

		case 'kleineStrasse':
			points = KleineStrasse();
			break;

		case 'grosseStrasse':
			points = GrosseStrasse();
			break;

		case 'kniffel':
			points = Kniffel();
			break;	

		case 'chance':
			points = Chance();
			break;
	}

	if(bisSechsScore >= 63){
		score += 35;
	}

	// Punkte zuweisen
	field.innerHTML = points;

	// Gesamtpunktzahl erhöhen und in das HTML Element mit der ID score schreiben
	score += points;

	document.getElementById('score').innerHTML = score;

	assigned++;
	if(assigned == 13){
		alert("YOU WON!!! Your score is: " + score);
	}

	if(confirm("Do you want to save the five dice?")){
		saveDices(type);
	}

	// Runde zurücksetzen
	resetRound();
}

/**
 * Einser bis Sechser berechnen
 *
 * @param number num
 * @return number
 */
function getEinserBisSechser(num) {
	var points = 0;

	for (var i = 0; i < values.length; i++) {
		if (values[i] == num) {
			points += num;
		}
	}

	return points;
}

/**
 * Pasch berechnen
 *
 * @param number num
 * @return number
 */
function getPasch(num) {
	var points = 0;

	// @TODO Berechnen Sie einen Dreier- und Viererpasch
	var matches = [0, 0, 0, 0, 0, 0]
	
	for (let i = 0; i < values.length; i++) {
		matches[values[i].value - 1]++;
		if(matches[values[i].value - 1] == num){
			points = values[i].value * num;
		}
	}

	return points;
}

function Fullhouse(){
	var points = 0;

	if((values[0] == values[1] && values[2] == values[4])
		|| (values[0] == values[2] && values[3] == values[4])){
		points += 25;
	}
	
	return points;
}

function KleineStrasse(){
	var points = 0;

	if((values[1] - values[0] == 1 && values[2] - values[1] && values[3] - values[2] == 1)
		|| (values[2] - values[1] == 1 && values[3] - values[2] == 1 && values[4] - values[3] == 1)){
		points += 30;
	}

	return points;
}

function GrosseStrasse(){
	var points = 0;

	if(values[1] - values[0] == 1 && values[2] - values[1] && values[3] - values[2] == 1 && values[4] - values[3] == 1){
		points += 40;
	}

	return points;
}

function Kniffel(){
	var points = 0;

	if(values[0] == values[4]){
		points += 50;
	}

	return points;
}

function Chance(){
	var points = 0;

	values.forEach(el => points += el);

	return points;
}

/**
 * Diese Runde zurücksetzen
 *
 * @return void
 */
function resetRound() {
	var dices = document.querySelectorAll('.dice');
	var combis = document.querySelectorAll('.combi');

	for (var i = 0; i < dices.length; i++) {
		// Alle Würfel loslassen
		dices[i].removeAttribute('data-hold');

		// Alle Würfelwerte zurücksetzen
		dices[i].value = 0;
	}

	dices.forEach(dice => {
		dice.classList.add('disabled');
	});
	combis.forEach(combi => {
			combi.classList.add('disabled');
	});

	// Alle gemerkten Würfelwerte zurücksetzen
	values = [];

	// @TODO Setzen Sie die Anzahl der getätigten Würfe zurück
	wurfenUbrig = 3;
	document.querySelector(".wurfenUbrig").textContent = 'Noch: ' + wurfenUbrig;
}

/**
 * Würfel halten oder loslassen
 *
 * @param HTMLElement dice
 * @return void
 */
function toggleDice(dice) {
	// @TODO Verhindern Sie, dass die Würfel gehalten oder losgelassen werden können, bevor mindestens einmal gewürfelt wurde

	if (dice.getAttribute('data-hold')) {
		// Das HTML Attribut "data-hold" existiert bereits und wird entfernt
		dice.removeAttribute('data-hold');
	} else {
		// Das HTML Attribut "data-hold" existiert noch nicht und wird gesetzt
		dice.setAttribute('data-hold', 1);
	}

	// Fokus auf diesen Würfel entfernen
	dice.blur();
}