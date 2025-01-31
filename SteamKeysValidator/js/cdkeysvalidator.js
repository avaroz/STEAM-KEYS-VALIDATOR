// @author avarozdev <http://nezosgames.com>
// github: https://github.com/tomasfjm/STEAM-KEYS-VALIDATOR
var keystext;
var independentkeys;
var cont1 = 0, cont2 = 0;
var run1, run2;
var activatedkeys = 0, keysnotactivated = 0;

chrome.runtime.onMessage.addListener(function(request, sender) {
  if (request.action == "getSource") {
    document.getElementById("codigohtmlfull").innerText = request.source;
  }
});

function pulsardor() {
  //Preload web fix error: There was an error injecting script  The extensions gallery cannot be scripted
  keystext = document.getElementById("keyslist").value;
  independentkeys = keystext.split("\n");
  alert("The keys will be validated, but keep in mind:\n" +
    "\n"+
    "1. You must be logged in https://partner.steamgames.com\n" +
    "2. Use english language on steam partner.\n" +
    "3. Start in url tab https://partner.steamgames.com/querycdkey/.\n" +
    "4. You must have a good internet for pages to load fast.\n" +
    "5. Make small validations of 500 to 1000 keys maximum (if the window closes you will thank me).\n" +
    "6. It is possible that not all results are correct.\n" +
    "6. The first checks may fail. ಥ_ಥ.\n" +
    "7. You can help improve the code on github. (￣y▽,￣)╭ ");

  //go
  cont1 = 0;
  cont2 = 0;
  activatedkeys = 0;
  keysnotactivated = 0;

  run1 = setInterval(desencadenador, 4000);
  run2 = setInterval(desencadenador2, 4100);
  document.getElementById("click-this").style.display = "none";
  document.getElementById("keyslist").style.display = "none";
  document.getElementById("keyslist").disabled = true;
}

document.addEventListener('DOMContentLoaded', function() {
  document.getElementById("click-this").addEventListener("click", pulsardor);
});

function desencadenador() {
  if (cont1 < independentkeys.length) {
    console.log("Validating the key: " + independentkeys[cont1]);
    opentab(independentkeys[cont1]);
    cont1++;
  } else {
    clearInterval(run1);
  }
}

function desencadenador2() {
  if (cont2 < independentkeys.length) {
    cont2++;
    document.getElementById("titlevalidar").innerHTML = "Validating <b>(" + cont2 + "/" + independentkeys.length + ")</b>";
    onWindowLoad();
  } else {
    clearInterval(run2);
    document.getElementById("click-this").style.display = "inline-block";
    document.getElementById("keyslist").style.display = "block";
    document.getElementById("keyslist").disabled = false;
    document.getElementById("titlevalidar").innerHTML = "Were validated <b>(" + independentkeys.length + ") Keys</b>";
    downloadKeys(keysnotactivated, "textunusedkeys", 'UnusedKey');
    downloadKeys(activatedkeys, "keysusedtext", 'Usedkey');
    document.getElementById("keyslist").value = "";
  }
}

function onWindowLoad() {
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    var tabId = tabs[0].id;
    chrome.scripting.executeScript({
      target: {tabId: tabId},
      files: ["js/getPagesSource.js"]
    }, function() {
      verifykey();
      if (chrome.runtime.lastError) {
        document.getElementById("codigohtmlfull").innerText = 'There was an error injecting script : \n' + chrome.runtime.lastError.message;
      }
    });
  });
}

function verifykey() {
  var keywords = ["e24044Not"];
  var ejemplo = "codigohtml:" + document.getElementById("codigohtmlfull").value;
  ejemplo = ejemplo.replace(/[&\/\\#,+()$~%.'":*?<>{}]/g, '');
  var outcome = "";
  var pos = -1;
  console.log(ejemplo);
  keywords.forEach(function(element) {
    pos = ejemplo.search(element.toString());
    if (pos !== -1) {
      outcome += "the key is not activated";
      keysnotactivated++;
      document.getElementById("titlenoactivadas").innerHTML = "Unused Key: <b>(" + keysnotactivated + ")</b>";
      document.getElementById("message").innerHTML = "<i class='far fa-smile'></i> Unused Key: " + independentkeys[cont1 - 1];
      document.getElementById("message").style.color = "#00262d";
      document.getElementById("message").style.background = "#02ffc4";
      document.getElementById("message").style.border = "1px solid #02ffc4";
      document.getElementById("textunusedkeys").innerHTML += independentkeys[cont1 - 1] + "\n";
    }
  });
  if (pos === -1 && outcome === "") {
    outcome = "The key is activated";
    activatedkeys++;
    document.getElementById("titleactivadas").innerHTML = "Used key: <b>(" + activatedkeys + ")</b>";
    document.getElementById("message").innerHTML = "<i class='far fa-sad-cry'></i> Used key: " + independentkeys[cont1 - 1];
    document.getElementById("message").style.color = "#ffffff";
    document.getElementById("message").style.background = "#ff2846";
    document.getElementById("message").style.border = "1px solid #ff2846";
    document.getElementById("keysusedtext").innerHTML += independentkeys[cont1 - 1] + "\n";
  }
  console.log(outcome);
}

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

function downloadKeys(numkeys, idtextarea, titledo) {
  document.getElementById("message").innerHTML = "VALIDATION COMPLETE!";
  document.getElementById("message").style.color = "#00fac5";
  document.getElementById("message").style.background = "#00262d";
  document.getElementById("message").style.border = "1px solid #00fac5";

  var element = document.createElement('a');
  element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(document.getElementById(idtextarea).value));
  element.setAttribute('download', 'Steam' + titledo + '_num' + numkeys);
  element.style.display = 'none';
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
}
