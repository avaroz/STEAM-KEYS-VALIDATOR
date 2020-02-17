// @author avarozdev <http://nezosgames.com>
// github: https://github.com/tomasfjm/STEAM-KEYS-VALIDATOR

var keystext;
var independentkeys;
var cont1 = 0,cont2 = 0;
var run1, run2;
var activatedkeys = 0,keysnotactivated = 0;

chrome.runtime.onMessage.addListener(function(request, sender) {
  if (request.action == "getSource") {
    codigohtmlfull.innerText = request.source;
  }
});

function pulsardor() {
  keystext = document.getElementById("keyslist").value;
  independentkeys = keystext.split("\n");
    alert("The keys will be validated, but keep in mind:\n" +
      "\n"+
      "1. You must be logged in https://partner.steamgames.com\n" +
      "2. Start in a clean tab.\n" +
      "3. You must have a good internet for pages to load fast.\n" +
      "4. It is possible that not all results are correct.\n" +
      "5. You can help improve the code on github.");

    run1 = setInterval(desencadenador, 3000);
    run2 = setInterval(desencadenador2, 3100);
    document.getElementById("click-this").style.display = "none";
    document.getElementById("keyslist").style.display = "none";
    document.getElementById("keyslist").disabled = true;
}
document.addEventListener('DOMContentLoaded', function() {
  document.getElementById("click-this").addEventListener("click", pulsardor);
});

function desencadenador() {
  console.log("Validating the key: " + independentkeys[cont1]);
  opentab(independentkeys[cont1]);
  cont1++;

  if (cont1 == independentkeys.length) clearInterval(run1);
}

function desencadenador2() {
  cont2++;
  document.getElementById("titlevalidar").innerHTML = "Validating <b>(" + cont2 + "/" + independentkeys.length + ")</b>";
  onWindowLoad();
  if (cont2 == independentkeys.length+1) {
    document.getElementById("click-this").style.display = "inline-block";
    document.getElementById("keyslist").style.display = "block";
    document.getElementById("keyslist").disabled = false;
    document.getElementById("titlevalidar").innerHTML = "Were validated <b>(" + independentkeys.length + ") Keys</b>";
    downloadKeys(keysnotactivated,"textunusedkeys",'UnusedKey');
    downloadKeys(activatedkeys,"keysusedtext",'Usedkey');
    document.getElementById("keyslist").value = "";
    clearInterval(run2);
  };
}

function onWindowLoad() {

  var codigohtmlfull = document.querySelector('#codigohtmlfull');

  chrome.tabs.executeScript(null, {
    file: "js/getPagesSource.js"
  }, function() {
    verifykey();
    // If you try and inject into an extensions page or the webstore/NTP you'll get an error
    if (chrome.runtime.lastError) {
      codigohtmlfull.innerText = 'There was an error injecting script : \n' + chrome.runtime.lastError.message;
    }
  });

}
//window.onload = onWindowLoad;
function verifykey() {
  var keywords = ["e24044No"];
  var ejemplo = "codigohtml:" + document.getElementById("codigohtmlfull").value;
  var ejemplo = ejemplo.replace(/[&\/\\#,+()$~%.'":*?<>{}]/g, '');
  var outcome = "";
  var pos = -1
  keywords.forEach(function(element) {// use foreach to cycle through each element of the array
    pos = ejemplo.search(element.toString()); // If it exists, the position is assigned after
    if (pos != -1) {
      outcome += "the key is not activated";
      keysnotactivated++;
      document.getElementById("titlenoactivadas").innerHTML = "Unused Key: <b>(" + keysnotactivated + ")</b>";
      document.getElementById("message").innerHTML = "<i class='far fa-smile'></i> Unused Key: " + independentkeys[cont1 - 1];
      document.getElementById("message").style.color = "#28a745";
      document.getElementById("textunusedkeys").innerHTML = document.getElementById("textunusedkeys").value + independentkeys[cont1 - 1] + "\n";
    }
  });
  if (pos === -1 && outcome === "") {
    outcome = "The key is activated";
    activatedkeys++;
    document.getElementById("titleactivadas").innerHTML = "Used key: <b>(" + activatedkeys + ")</b>";
    document.getElementById("message").innerHTML = "<i class='far fa-sad-cry'></i> Used key: " + independentkeys[cont1 - 1];
    document.getElementById("message").style.color = "rgb(255, 40, 70)";
    document.getElementById("keysusedtext").innerHTML = document.getElementById("keysusedtext").value + independentkeys[cont1 - 1] + "\n";
  }
  console.log(outcome);
}

//Open a link in the same tab
function opentab(urlir) {
  chrome.tabs.query({
    active: true,
    currentWindow: true
  }, function(tabs) {
    var tab = tabs[0];
    chrome.tabs.update(tab.id, {
      url: 'https://partner.steamgames.com/querycdkey/cdkey?cdkey=' + urlir + '&method=Verificar'
    });
  });
}

function downloadKeys(numkeys,idtextarea,titledo) {
  var element = document.createElement('a');
  element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(document.getElementById(idtextarea).value));
  element.setAttribute('download', 'Steam'+titledo+'_num'+ numkeys);
  element.style.display = 'none';
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
}
