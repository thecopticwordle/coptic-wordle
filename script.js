alert("Good news! A new form of Coptic learning is in the works. The word bank will restart for now and will resume once that project is released.");

var target = "";
var input = "";
var letters = [];
//var hints = 0;
var wod;
var test;
var day = 24 * 60 * 60 * 1000
var day0 = 1672549201000-day;

function currentDay() {
  var d = Date.now();
  var day = 24 * 60 * 60 * 1000
  var d1 = d - day0;
  return Math.floor(d1 / day);
};

function word() {
  //wod=await fetch("./data.json");
  fetch("./dataShuffled.json")
    .then(async (data) => {
      return data.json();
    })
    // added for debugging
    .catch((error) => {
      console.error(error)
    })
    .then(async (json) => {
      wod = json;
      test=json;
      wod = json.days[currentDay()];
      console.log(json.days[0]);
      target = wod.word;
      if(cday==currentDay()){
        //alert(cday);
        //alert(currentDay());
        wordCheck()
      } else{
        localStorage.setItem('guesses','')
        guesse="";
        hints=0;
        hintList="";
        cday=currentDay();
      }
      /*if(guesse==undefined||guesse=="undefined"){
        guesse="";
      }*/
      scholarMode();
    })
}
word();

let Board = {
  el: document.querySelector('#board'),
  rows: document.getElementsByClassName('br'),
  currentRow: 1,
  gameOver: false,
  boardList: [],
  won:false,
  addChar: function(c) {
    if (Board.gameOver || input.length >= 5) return;
    else input += c;
    //Board.rows[Board.currentRow]
    // console.log("br"+Board.currentRow+input.length)
    document.getElementById("br" + Board.currentRow + input.length).textContent = c;
  },
  removeChar: function() {
    if (Board.gameOver || input.length == 0) return;
    input = input.substring(0, input.length - 1);
    document.getElementById("br" + Board.currentRow + (input.length + 1)).textContent = '';
  },
  checkRow: function() {
    started=1;
    setCookies();
    if (Board.gameOver || input.length < 5) return; // too few letters
    if (Board.currentRow <= 6) { // check this row
      Board.boardList.push([])
      var colorClass = ''; // color that gets computed & applied for each letter
      var target2 = target.split(''); // clone of target that we remove letters from
      for (var i = 0; i < input.length; i++) { // index of each letter
        //console.log(Board.repLetters);
        if (target2.includes(input[i])) { // if character exists in target2 (& hasnt been matched already)
          target2.splice(target2.indexOf(input[i]), 1) // remove the character from the target2 array
          //if((input.match(/,/g) || []).length); // idk what is this...
          if (target[i] == input[i]) { // if it also matches position
            colorClass = "rightPos"; // classes now instead of colors
            var index = letters.indexOf(input[i]);
            if (index > -1) {
              letters.splice(index, 1);
            }
            Board.boardList[Board.boardList.length - 1].push("🟩");
          } else {
            colorClass = "rightLetter";
            var index = letters.indexOf(input[i]);
            if (index > -1) {
              letters.splice(index, 1);
            }
            Board.boardList[Board.boardList.length - 1].push("🟨");
          }
        } else {
          colorClass = "wrong";
          var index = letters.indexOf(input[i]);
          if (index > -1) {
            letters.splice(index, 1);
          }
          Board.boardList[Board.boardList.length - 1].push("⬛");
        }
        document.getElementById("br" + Board.currentRow + (i + 1)).classList.add(colorClass); // add the class here
        document.getElementById(input[i]).classList.add(colorClass);
      }
      if(!check){
        guesse+=input;
        setCookies();
      }
      if (input == target) { // match? (check after styling)
        Board.gameOver = true;
        if(!check){
          plays++;
          played=1;
          twins++;
          cstr++;
          if(cstr>mstr){
            mstr=cstr;
          }
        }
        setCookies();
        Board.won=true;
        win();
      } else if (Board.currentRow > 5) {
        Board.gameOver = true;
        if(!check){
          plays++;
          played=1;
          if(cstr>mstr){
            mstr=cstr;
          }
          cstr=1;
        }
        setCookies();
        lose(); // game over
      } else{
        input = '';
        Board.currentRow++
      }
    }
  },
  hint: function() {
    if (Board.gameOver || letters.length < 1) return;
    var rn = Math.floor(Math.random() * letters.length);
    Board.checkL(letters[rn]);
    hintList+=(letters[rn]);
    var index = rn;
    if (index > -1) {
      letters.splice(index, 1);
    }
    hints++;
    setCookies(); 
  },
  checkL: function(l){
    if (target.includes(l)) {
      document.getElementById(l).style.background = "gold";
    } else {
      document.getElementById(l).style.background = "#828282";
    }
  }
}

var Results = {
  el: document.getElementById('results'),
  title: document.getElementById('resultsTitle'),
  word: document.getElementById('resultsWord'),
  hint: document.getElementById("hintsUsed"),
  pron: document.getElementById("pron"),
  def: document.getElementById("definition"),
  pos: document.getElementById("partOfSpeech"),
  eEx: document.getElementById("engEx"),
  cEx: document.getElementById("coptEx"),
  source: document.getElementById("source"),
  nPlayed: document.getElementById("numPlay"),
  winPercent: document.getElementById("winPerc"),
  cStreak: document.getElementById("currStr"),
  mStreak: document.getElementById("maxStr"),
  show: function(txt, word) {
      Results.nPlayed.textContent = plays;
      Results.winPercent.textContent = ((twins/plays)*100).toFixed();
      Results.cStreak.textContent = cstr;
      Results.mStreak.textContent = mstr;
    if (Board.gameOver) {
      //special cases for feasts ie. Ressurection
      if(currentDay()==106){Results.title.textContent = "Ⲡⲓⲭ̀ⲣⲓⲥⲧⲟⲥ ⲁϥⲧⲱⲛϥ ⲉⲃⲟⲗ ϧⲉⲛ ⲛⲏⲉⲑⲙⲱⲟⲩⲧ!"}
      else{Results.title.textContent = Board.won?'Great Job!':'Nice Try!';}
      Results.word.innerHTML = `Today's word is: <span class="coptic">${wod.word}</span>`;
      Results.hint.textContent = "Hints Used: "+hints;
      Results.pron.textContent = wod.pronunciation;
      Results.def.textContent = wod.definition;
      Results.pos.textContent = wod.partOfSpeech;
      Results.eEx.innerHTML = wod.exampleEN;
      let cEx = wod.exampleCT;
      cEx=cEx.substring(1,cEx.length-1);
      Results.cEx.innerHTML = `"<span class="coptic">${cEx}</span>"`;
      Results.source.textContent = "Source: " + wod.source;
    } else{
      Results.title.textContent = "Solve Today's Coptic Wordle!";
    }
    setTimeout(() => {
      Results.el.classList.add('active');
    }, 200);
  },
  hide: function() {
    Results.el.classList.remove('active');
    Results.title.textContent = '';
    Results.word.textContent = '';
  },
  share: function() {
    var title = 'Coptic Wordle #' + (currentDay() + 1) + ' - ' + (Board.currentRow + '/6');
    var text = title + '\n';
    for (let r of Board.boardList)
      text += '\n' + r.join('');
    text += "\n\nHints Used: " + hints;
    navigator.share({
      title: title,
      text: text,
      // url: '',
    })
  },
}

var HowToPlay = {
  el: document.getElementById('howToPlay'),
  show: function() {
    setTimeout(() => {
      HowToPlay.el.classList.add('active');
    }, 200);
  },
  hide: function() {
    HowToPlay.el.classList.remove('active');
  },
}

var Settings = {
  el: document.getElementById('settings'),
  show: function() {
    setTimeout(() => {
      Settings.el.classList.add('active');
    }, 200);
  },
  hide: function() {
    Settings.el.classList.remove('active');
  },
}

var onClick = function() {
  Board.addChar(this.textContent);
};

for (var i of document.getElementsByClassName("kbl")) {
  i.addEventListener('click', onClick, false);
  letters.push(i.textContent);
}

function win() {
  //alert('you won! todo');
  Results.show('You got it!', target);
}

function lose() {
  //alert('you lost... todo');
  Results.show('Oh no...', target);
  Board.currentRow = "X";
}

function setTheme(theme){
  document.body.classList.add(theme);
  arr = document.getElementsByClassName("nb");
  for(i=0;i<arr.length;i++){
    arr[i].classList.add(theme);
  }
  arr = document.getElementsByClassName("dbc");
  for(i=0;i<arr.length;i++){
    arr[i].classList.add(theme);
  }
  document.getElementById("title").classList.add(theme);
}

function removeTheme(theme){
  document.body.classList.remove(theme);
  arr = document.getElementsByClassName("nb");
  for(i=0;i<arr.length;i++){
    arr[i].classList.remove(theme);
  }
  arr = document.getElementsByClassName("dbc");
  for(i=0;i<arr.length;i++){
    arr[i].classList.remove(theme);
  }
  document.getElementById("title").classList.remove(theme);
}

function changeTheme(){
  if(!document.getElementById("test").checked){
    setTheme("lightTheme");
    removeTheme("darkTheme");
    thm=0;
    setCookies();
  } else{
    setTheme("darkTheme");
    removeTheme("lightTheme");
    thm=1;
    setCookies();
  }
}

function scholarMode(){
  if(document.getElementById('cs').checked){
    document.getElementById("hint").disabled = true;
    document.getElementById("hint").style.background="grey";
    cs=1;
    setCookies();
  } else{
    document.getElementById("hint").disabled = false;
    document.getElementById("hint").style.background="none";
    cs=0;
    setCookies();
  }
}

//onclick listeners
document.getElementById("back").addEventListener('click', Board.removeChar, false);
document.getElementById("enter").addEventListener('click', Board.checkRow, false);
document.getElementById("hint").addEventListener('click', Board.hint, false);
document.getElementById("share").addEventListener('click', Results.share, false);
document.getElementById("close").addEventListener('click', Results.hide, false);
document.getElementById("close2").addEventListener('click', HowToPlay.hide, false);
document.getElementById("close3").addEventListener('click', Settings.hide, false);
document.getElementById("q").addEventListener('click', HowToPlay.show, false);
document.getElementById("settingsB").addEventListener('click', Settings.show, false);
document.getElementById("statB").addEventListener('click', () => Results.show("Solve Today's Coptic Wordle!", "?"), false);
document.getElementById("test").addEventListener('change', () => changeTheme(), false);
document.getElementById("cs").addEventListener('change', () => scholarMode(), false);


//COOKIES!!
//Decoding the string:
//first number: total plays
//second number: current day played (0/1)
//Third number: total wins
//Fourth number: current streak
//Fifth number: total hints used
//Sixth number: theme (0=light, 1=dark)
//Seventh number: has the current puzzle been started? (0/1)
//Eighth number: max streak
//Ninth number: current day
//Tenth number: coptic scholar mode (0=no, 1=yes)
if(!localStorage.getItem("data")){
  // document.cookie = "data=0-0-0-0-0-0-0-0; expires=Thu, 26 Dec 2030 12:00:00 UTC; path=/";
  // document.cookie = "guesses=; expires=Thu, 26 Dec 2030 12:00:00 UTC; path=/";
  localStorage.setItem('data','0-0-0-0-0-0-0-0-0-0');
  localStorage.setItem('guesses','');
  localStorage.setItem('hints', '');
  HowToPlay.show();
  setTheme("lightTheme");
}
if(!localStorage.getItem("hints")){
  localStorage.setItem('hints', '');
}
// alert(document.cookie);
//alert(localStorage.getItem('guesses'));
var plays; //
var played; //
var twins; //
var cstr; //
var hints; //
var thm;
var started; //
var mstr; //
var cday;
var cs;
var arr=[];
// var x = document.cookie;
// x = x.split(" ");
// console.log(x);
// if(x[0].includes("data")){
//   x=x[0].substring(5, x[0].length-1);
// } else{
//   console.log(x);
//   x=x[1].substring(5);
// }
// arr=x.split("-");
arr = localStorage.getItem("data").split("-");
if(arr.length<=9){
  alert("Please clear your cookies!");
}
plays=arr[0];
played=arr[1];
twins=arr[2];
cstr=arr[3];
hints=arr[4];
thm=arr[5];
started=arr[6];
mstr=arr[7];
cday=arr[8];
cs=arr[9];
if(cday==0||cday==null||cday==undefined){
  cday=currentDay();
}
if(thm==1){
  setTheme("darkTheme");
  document.getElementById('test').checked=true;
} else{
  setTheme("lightTheme");
}
if(cs==1){
  document.getElementById("cs").checked=true;
}


var hintList=localStorage.getItem('hints');

var guesse;
var check;

function wordCheck(){
  check=false;
  guesse=localStorage.getItem("guesses")//document.cookie.split(" ");
  // if(guesse[1].includes("guesses")){
  //   guesse=guesse[1].substring(8);
  // } else{
  //   if(guesse[0].substring(0,1)=="g"){
  //     guesse=guesse[0].substring(8, guesse[0].length-1);
  //   } else{
  //     guesse=guesse[0].substring(0, guesse[0].length-1);
  //   }
  // }
  if(guesse != ''){
    //check rows for each guess
    var a=guesse.match(/.{1,5}/g);
    for(i=0;i<a.length;i++){
      check=true;
      input=a[i]
      for(j=0;j<input.length;j++){
        document.getElementById("br"+Board.currentRow+(j+1)).textContent=a[i][j];
      }
      Board.checkRow();
    }
    check=false;
  }
  for(i=k=0;k<hintList.length;k++){
    Board.checkL(hintList.substring(k,k+1));
  }
}

function setCookies(){
  // document.cookie="guesses="+guesse+";";
  // document.cookie="data="+plays+"-"+played+"-"+twins+"-"+cstr+"-"+thints+"-"+thm+"-"+started+"-"+mstr+";";
  //alert(guesse);
  localStorage.setItem('data',plays+"-"+played+"-"+twins+"-"+cstr+"-"+hints+"-"+thm+"-"+started+"-"+mstr+"-"+cday+'-'+cs);
  localStorage.setItem('guesses',guesse);
  localStorage.setItem('hints', hintList);
}