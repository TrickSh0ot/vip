"use strict";
/* Resolution VIP: painel de referência e ajustes locais. */
const STORAGE_KEY="resolutioner_santx_v3";
const ACTIVATION_DURATION=900;
const DEVICES=[
 ["iPhone X",1125,2436],["iPhone XS",1125,2436],["iPhone XS Max",1242,2688],["iPhone XR",828,1792],
 ["iPhone 11",828,1792],["iPhone 11 Pro",1125,2436],["iPhone 11 Pro Max",1242,2688],
 ["iPhone 12 mini",1080,2340],["iPhone 12",1170,2532],["iPhone 12 Pro",1170,2532],["iPhone 12 Pro Max",1284,2778],
 ["iPhone 13 mini",1080,2340],["iPhone 13",1170,2532],["iPhone 13 Pro",1170,2532],["iPhone 13 Pro Max",1284,2778],
 ["iPhone 14",1170,2532],["iPhone 14 Plus",1284,2778],["iPhone 14 Pro",1179,2556],["iPhone 14 Pro Max",1290,2796],
 ["iPhone 15",1179,2556],["iPhone 15 Plus",1290,2796],["iPhone 15 Pro",1179,2556],["iPhone 15 Pro Max",1290,2796],
 ["iPhone 16e",1170,2532],["iPhone 16",1179,2556],["iPhone 16 Plus",1290,2796],["iPhone 16 Pro",1206,2622],["iPhone 16 Pro Max",1320,2868],
 ["iPhone 17",1206,2622],["iPhone Air",1260,2736],["iPhone 17 Pro",1206,2622],["iPhone 17 Pro Max",1320,2868]
];
const PROFILES={
 lateral:{name:"LATERAL FORTE",x:90,y:32},
 antipinar:{name:"ANTI PINAR",x:76,y:26},
 equilibrada:{name:"EQUILIBRADA",x:64,y:64},
 subida:{name:"SUBIDA FORTE",x:40,y:92}
};
const MODES={alta:{name:"Alta",factor:1},media:{name:"Média",factor:.9},baixa:{name:"Baixa",factor:.8},custom:{name:"Personalizada",factor:null}};
const $=id=>document.getElementById(id);
const iphone=$("iphone"),widthInput=$("width"),heightInput=$("height"),horizontal=$("horizontalRange"),vertical=$("verticalRange");
const state={device:"iPhone 15 Pro",orientation:"landscape",mode:"custom",profile:"lateral",x:90,y:32,saved:null};
let activating=false;
const clamp=(n,min,max)=>Math.max(min,Math.min(max,n));
const even=n=>Math.round(n/2)*2;
const formatNumber=n=>Number(n).toLocaleString("pt-BR");
const formatDecimal=(n,digits)=>Number(n).toLocaleString("pt-BR",{minimumFractionDigits:digits,maximumFractionDigits:digits});
function readSaved(){try{return JSON.parse(localStorage.getItem(STORAGE_KEY)||"null")}catch{return null}}
function writeSaved(data){try{localStorage.setItem(STORAGE_KEY,JSON.stringify(data));return true}catch{return false}}
function deviceData(){return DEVICES.find(d=>d[0]===state.device)||DEVICES[0]}
function nativeSize(){const d=deviceData();return state.orientation==="landscape"?[d[2],d[1]]:[d[1],d[2]]}
function resolutionValid(w,h){return Number.isInteger(w)&&Number.isInteger(h)&&w>=320&&w<=5000&&h>=320&&h<=5000}
function currentResolution(){if(!widthInput.value.trim()||!heightInput.value.trim())return null;const w=Number(widthInput.value),h=Number(heightInput.value);return resolutionValid(w,h)?[w,h]:null}
function setResolution(w,h){widthInput.value=w;heightInput.value=h}
/* Converte os valores X/Y em duas escalas independentes para as dimensões de referência. */
function scaleFromControl(value){return .75+Number(value)/100*.25}
function applyAxisResolution(){const native=nativeSize();setResolution(clamp(even(native[0]*scaleFromControl(state.x)),320,5000),clamp(even(native[1]*scaleFromControl(state.y)),320,5000));state.mode="custom";render()}
function modeResolution(mode){const native=nativeSize(),factor=MODES[mode].factor;return factor===1?native:[even(native[0]*factor),even(native[1]*factor)]}
function chooseMode(mode){state.mode=mode;if(mode!=="custom"){const dims=modeResolution(mode);setResolution(dims[0],dims[1]);const value=clamp(Math.round((MODES[mode].factor-.75)/.25*100),0,100);state.x=value;state.y=value;state.profile=""}render()}
function chooseProfile(profile){const data=PROFILES[profile];if(!data)return;state.profile=profile;state.x=data.x;state.y=data.y;applyAxisResolution()}
function axesStyle(){if(state.profile&&PROFILES[state.profile])return PROFILES[state.profile].name;if(Math.abs(state.x-state.y)<=10)return "EQUILIBRADO";return state.x>state.y?"FOCO LATERAL":"FOCO VERTICAL"}

/* Restauração: mesmas chaves da versão anterior, para não perder ajustes de clientes. */
const stored=readSaved();
if(stored&&DEVICES.some(d=>d[0]===stored.device)&&resolutionValid(stored.width,stored.height)){
 state.device=stored.device;state.orientation=stored.orientation==="portrait"?"portrait":"landscape";
 state.mode=Object.prototype.hasOwnProperty.call(MODES,stored.mode)?stored.mode:"custom";
 if(Number.isFinite(Number(stored.x))&&Number.isFinite(Number(stored.y))){state.x=clamp(Number(stored.x),0,100);state.y=clamp(Number(stored.y),0,100)}
 state.profile=PROFILES[stored.profile]?stored.profile:"";state.saved=stored;
}
DEVICES.forEach(device=>iphone.add(new Option(device[0],device[0])));
iphone.value=state.device;
horizontal.value=state.x;vertical.value=state.y;
if(state.saved)setResolution(stored.width,stored.height);else applyAxisResolution();

function updateSlider(input){input.style.setProperty("--value",input.value+"%")}
function savedMatches(dims){const s=state.saved;return Boolean(s&&dims&&s.device===state.device&&s.orientation===state.orientation&&s.width===dims[0]&&s.height===dims[1]&&s.x===state.x&&s.y===state.y&&s.mode===state.mode)}
function render(){
 const native=nativeSize(),dims=currentResolution();
 $("nativeSize").textContent=native[0]+" × "+native[1];
 $("orientationText").textContent=state.orientation==="landscape"?"HORIZONTAL":"VERTICAL";
 horizontal.value=state.x;vertical.value=state.y;updateSlider(horizontal);updateSlider(vertical);
 $("horizontalValue").textContent=state.x;$("verticalValue").textContent=state.y;$("styleLabel").textContent=axesStyle();
 document.querySelectorAll(".preset").forEach(button=>{const active=button.dataset.mode===state.mode;button.classList.toggle("active",active);button.setAttribute("aria-pressed",String(active))});
 document.querySelectorAll(".quick").forEach(button=>{const active=button.dataset.profile===state.profile;button.classList.toggle("active",active);button.setAttribute("aria-pressed",String(active))});
 const hints={alta:"Referência em 100% das dimensões do seu iPhone.",media:"Referência em 90% das dimensões do seu iPhone.",baixa:"Referência em 80% das dimensões do seu iPhone.",custom:"Edite largura e altura ou use os controles de sensi para criar sua resolução."};
 $("resolutionHint").textContent=hints[state.mode];
 $("aspectRatio").textContent=dims?formatDecimal(dims[0]/dims[1],2)+":1":"—";
 $("megapixels").textContent=dims?formatDecimal(dims[0]*dims[1]/1e6,2)+" MP":"—";
 $("totalPixels").textContent=dims?formatNumber(dims[0]*dims[1]):"—";
 $("finalResolution").textContent=dims?dims[0]+" × "+dims[1]:"— × —";
 $("finalDevice").textContent=state.device+" • "+MODES[state.mode].name;
 $("finalHorizontal").textContent=state.x;$("finalVertical").textContent=state.y;
 $("activateButton").disabled=!dims||activating;$("copyButton").disabled=!dims||activating;
 const saved=savedMatches(dims);$("saveState").classList.toggle("saved",saved);$("saveStateText").textContent=saved?"ATIVADA":"NÃO ATIVADA";
}
function notify(message,error=false){const box=$("notice");box.hidden=false;box.textContent=message;box.classList.toggle("error",error)}
function clearNotice(){$("notice").hidden=true}

iphone.addEventListener("change",()=>{state.device=iphone.value;clearNotice();if(state.mode!=="custom"){const dims=modeResolution(state.mode);setResolution(dims[0],dims[1]);render()}else applyAxisResolution()});
function swapOrientation(){const w=widthInput.value,h=heightInput.value;widthInput.value=h;heightInput.value=w;state.orientation=state.orientation==="landscape"?"portrait":"landscape";clearNotice();render()}
$("orientationButton").addEventListener("click",swapOrientation);$("swapButton").addEventListener("click",swapOrientation);
document.querySelectorAll(".preset").forEach(button=>button.addEventListener("click",()=>{clearNotice();chooseMode(button.dataset.mode)}));
[widthInput,heightInput].forEach(input=>input.addEventListener("input",()=>{state.mode="custom";state.profile="";clearNotice();render()}));
horizontal.addEventListener("input",()=>{state.x=Number(horizontal.value);state.profile="";clearNotice();applyAxisResolution()});
vertical.addEventListener("input",()=>{state.y=Number(vertical.value);state.profile="";clearNotice();applyAxisResolution()});
document.querySelectorAll(".quick").forEach(button=>button.addEventListener("click",()=>{chooseProfile(button.dataset.profile);clearNotice()}));

$("activateButton").addEventListener("click",()=>{
 if(activating)return;
 const dims=currentResolution();if(!dims){notify("Informe uma resolução válida.",true);return}
 const config={device:state.device,orientation:state.orientation,width:dims[0],height:dims[1],x:state.x,y:state.y,mode:state.mode,profile:state.profile};
 if(!writeSaved(config)){notify("Não foi possível salvar este ajuste.",true);return}
 activating=true;clearNotice();render();
 const app=$("app"),overlay=$("activationOverlay");
 overlay.hidden=true;app.classList.remove("freeze-panel");void app.offsetWidth;
 app.classList.add("freeze-panel");document.body.classList.add("injecting");overlay.hidden=false;app.setAttribute("inert","");
 window.setTimeout(()=>{
  state.saved=config;overlay.hidden=true;app.classList.remove("freeze-panel");app.removeAttribute("inert");document.body.classList.remove("injecting");activating=false;render();
  notify("✓ RESOLUÇÃO ATIVADA COM SUCESSO! "+dims[0]+" × "+dims[1]+" • Lateral "+state.x+" • Vertical "+state.y);
 },ACTIVATION_DURATION);
});

$("copyButton").addEventListener("click",async()=>{
 const dims=currentResolution();if(!dims){notify("Informe uma resolução válida.",true);return}
 const content="SANTX SENSI • RESOLUTION VIP\n"+state.device+"\nResolução: "+dims[0]+" × "+dims[1]+"\nSensi lateral: "+state.x+"\nSensi vertical: "+state.y;
 let copied=false;
 if(navigator.clipboard?.writeText){try{await navigator.clipboard.writeText(content);copied=true}catch{}}
 if(!copied){const area=document.createElement("textarea");area.value=content;area.style.position="fixed";area.style.opacity="0";document.body.appendChild(area);area.select();try{copied=document.execCommand("copy")}catch{}area.remove()}
 notify(copied?"✓ Ajuste copiado!":"Não foi possível copiar o ajuste.",!copied);
});
render();
