console.log('\n***** WELCOME TO RPS-AI *****\n');

const ACTIONS = ['r', 'p', 's']; 
const NAMES = ['Rock', 'Paper', 'Scissors'];
const ACT = ACTIONS.length;
let regret = [0,0,0];
let strategy = [0,0,0];
let scoreP = 0; 
let scoreB = 0;

function getAction(strategy) {
	if (strategy[0] + strategy[1] + strategy[2] != 1) {
		strategy = normalize(strategy);
	}
	const r = Math.random();
	if (r<strategy[0]) { return 0}
	else if (r<strategy[0]+strategy[1]) { return 1}
	else { return 2}
}

function getValue(move, opponentMove) {
	if (move == opponentMove) { return 0; }
	else if ((ACT+move-opponentMove)%ACT==1) { return 1; }
	else { return -1; }
}

function updateRegret(opponentMove, val, r) {
	r[0] += getValue(0, opponentMove) - val;
	r[1] += getValue(1, opponentMove) - val;
	r[2] += getValue(2, opponentMove) - val;
	return r;
}


function playRound(strategy, regret, playerMove) {
	const move = getAction(strategy);
	console.log('RPS-AI chose ' + NAMES[move]);
	const opponentMove = playerMove;
	const moveValue = getValue(move, opponentMove);
	updateResult(moveValue)
	regret = updateRegret(opponentMove, moveValue, regret);
	regretToStrategy(regret);
}

function regretToStrategy(r) {
	let rr = [0,0,0];
	for (let i=0; i<rr.length; i++) {
		rr[i] = Math.max(r[i], 0);
	}
	const rSum = rr[0] + rr[1] + rr[2];
	if (rSum != 0) {
		const rNormal = [rr[0]/rSum, rr[1]/rSum, rr[2]/rSum];
		strategy = normalize(rNormal);
	}
}

function normalize(a) {
	for (let i=0; i<a.length; i++) {
		a[i] = Math.max(a[i], 0);
	}
	let sum = a[0] + a[1] + a[2];
	if (sum == 0) {
		return [1/ACT, 1/ACT, 1/ACT];
	}
	return [a[0]/sum, a[1]/sum, a[2]/sum];
}


// PROMPT 
const defaultText = 'Press to play: [R]ock [P]aper [S]cissors | [C]lear [Q]uit\n';
prompt(defaultText, processInput);

function prompt(question, callback) {
    const stdin = process.stdin;
    stdin.resume();
    console.log(question);
    stdin.once('data', function (data) {
        callback(data.toString().trim());
    });
}

function processInput(input) {
	input = input.toLowerCase();
    if (input == 'q') {
    	console.log('Player quit.');
    	process.exit();
    } else if (input == 'c') {
    	clear(); 
    } else if (input == 'r' || input == 'p' || input == 's') {
    	handlePlay(input);
    } else {
    	console.log('Unknown input: ' + input + '\n')
    }
    prompt(defaultText, processInput);
}

function handlePlay(input) {
	const playerMove = ACTIONS.indexOf(input);
	console.log('Player chose ' + NAMES[playerMove]);
	playRound(strategy, regret, playerMove);
    printResults();
}

function printResults() {
    console.log('>>> RESULTS:');
	console.log('Player: ' + scoreP);
	console.log('RPS-AI: ' + scoreB + '\n');
}

function updateResult(value) {
	if (value == 0) { console.log('((( Draw )))\n')}
	else if (value == 1) { console.log('((( RPS-AI wins )))\n'); scoreB += 1;}
	else if (value == -1) { console.log('((( Player wins )))\n'); scoreP += 1;}
}

function clear() {
	scoreP = 0;
	scoreB = 0;
	strategy = [0,0,0];
	regret = [0,0,0];
    console.log('>>> RESULTS CLEARED\n');
}