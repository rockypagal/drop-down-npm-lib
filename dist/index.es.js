import n,{useState as r,useEffect as e,useRef as o}from"react";!function(n,r){void 0===r&&(r={});var e=r.insertAt;if(n&&"undefined"!=typeof document){var o=document.head||document.getElementsByTagName("head")[0],t=document.createElement("style");t.type="text/css","top"===e&&o.firstChild?o.insertBefore(t,o.firstChild):o.appendChild(t),t.styleSheet?t.styleSheet.cssText=n:t.appendChild(document.createTextNode(n))}}("/* --- drop down box css start --- */\r\n\r\n.drop-down-main {\r\n  /* margin-bottom: 1rem; */\r\n  position: relative;\r\n}\r\n\r\n.drop-down-main-small {\r\n  width: 11rem;\r\n}\r\n\r\n.drop-down-main-mini {\r\n  width: 5rem;\r\n}\r\n\r\n.drop-down-main-medium {\r\n  width: 19rem;\r\n}\r\n\r\n.drop-down-main-large {\r\n  width: 100%;\r\n}\r\n\r\n.drop-down-main .drop-down-title {\r\n  padding: 0.5rem 0;\r\n  font-weight: 500;\r\n}\r\n\r\n.drop-down-main .drop-down-selector {\r\n  width: 100%;\r\n  position: relative;\r\n}\r\n\r\n.drop-down-main .drop-down-selector .direct {\r\n  box-sizing: border-box;\r\n  width: 100%;\r\n  display: flex;\r\n  justify-content: space-between;\r\n  cursor: pointer;\r\n  color: #415094;\r\n  align-items: center;\r\n  padding: 0.65rem;\r\n  border-radius: 0.3125rem;\r\n  border: 1px solid #a1a4b9;\r\n}\r\n\r\n.drop-down-selector .drop-arrow {\r\n  font-size: 1rem;\r\n  transition: all 0.15s;\r\n  cursor: pointer;\r\n  color: #415094;\r\n}\r\n\r\n.drop-down-selector .up-arrow {\r\n  rotate: 180deg;\r\n}\r\n\r\n.input-field input[disabled],\r\n.drop-down-main .drop-down-selector .disabledDropBox {\r\n  background-color: #e2e2e24b;\r\n  cursor: not-allowed;\r\n}\r\n\r\n.drop-down-selector .drop-down-menu {\r\n  position: absolute;\r\n  top: 3rem;\r\n  left: 0;\r\n  width: 100%;\r\n  background-color: white;\r\n  z-index: 7;\r\n  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.25);\r\n  /* box-shadow: 0 14px 28px rgba(0, 0, 0, 0.25), 0 10px 10px rgba(0, 0, 0, 0.22); */\r\n  /* box-shadow: 0 24px 38px 3px rgb(255 255 255 / 14%),\r\n    0 9px 46px 8px rgb(132 132 132 / 12%), 0 11px 15px -7px rgba(0, 0, 0, 0.2); */\r\n  border-radius: 0.5rem;\r\n  /* border-bottom-right-radius: 0.5rem; */\r\n  overflow: hidden;\r\n  animation: drop-down-animation 0.13s ease-in-out;\r\n  max-height: 10rem;\r\n  overflow-y: scroll;\r\n  margin-bottom: 1rem;\r\n}\r\n\r\n.show-drop-scroll .drop-down-menu::-webkit-scrollbar {\r\n  width: 5px;\r\n}\r\n\r\n.show-drop-scroll .drop-down-menu::-webkit-scrollbar-thumb {\r\n  background: #818181;\r\n  border-radius: 10px;\r\n}\r\n\r\n.show-drop-scroll .drop-down-menu::-webkit-scrollbar-thumb:hover {\r\n  background: #a4a4a4;\r\n  cursor: pointer;\r\n}\r\n\r\n.hide-drop-scroll .drop-down-menu {\r\n  -ms-overflow-style: none;\r\n  scrollbar-width: none;\r\n}\r\n\r\n.hide-drop-scroll .drop-down-menu::-webkit-scrollbar {\r\n  display: block;\r\n}\r\n\r\n@keyframes drop-down-animation {\r\n  0% {\r\n    opacity: 0;\r\n    transform: translateY(-1.5rem);\r\n  }\r\n\r\n  100% {\r\n    transform: translateY(0px);\r\n  }\r\n}\r\n\r\n.drop-down-selector .hide_drop-down-menu {\r\n  animation: fadeOutAnimation 0.13s ease-in-out forwards;\r\n}\r\n\r\n.show_component-common-animation {\r\n  animation: show_component-common-animation 0.1s ease-in-out forwards;\r\n}\r\n\r\n.drop-down-search-bar input {\r\n  box-sizing: border-box;\r\n  display: inline-block;\r\n  vertical-align: middle;\r\n  padding: 0.5rem;\r\n  width: 95%;\r\n  height: 2.25rem;\r\n  line-height: 2.25rem;\r\n  width: 100%;\r\n  font-weight: 500;\r\n  font-size: 0.9rem;\r\n  border-radius: 6px;\r\n  outline: none;\r\n  color: #333;\r\n  background: #fff;\r\n  border: 1px solid #d2d6da;\r\n}\r\n\r\n@keyframes show_component-common-animation {\r\n  0% {\r\n    opacity: 0;\r\n    scale: 0;\r\n  }\r\n\r\n  50% {\r\n    opacity: 1;\r\n  }\r\n\r\n  100% {\r\n    opacity: 1;\r\n    transform: translateY(0px);\r\n  }\r\n}\r\n\r\n.hide_component-common-animation {\r\n  animation: hide_component-common-animation 0.3s ease-in-out forwards;\r\n}\r\n\r\n@keyframes hide_component-common-animation {\r\n  0% {\r\n    opacity: 1;\r\n    transform: translateY(0px);\r\n    scale: 1;\r\n  }\r\n\r\n  50% {\r\n    opacity: 0;\r\n  }\r\n\r\n  100% {\r\n    opacity: 0;\r\n    scale: 0;\r\n    /* transform: translateY(-3.5rem); */\r\n  }\r\n}\r\n\r\n@keyframes fadeOutAnimation {\r\n  0% {\r\n    opacity: 1;\r\n    transform: translateY(0px);\r\n  }\r\n\r\n  100% {\r\n    opacity: 0;\r\n    transform: translateY(-1.5rem);\r\n  }\r\n}\r\n\r\n.show_search-common-animation {\r\n  animation: show_search-common-animation 0.2s ease;\r\n}\r\n\r\n@keyframes show_search-common-animation {\r\n  0% {\r\n    /* width: 0; */\r\n    transform: translateX(20px);\r\n    scale: 0;\r\n    opacity: 0;\r\n  }\r\n\r\n  40% {\r\n    scale: 0.2;\r\n  }\r\n\r\n  70% {\r\n    opacity: 0.3;\r\n  }\r\n\r\n  100% {\r\n    scale: 1;\r\n    transform: translateX(0px);\r\n    opacity: 1;\r\n    /* width: 100%; */\r\n  }\r\n}\r\n\r\n.hide_search-common-animation {\r\n  animation: hide_search-common-animation 0.2s ease;\r\n}\r\n\r\n@keyframes hide_search-common-animation {\r\n  0% {\r\n    /* width: 100%; */\r\n    opacity: 1;\r\n    transform: translateX(0px);\r\n  }\r\n\r\n  20% {\r\n    opacity: 0.7;\r\n    scale: 1;\r\n  }\r\n\r\n  100% {\r\n    transform: translateX(20px);\r\n    opacity: 0;\r\n  }\r\n}\r\n\r\n.drop-down-menu .drop-down-item {\r\n  padding: 0.5rem;\r\n  font-size: 0.875rem;\r\n  padding-left: 0.9rem;\r\n  /* height: 2.25rem; */\r\n  display: flex;\r\n  align-items: center;\r\n  cursor: pointer;\r\n}\r\n\r\n.drop-down-menu .drop-down-item:hover {\r\n  background-color: #dbedff;\r\n}\r\n\r\n.drop-down-menu .selectedDropBox {\r\n  background-color: #f3f6f9;\r\n}\r\n\r\n.drop-down-menu .drop-down-search-bar {\r\n  /* display: flex;\r\n  justify-content: center;\r\n  padding: 0.4rem 0; */\r\n  padding: 0.4rem;\r\n}\r\n\r\n.animateDropDownLabel {\r\n  position: absolute;\r\n  top: 50%;\r\n  left: 0.7rem;\r\n  transform: translateY(-50%);\r\n  transition: all 0.3s;\r\n  pointer-events: none;\r\n  color: #212229;\r\n  z-index: 1;\r\n  opacity: 0.7;\r\n  font-size: 1rem;\r\n  line-height:0;\r\n}\r\n\r\n.animateDropDownLabel span {\r\n  padding: 0 0.5rem;\r\n  transition: 0.3s;\r\n}\r\n\r\n.animateDropDownLabelUp {\r\n  top: 0;\r\n  left: 0.7rem;\r\n  transform: translateY(-100%);\r\n  color: #344767;\r\n  font-weight: 500;\r\n  opacity: 1;\r\n}\r\n\r\n.animateDropDownLabelUp span {\r\n  font-size: 0.75rem;\r\n  background: white;\r\n}\r\n\r\n.direct.fixedHeight {\r\n  height: 2.75rem;\r\n}\r\n\r\n/* --- drop down box css end --- */\r\n");const t=({dropDownTitle:o,animateDropDownTitle:t,options:i,placeholder:d,size:s,showSearchBar:l,customSetter:m,customFormikLabel:p,customDropBoxStyles:c,disabled:w=!1,customTextStyle:u,titleStyle:h={},incomingValue:b,resetButton:f,callCustomFunction:x,customValueForCustomFunction:g,listApi:y,apiData:v={},dispatch:D,listOfKeyValue:k})=>{const[E,B]=r(!1),[T,_]=r(!1),[C,L]=r(i),[N,S]=r(d),[z,V]=r(""),[Y,A]=r(null),O=n=>{_(!T),function(){Y&&(clearTimeout(Y),A(null));if(E){const n=setTimeout((()=>{B(!1)}),200);A(n)}else B(!0)}()};e((()=>()=>{Y&&clearTimeout(Y)}),[Y]);const F=()=>"string"==typeof f?f:"All";return e((()=>{(z||N===F())&&(x&&z?x(z,g):p&&z?m(p,z):m(z),N===F()&&S(d||""))}),[z]),e((()=>{i?.forEach((n=>{const{label:r,value:e}=n;e===b&&(V(e),S(r))}))}),[i]),e((()=>{S(d)}),[d]),n.createElement("div",{className:"drop-down-main"+("small"===s?" drop-down-main-small":"medium"===s?" drop-down-main-medium":"mini"===s?" drop-down-main-mini":" drop-down-main-large")},o&&n.createElement("div",{className:"drop-down-title"+(t?z||E?" animateDropDownLabel animateDropDownLabelUp":" animateDropDownLabel":""),style:t?{padding:"0",...h}:h},n.createElement("span",null,o||"")),n.createElement("div",{className:"drop-down-selector"+(w?"":C?.length>4||l&&C?.length>3?" show-drop-scroll":" hide-drop-scroll")},n.createElement("div",{className:w?" direct disabledDropBox":"direct",onClick:()=>{w||O()},style:c||{}},n.createElement("div",{className:"default_value",style:u},N||" "),n.createElement("svg",{className:"drop-arrow "+(w?"disabledDropBox":T?"up-arrow":""),style:u&&N===d?u:{},xmlns:"http://www.w3.org/2000/svg",height:"1rem",viewBox:"0 -960 960 960",width:"24px",fill:"#415094"},n.createElement("path",{d:"M480-80 200-360l56-56 184 183v-647h80v647l184-184 56 57L480-80Z"}))),E&&n.createElement(a,{disabled:w,addStyle:T,showSearchBar:l,dropDownValueTwo:z,resetButton:f,menuOptions:C,setDropDownValue:S,setDropDownValueTwo:V,options:i,setMenuOptions:L,showMenu:E,handleClick:O,dispatch:D,listApi:y,handleResetBtnText:F})))},a=({options:t,disabled:a,addStyle:i,showSearchBar:d,dropDownValueTwo:s,resetButton:l,menuOptions:m,setDropDownValue:p,setDropDownValueTwo:c,setMenuOptions:w,showMenu:u,handleClick:h,listApi:b,dispatch:f,handleResetBtnText:x})=>{const[g,y]=r("");e((()=>{if(d){const n=[];t?.forEach((r=>{r.label&&r.label.toLowerCase().includes(g.toLowerCase())&&n.push(r)})),w(n)}}),[g]);const[v,D]=r(!1),k=o();return e((()=>{const n=n=>{k?.current&&!k?.current?.contains(n.target)&&h()};return document.addEventListener("click",n),()=>{document.removeEventListener("click",n)}}),[k]),e((()=>{u&&D(!0)}),[]),e((()=>{t&&w(t)}),[t]),n.createElement(n.Fragment,null,a?"":u?n.createElement("div",{className:i?"drop-down-menu":"drop-down-menu hide_drop-down-menu",ref:u&&v?k:null},d?n.createElement("div",{className:"drop-down-search-bar"},n.createElement("input",{type:"text",placeholder:"search here...",name:"search",value:g,onChange:n=>{y(n.target.value)},maxLength:80})):null,l&&s&&!g?n.createElement("div",{className:"drop-down-item",onClick:()=>{p(x()),c(""),h()}},n.createElement("span",null,x())):null,m?.length>0?m?.map((({label:r,value:e},o)=>n.createElement("div",{key:o,className:"drop-down-item"+(s===e?" selectedDropBox":""),onClick:()=>{p(r),c(e),h()}},n.createElement("span",null,r)))):n.createElement("div",{className:"drop-down-item"},n.createElement("span",null,"No Data Found"))):null)};export{t as default};
