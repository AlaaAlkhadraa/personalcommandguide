/**
 * The Al Andalos Rijschool concept, as one self-contained page.
 *
 * A pitch demo for a specific prospect: a full marketing site plus a
 * simulated student/instructor portal, all client-side with fictional
 * data. The artwork it references lives in /public/demo-al-andalos.
 * It lives as a string so the route handler can stamp the CSP nonce
 * into its one inline script at request time.
 */
export const AL_ANDALOS_HTML = `<!doctype html>
<html lang="nl">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="robots" content="noindex,nofollow">
<title>Al Andalos Rijschool</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,500;0,600;1,500&family=Marcellus&family=Source+Sans+3:ital,wght@0,400;0,600;0,700;1,400&family=JetBrains+Mono:wght@400&display=swap">
<style>
:root{
  --ivoor:#F5F7FB; --paneel:#FFFFFF; --inkt:#17202E; --gedempt:#5F6B7E;
  --lijn:#DFE5EF; --lijn-sterk:#B9C6DA;
  --smaragd:#1A57A8; --smaragd-diep:#0F3D7C; --nacht:#081F42;
  --smaragd-zacht:#E4EDFA; --goud:#2E7CD6; --goud-licht:#8FC0F5; --goud-zacht:#DEEBFB;
  --rood:#A33A2E; --rood-zacht:#F6E4E1;
}
*{box-sizing:border-box}
html{scroll-behavior:smooth}
html,body{margin:0;padding:0}
body{background:var(--ivoor);color:var(--inkt);font-family:"Source Sans 3",system-ui,sans-serif;font-size:16.5px;line-height:1.6}
img{max-width:100%}
.goudtekst{background:linear-gradient(100deg,var(--goud) 20%,var(--goud-licht) 50%,var(--goud) 80%);-webkit-background-clip:text;background-clip:text;color:transparent}
/* ====== patroon (zellige-achtig, puur CSS) ====== */
.patroon{background-color:var(--nacht);background-image:
  radial-gradient(circle at 0 0, transparent 46%, #8FC0F51E 47%, #8FC0F51E 49%, transparent 50%),
  radial-gradient(circle at 56px 56px, transparent 46%, #8FC0F51E 47%, #8FC0F51E 49%, transparent 50%),
  radial-gradient(circle at 56px 0, transparent 46%, #1a57a855 47%, #1a57a855 49%, transparent 50%),
  radial-gradient(circle at 0 56px, transparent 46%, #1a57a855 47%, #1a57a855 49%, transparent 50%);
  background-size:56px 56px}
/* ====== siteschil ====== */
.site-schil{max-width:1080px;margin:0 auto;padding:0 20px}
/* nav */
nav.hoofdnav{position:sticky;top:0;z-index:40;background:#081F42F0;backdrop-filter:blur(8px);border-bottom:1px solid #2E7CD633}
nav.hoofdnav .binnen{max-width:1080px;margin:0 auto;padding:12px 20px;display:flex;align-items:center;justify-content:space-between;gap:14px}
.merkje{display:flex;align-items:center;gap:11px;color:#fff;text-decoration:none}
.embleem{width:38px;height:44px;background:linear-gradient(160deg,#2E7CD6,#0F3D7C);border-radius:19px 19px 5px 5px;position:relative;flex:none}
.embleem::after{content:"";position:absolute;inset:5px 5px 4px;background:var(--nacht);border-radius:14px 14px 3px 3px}
.embleem::before{content:"A";position:absolute;inset:0;display:grid;place-items:center;color:var(--goud-licht);font-family:Marcellus,serif;font-size:19px;z-index:1;padding-top:5px}
.merkje b{font-family:Marcellus,serif;font-weight:400;font-size:17px;letter-spacing:.02em}
.merkje small{display:block;font-size:10.5px;letter-spacing:.22em;text-transform:uppercase;color:var(--goud-licht)}
.navlinks{display:flex;align-items:center;gap:20px}
.navlinks a{color:#ffffffcc;text-decoration:none;font-size:14.5px;font-weight:600}
.navlinks a:hover{color:var(--goud-licht)}
@media (max-width:760px){.navlinks a:not(.knop-goud){display:none}}
.knop-goud{background:linear-gradient(120deg,#2E7CD6,#5FA0EA 60%,#1A57A8);color:#fff!important;border:0;border-radius:999px;padding:10px 20px;font:700 14px "Source Sans 3";cursor:pointer;text-decoration:none;display:inline-block}
.knop-goud:hover{filter:brightness(1.07)}
.knop-omlijnd{border:1px solid #8FC0F588;color:var(--goud-licht);border-radius:999px;padding:10px 20px;font:600 14px "Source Sans 3";cursor:pointer;background:transparent;text-decoration:none;display:inline-block}
.knop-omlijnd:hover{background:#8FC0F51A}
/* hero */
.kunst-held{background:
  linear-gradient(180deg,#081F42B8 0%,#081F42D8 55%,#081F42F2 100%),
  url("/demo-al-andalos/held.png") center/cover no-repeat #081F42}
.kunstband{display:block;width:100%;border:1px solid var(--lijn);border-radius:20px;margin:0 0 28px}

.held{color:#fff;position:relative;overflow:hidden}
.held .binnen{max-width:1080px;margin:0 auto;padding:84px 20px 72px;position:relative;text-align:center}
.held .boog-lijn{width:120px;height:60px;margin:0 auto 26px;border:1.5px solid var(--goud);border-bottom:0;border-radius:120px 120px 0 0;position:relative}
.held .boog-lijn::after{content:"";position:absolute;left:50%;top:16px;transform:translateX(-50%);width:7px;height:7px;background:#D64545;border-radius:50%}
.held h1{font-family:"Cormorant Garamond",serif;font-weight:600;font-size:clamp(40px,7.5vw,72px);line-height:1.04;margin:0 0 8px;letter-spacing:.005em;text-wrap:balance}
.held .onder{font-family:Marcellus,serif;font-size:clamp(15px,2.6vw,19px);letter-spacing:.3em;text-transform:uppercase;color:var(--goud-licht);margin:0 0 22px}
.held p.tekst{max-width:56ch;margin:0 auto 30px;color:#ffffffd9;font-size:17.5px}
.held .ctas{display:flex;gap:12px;justify-content:center;flex-wrap:wrap}
.cijfers{display:flex;gap:0;justify-content:center;flex-wrap:wrap;margin-top:52px;border-top:1px solid #2E7CD633;padding-top:26px}
.cijfer{padding:0 26px;border-inline-start:1px solid #2E7CD633}
.cijfer:first-child{border-inline-start:0}
.cijfer b{display:block;font-family:"Cormorant Garamond",serif;font-size:34px;font-weight:600;color:var(--goud-licht);font-variant-numeric:tabular-nums;line-height:1.1}
.cijfer span{font-size:12px;letter-spacing:.09em;text-transform:uppercase;color:#ffffff99}
.voorbeeldstip{font-size:11.5px;color:#ffffff77;margin-top:14px}
/* secties */
section.blok{padding:64px 0}
.eyebrow{font-family:Marcellus,serif;font-size:13px;letter-spacing:.3em;text-transform:uppercase;color:var(--goud);text-align:center;margin:0 0 8px}
h2.groot{font-family:"Cormorant Garamond",serif;font-weight:600;font-size:clamp(30px,5vw,44px);text-align:center;margin:0 0 14px;line-height:1.1;text-wrap:balance}
p.leid{max-width:60ch;margin:0 auto 38px;text-align:center;color:var(--gedempt)}
/* usp-bogen */
.bogen{display:grid;grid-template-columns:repeat(auto-fit,minmax(230px,1fr));gap:16px}
.boogkaart{background:var(--paneel);border:1px solid var(--lijn);border-radius:130px 130px 16px 16px;padding:44px 22px 26px;text-align:center;position:relative}
.boogkaart::before{content:"";position:absolute;top:12px;left:12px;right:12px;height:110px;border:1px solid var(--goud-zacht);border-bottom:0;border-radius:118px 118px 0 0}
.boogkaart .teken{width:52px;height:52px;margin:0 auto 14px;border-radius:50%;background:var(--smaragd-zacht);color:var(--smaragd);display:grid;place-items:center;font-family:Marcellus,serif;font-size:22px}
.boogkaart h3{font-family:Marcellus,serif;font-weight:400;font-size:19px;margin:0 0 6px}
.boogkaart p{margin:0;color:var(--gedempt);font-size:14.5px}
/* pakketten */
.pakketten{display:grid;grid-template-columns:repeat(auto-fit,minmax(230px,1fr));gap:16px;align-items:stretch}
.pakket{background:var(--paneel);border:1px solid var(--lijn);border-radius:16px;padding:26px 22px;position:relative;display:flex;flex-direction:column}
.pakket.populair{border:1.5px solid var(--goud);box-shadow:0 12px 34px #2E7CD622}
.pakket.populair::before{content:"Meest gekozen";position:absolute;top:-11px;inset-inline-start:18px;background:linear-gradient(120deg,#2E7CD6,#5FA0EA);color:#fff;font:700 10.5px "Source Sans 3";letter-spacing:.07em;text-transform:uppercase;border-radius:99px;padding:3px 11px}
.pakket h3{font-family:Marcellus,serif;font-weight:400;font-size:19px;margin:0}
.pakket .prijs{font-family:"Cormorant Garamond",serif;font-weight:600;font-size:38px;color:var(--smaragd);margin:8px 0 0;line-height:1}
.pakket .per{font-size:13px;color:var(--gedempt);margin-bottom:14px}
.pakket ul{margin:0 0 18px;padding:0;list-style:none;font-size:14.5px;color:var(--gedempt);flex:1}
.pakket li{padding:6px 0 6px 24px;position:relative;border-top:1px dashed var(--lijn)}
.pakket li::before{content:"✓";position:absolute;left:2px;color:var(--goud);font-weight:700}
.pakket .knop-goud,.pakket .knop-smaragd{align-self:stretch;text-align:center}
.knop-smaragd{background:var(--smaragd);color:#fff;border:0;border-radius:999px;padding:11px 20px;font:700 14px "Source Sans 3";cursor:pointer;text-decoration:none;display:inline-block}
.knop-smaragd:hover{background:var(--smaragd-diep)}
/* werkwijze */
.stappen{display:grid;grid-template-columns:repeat(auto-fit,minmax(230px,1fr));gap:16px;counter-reset:stap}
.stap{background:var(--paneel);border:1px solid var(--lijn);border-radius:16px;padding:24px;counter-increment:stap;position:relative}
.stap::before{content:counter(stap,decimal-leading-zero);font-family:"Cormorant Garamond",serif;font-weight:600;font-size:44px;color:var(--goud-zacht);position:absolute;top:10px;inset-inline-end:18px;line-height:1}
.stap h3{font-family:Marcellus,serif;font-weight:400;font-size:18px;margin:0 0 6px;max-width:80%}
.stap p{margin:0;color:var(--gedempt);font-size:14.5px}
/* reviews */
.reviews{display:grid;grid-template-columns:repeat(auto-fit,minmax(250px,1fr));gap:16px}
.review{background:var(--paneel);border:1px solid var(--lijn);border-radius:16px;padding:24px}
.review .sterren{color:#C79A3B;letter-spacing:3px;font-size:15px}
.review p{font-family:"Cormorant Garamond",serif;font-size:19px;font-style:italic;line-height:1.45;margin:10px 0 14px}
.review .wie{font-size:13.5px;color:var(--gedempt)}
.review .wie b{color:var(--inkt)}
/* portaalband */
.portaalband{border-radius:22px;overflow:hidden;color:#fff}
.portaalband .binnen{padding:46px 28px;display:flex;flex-wrap:wrap;gap:30px;align-items:center;justify-content:space-between}
.portaalband h2{font-family:"Cormorant Garamond",serif;font-weight:600;font-size:clamp(26px,4vw,36px);margin:0 0 8px;line-height:1.12;text-wrap:balance}
.portaalband p{margin:0;color:#ffffffcc;max-width:52ch}
.portaalband ul{margin:14px 0 0;padding:0;list-style:none;color:#ffffffd9;font-size:14.5px}
.portaalband li{padding:4px 0 4px 24px;position:relative}
.portaalband li::before{content:"◆";position:absolute;left:2px;color:var(--goud-licht);font-size:10px;top:9px}
/* footer */
footer.voet{background:var(--nacht);color:#ffffffb0;margin-top:70px}
footer.voet .binnen{max-width:1080px;margin:0 auto;padding:40px 20px;display:flex;flex-wrap:wrap;gap:24px;justify-content:space-between;align-items:center}
footer.voet .concept{font-size:12.5px;color:#ffffff66;max-width:46ch}
footer.voet a{color:var(--goud-licht)}
/* ====== portaal (app) ====== */
.schil{max-width:960px;margin:0 auto;padding:0 16px 90px}
header.top{display:flex;align-items:center;justify-content:space-between;gap:12px;padding:16px 0 12px;border-bottom:2px solid var(--lijn-sterk)}
.merk{display:flex;align-items:center;gap:12px}
.merk h1{font-family:Marcellus,serif;font-weight:400;font-size:clamp(19px,4vw,26px);margin:0}
.merk small{display:block;color:var(--gedempt);font-size:12px;letter-spacing:.14em;text-transform:uppercase}
.merk .embleem{background:linear-gradient(160deg,var(--smaragd),var(--smaragd-diep))}
.merk .embleem::after{background:var(--ivoor)}
.merk .embleem::before{color:var(--smaragd)}
.uitlog{font:600 13.5px "Source Sans 3";border:1px solid var(--lijn-sterk);background:transparent;color:var(--inkt);border-radius:9px;padding:8px 14px;cursor:pointer}
.login{max-width:520px;margin:0 auto;padding:7vh 0 40px;text-align:center}
.login .embleem-groot{width:84px;height:96px;margin:0 auto 18px;background:linear-gradient(160deg,#2E7CD6,#0F3D7C);border-radius:42px 42px 10px 10px;position:relative}
.login .embleem-groot::after{content:"";position:absolute;inset:10px 10px 8px;background:var(--ivoor);border-radius:33px 33px 5px 5px}
.login .embleem-groot::before{content:"A";position:absolute;inset:0;display:grid;place-items:center;color:var(--smaragd);font-family:Marcellus,serif;font-size:44px;z-index:1;padding-top:10px}
.login h1{font-family:"Cormorant Garamond",serif;font-weight:600;font-size:clamp(30px,6vw,42px);margin:0;line-height:1.05}
.login .stad{color:var(--goud);letter-spacing:.24em;text-transform:uppercase;font-size:12.5px;margin:8px 0 30px}
.login h2{font-size:14.5px;font-weight:600;color:var(--gedempt);margin:0 0 12px}
.terug-site{margin-bottom:22px;display:inline-block;color:var(--smaragd);font-weight:600;font-size:14px;text-decoration:none}
.rollen{display:flex;flex-direction:column;gap:10px;text-align:start}
.rol{display:flex;align-items:center;gap:14px;background:var(--paneel);border:1px solid var(--lijn);border-radius:14px;padding:14px 16px;cursor:pointer;font:inherit;width:100%}
.rol:hover{border-color:var(--smaragd);box-shadow:0 2px 10px #1a57a818}
.rol .bol{width:42px;height:42px;border-radius:50%;display:grid;place-items:center;font-family:Marcellus,serif;font-size:18px;flex:none;background:var(--smaragd-zacht);color:var(--smaragd)}
.rol.instructeur .bol{background:var(--goud-zacht);color:var(--goud)}
.rol b{display:block;font-size:16.5px}
.rol span{display:block;color:var(--gedempt);font-size:13.5px}
.demonoot{margin-top:28px;font-size:13px;color:var(--gedempt)}
main{padding-top:18px}
h2.kop{font-family:Marcellus,serif;font-weight:400;font-size:21px;margin:26px 0 10px}
.kaart{background:var(--paneel);border:1px solid var(--lijn);border-radius:14px;padding:18px}
.tegels{display:grid;grid-template-columns:repeat(auto-fit,minmax(140px,1fr));gap:10px}
.tegel{background:var(--paneel);border:1px solid var(--lijn);border-radius:12px;padding:13px 15px}
.tegel b{display:block;font-family:"Cormorant Garamond",serif;font-weight:600;font-size:26px;font-variant-numeric:tabular-nums;color:var(--smaragd)}
.tegel span{font-size:12px;color:var(--gedempt);text-transform:uppercase;letter-spacing:.07em}
.balk{height:8px;background:var(--lijn);border-radius:99px;overflow:hidden;margin-top:8px}
.balk i{display:block;height:100%;background:linear-gradient(90deg,var(--smaragd),var(--goud));border-radius:99px}
.chip{display:inline-block;font:600 11.5px "Source Sans 3";letter-spacing:.05em;text-transform:uppercase;border-radius:99px;padding:4px 10px}
.chip.groen{background:var(--smaragd-zacht);color:var(--smaragd)}
.chip.geel{background:#F6EEDC;color:#8a6212}
button.actie{font:600 14px "Source Sans 3";background:var(--smaragd);color:#fff;border:0;border-radius:10px;padding:10px 16px;cursor:pointer}
button.actie.rood{background:transparent;color:var(--rood);border:1px solid var(--rood)}
.rooster-wrap{overflow-x:auto;border:1px solid var(--lijn);border-radius:14px;background:var(--paneel)}
table.rooster{border-collapse:collapse;width:100%;min-width:620px}
.rooster th{font:600 12px "Source Sans 3";letter-spacing:.06em;text-transform:uppercase;color:var(--gedempt);padding:10px 6px;border-bottom:1px solid var(--lijn);background:var(--ivoor)}
.rooster th:first-child{position:sticky;left:0;background:var(--ivoor);z-index:2}
.rooster td{border-bottom:1px solid var(--lijn);border-inline-start:1px solid var(--lijn);padding:3px;text-align:center;height:44px}
.rooster td.uur{font-family:"JetBrains Mono",monospace;font-size:12.5px;color:var(--gedempt);white-space:nowrap;padding:0 10px;position:sticky;left:0;background:var(--paneel);border-inline-start:0;z-index:1}
.slot{width:100%;height:38px;border:0;border-radius:8px;cursor:pointer;font:600 12px "Source Sans 3";padding:0 4px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.slot.vrij{background:#F1EDE2;color:#B8B09A}
.slot.open{background:var(--smaragd-zacht);color:var(--smaragd);border:1.5px dashed var(--smaragd)}
.slot.bezet{background:var(--smaragd);color:#fff}
.slot.mijn{background:linear-gradient(120deg,#2E7CD6,#1A57A8);color:#fff}
.slot.andere{background:#DDD8C8;color:#8d876f;cursor:default}
.legenda{display:flex;flex-wrap:wrap;gap:14px;margin-top:10px;font-size:13px;color:var(--gedempt)}
.legenda i{display:inline-block;width:13px;height:13px;border-radius:4px;margin-inline-end:5px;vertical-align:-2px}
.leerling-rij{display:flex;flex-wrap:wrap;align-items:center;gap:10px 16px;padding:13px 0;border-bottom:1px solid var(--lijn)}
.leerling-rij:last-child{border-bottom:0}
.leerling-rij .naam{font-weight:700;min-width:110px}
.leerling-rij .veld{font-size:13.5px;color:var(--gedempt)}
.leerling-rij .veld b{color:var(--inkt);font-variant-numeric:tabular-nums}
.voortgang{flex:1;min-width:120px}
dialog{border:0;border-radius:16px;padding:0;max-width:min(420px,92vw);width:100%;box-shadow:0 20px 60px #0004}
dialog::backdrop{background:#081F4299}
.modal-kop{font-family:Marcellus,serif;font-size:19px;padding:18px 20px 4px}
.modal-sub{color:var(--gedempt);font-size:13.5px;padding:0 20px 12px}
.modal-lijst{display:flex;flex-direction:column;gap:8px;padding:0 20px 20px}
.modal-lijst button{font:inherit;text-align:start;border:1px solid var(--lijn);background:var(--ivoor);border-radius:10px;padding:11px 14px;cursor:pointer}
.modal-lijst button:hover{border-color:var(--smaragd)}
.modal-lijst button.rood{color:var(--rood);border-color:var(--rood-zacht)}
.modal-lijst button small{display:block;color:var(--gedempt);font-size:12.5px}
.afspraak{display:flex;align-items:center;justify-content:space-between;gap:12px;padding:12px 0;border-bottom:1px solid var(--lijn)}
.afspraak:last-child{border-bottom:0}
.afspraak .wanneer{font-weight:700}
.afspraak .wanneer small{display:block;font-weight:400;color:var(--gedempt);font-size:13px}
footer.noot{margin-top:48px;padding-top:16px;border-top:1px solid var(--lijn);color:var(--gedempt);font-size:13px;text-align:center}
.reset{background:none;border:0;color:var(--gedempt);text-decoration:underline;cursor:pointer;font:inherit;font-size:13px}
:focus-visible{outline:2px solid var(--goud);outline-offset:2px}
.verborgen{display:none!important}
@media (prefers-reduced-motion:reduce){html{scroll-behavior:auto}}
</style>

</head>
<body>
<!-- ================= SITE ================= -->
<div id="weergave-site">
<nav class="hoofdnav">
  <div class="binnen">
    <a class="merkje" href="#top">
      <span class="embleem" aria-hidden="true"></span>
      <span><b>Al Andalos Rijschool</b><small>Maastricht</small></span>
    </a>
    <div class="navlinks">
      <a href="#pakketten">Pakketten</a>
      <a href="#werkwijze">Werkwijze</a>
      <a href="#reviews">Reviews</a>
      <a href="#portaal">Leerlingenportaal</a>
      <button class="knop-goud" data-naar-login>Inloggen</button>
    </div>
  </div>
</nav>

<header class="held kunst-held" id="top">
  <div class="binnen">
    <div class="boog-lijn" aria-hidden="true"></div>
    <p class="onder">Schakel &amp; Automaat</p>
    <h1>Je rijbewijs haal je <span class="goudtekst">bij Al Andalos</span></h1>
    <p class="tekst">Persoonlijke rijlessen in en rond Maastricht, met een eigen leerlingenportaal
    waarin je elke les, elke betaling en je hele voortgang terugziet. Geen verrassingen, geen losse briefjes.</p>
    <div class="ctas">
      <button class="knop-goud" data-naar-login>Plan een proefles</button>
      <a class="knop-omlijnd" href="#pakketten">Bekijk pakketten</a>
    </div>
    <div class="cijfers">
      <div class="cijfer"><b>68%</b><span>slagings&shy;percentage</span></div>
      <div class="cijfer"><b>340+</b><span>geslaagden</span></div>
      <div class="cijfer"><b>4,9</b><span>gemiddelde review</span></div>
      <div class="cijfer"><b>3</b><span>lestalen</span></div>
    </div>
    <p class="voorbeeldstip">Conceptpagina met voorbeeldcijfers en voorbeeldteksten — ontwerp door ZEVREN.</p>
  </div>
</header>

<div class="site-schil">
<section class="blok">
  <p class="eyebrow">Waarom Al Andalos</p>
  <h2 class="groot">Meer dan lessen: overzicht</h2>
  <p class="leid">Een goede instructeur brengt je naar het examen. Een goede rijschool laat je onderweg ook precies zien waar je staat.</p>
  <div class="bogen">
    <div class="boogkaart">
      <span class="teken">۞</span>
      <h3>Eigen leerlingenportaal</h3>
      <p>Log in en zie je lessen, je voortgang en je saldo — zoals bij het CBR, maar dan voor élke les.</p>
    </div>
    <div class="boogkaart">
      <span class="teken">⌚</span>
      <h3>Altijd inzicht</h3>
      <p>Je instructeur plant de lessen met je; in het portaal zie je direct wanneer je rijdt en wat er nog komt.</p>
    </div>
    <div class="boogkaart">
      <span class="teken">☰</span>
      <h3>Les in drie talen</h3>
      <p>Nederlands, Engels of Arabisch — uitleg in de taal waarin jij het snelst leert.</p>
    </div>
    <div class="boogkaart">
      <span class="teken">⌂</span>
      <h3>Ophalen waar jij bent</h3>
      <p>Thuis, school of werk in en rond Maastricht. De les begint bij jouw voordeur.</p>
    </div>
  </div>
</section>

<section class="blok" id="pakketten">
  <p class="eyebrow">Pakketten</p>
  <h2 class="groot">Eerlijke prijzen, vooraf bekend</h2>
  <p class="leid">Voorbeeldprijzen. Elk pakket verschijnt na aanmelding automatisch in je portaal, inclusief resterende lessen en saldo.</p>
  <div class="pakketten">
    <div class="pakket">
      <h3>Losse les</h3>
      <div class="prijs">€ 55</div><div class="per">per les van 60 minuten</div>
      <ul><li>Flexibel bijboeken</li><li>Inplannen in overleg met je instructeur</li></ul>
      <button class="knop-smaragd" data-naar-login>Start met een proefles</button>
    </div>
    <div class="pakket populair">
      <h3>10-lessenpakket</h3>
      <div class="prijs">€ 520</div><div class="per">€ 52,00 per les</div>
      <ul><li>10 lessen van 60 minuten</li><li>Voortgang in het portaal</li><li>Persoonlijk lesplan</li></ul>
      <button class="knop-goud" data-naar-login>Kies dit pakket</button>
    </div>
    <div class="pakket">
      <h3>20 lessen + examen</h3>
      <div class="prijs">€ 1.150</div><div class="per">inclusief praktijkexamen CBR</div>
      <ul><li>20 lessen van 60 minuten</li><li>Praktijkexamen inbegrepen</li><li>Tussentijdse toets optioneel</li></ul>
      <button class="knop-smaragd" data-naar-login>Kies dit pakket</button>
    </div>
    <div class="pakket">
      <h3>Spoedcursus</h3>
      <div class="prijs">€ 975</div><div class="per">in 4 weken naar je examen</div>
      <ul><li>15 lessen in 4 weken</li><li>Voorrang in het rooster</li><li>Voor wie haast heeft</li></ul>
      <button class="knop-smaragd" data-naar-login>Kies dit pakket</button>
    </div>
  </div>
</section>

<section class="blok" id="werkwijze">
  <p class="eyebrow">Werkwijze</p>
  <h2 class="groot">Van proefles tot roze pasje</h2>
  <img class="kunstband" src="/demo-al-andalos/route.png" alt="De achtoefening, getekend als routekaart — conceptillustratie" loading="lazy">
  <div class="stappen">
    <div class="stap"><h3>Proefles plannen</h3><p>Kies online een vrij moment. Tijdens de proefles schatten we samen in hoeveel lessen je ongeveer nodig hebt.</p></div>
    <div class="stap"><h3>Pakket en lesplan</h3><p>Je kiest een pakket; het staat direct in je portaal. Elke les zie je wat we oefenen en wat er nog komt.</p></div>
    <div class="stap"><h3>Altijd overzicht</h3><p>Je instructeur plant de lessen met jou. In je portaal zie je elke les, je saldo en je voortgang op één plek.</p></div>
    <div class="stap"><h3>Examen via de rijschool</h3><p>Wij vragen je praktijkexamen aan bij het CBR zodra je er klaar voor bent. Machtigen doe je eenvoudig via mijn.cbr.nl.</p></div>
  </div>
</section>

<section class="blok" id="reviews">
  <p class="eyebrow">Reviews</p>
  <h2 class="groot">Wat leerlingen zeggen</h2>
  <p class="leid">Voorbeeldreviews ter illustratie van het ontwerp.</p>
  <div class="reviews">
    <div class="review"><div class="sterren">★★★★★</div>
      <p>"In één keer geslaagd. Het fijnste was dat ik altijd kon zien hoeveel lessen ik nog had, mijn ouders ook."</p>
      <div class="wie"><b>Voorbeeld</b> · geslaagd na 24 lessen</div></div>
    <div class="review"><div class="sterren">★★★★★</div>
      <p>"Uitleg in het Arabisch toen het over de theorie ging: ineens viel alles op zijn plek."</p>
      <div class="wie"><b>Voorbeeld</b> · spoedcursus</div></div>
    <div class="review"><div class="sterren">★★★★★</div>
      <p>"Les verzetten was nooit gedoe. Even inloggen, ander uur kiezen, klaar."</p>
      <div class="wie"><b>Voorbeeld</b> · 10-lessenpakket</div></div>
  </div>
</section>

<section class="blok" id="portaal">
  <div class="portaalband patroon">
    <div class="binnen">
      <div>
        <h2>Het leerlingenportaal:<br><span class="goudtekst">alles op één plek</span></h2>
        <p>Zoals je bij het CBR je examen volgt, volg je hier je hele opleiding.</p>
        <ul>
          <li>Lessen gevolgd, gepland en resterend</li>
          <li>Saldo en betalingen per pakket</li>
          <li>Je lessen altijd actueel in je overzicht</li>
          <li>De instructeur beheert rooster en leerlingen</li>
        </ul>
      </div>
      <div style="display:flex;flex-direction:column;gap:10px;min-width:200px">
        <button class="knop-goud" data-naar-login>Probeer het portaal</button>
        <span style="font-size:12.5px;color:#ffffff88;text-align:center">demo met voorbeeldgegevens</span>
      </div>
    </div>
  </div>
</section>
</div>

<footer class="voet">
  <div class="binnen">
    <a class="merkje" href="#top">
      <span class="embleem" aria-hidden="true"></span>
      <span><b>Al Andalos Rijschool</b><small>Maastricht</small></span>
    </a>
    <div class="concept">Conceptontwerp door <a href="https://zevren.nl">ZEVREN</a>, Maastricht.
    Alle namen, cijfers, prijzen en reviews op deze pagina zijn voorbeelden.</div>
  </div>
</footer>
</div>

<!-- ================= PORTAAL ================= -->
<div id="weergave-portaal" class="verborgen">
<div class="schil">
<section id="scherm-login" class="login">
  <a href="#" class="terug-site" data-naar-site>← Terug naar de website</a>
  <div class="embleem-groot" aria-hidden="true"></div>
  <h1>Al Andalos Rijschool</h1>
  <p class="stad">Leerlingenportaal</p>
  <h2>Inloggen als</h2>
  <div class="rollen" id="rollen"></div>
  <p class="demonoot">Conceptdemo door <b>ZEVREN</b> · voorbeeldgegevens, geen echt systeem. Elke naam hieronder is fictief.</p>
</section>

<div id="scherm-app" class="verborgen">
  <header class="top">
    <div class="merk">
      <div class="embleem" aria-hidden="true"></div>
      <div><h1>Al Andalos Rijschool</h1><small>Leerlingenportaal</small></div>
    </div>
    <button class="uitlog" id="knop-uitlog">Uitloggen</button>
  </header>
  <main id="inhoud"></main>
  <footer class="noot">
    Conceptdemo door ZEVREN · voorbeeldprijzen en fictieve gegevens ·
    <button class="reset" id="knop-reset">demo opnieuw beginnen</button>
  </footer>
</div>

<dialog id="modal">
  <div class="modal-kop" id="modal-kop"></div>
  <div class="modal-sub" id="modal-sub"></div>
  <div class="modal-lijst" id="modal-lijst"></div>
</dialog>
</div>
</div>

<script>
"use strict";
/* ================= gegevens ================= */
const DAGEN = ["ma","di","wo","do","vr","za"];
const DAGNAMEN = {ma:"maandag",di:"dinsdag",wo:"woensdag",do:"donderdag",vr:"vrijdag",za:"zaterdag"};
const UREN = ["09:00","10:00","11:00","12:00","13:30","14:30","15:30","16:30","17:30"];
const PAKKETTEN = [
  {id:"los",   naam:"Losse les",        lessen:1,  prijs:55,   per:"per les van 60 min", punten:["Flexibel bijboeken","60 minuten"], populair:false},
  {id:"p10",   naam:"10-lessenpakket",  lessen:10, prijs:520,  per:"€ 52,00 per les",    punten:["10 lessen van 60 min","Voortgang in dit portaal"], populair:true},
  {id:"p20",   naam:"20 lessen + examen",lessen:20,prijs:1150, per:"incl. praktijkexamen","punten2":1, punten:["20 lessen van 60 min","Praktijkexamen CBR inbegrepen","Tussentijdse toets optioneel"], populair:false},
  {id:"spoed", naam:"Spoedcursus",      lessen:15, prijs:975,  per:"in 4 weken naar examen", punten:["15 lessen in 4 weken","Voorrang in het rooster"], populair:false},
];
const START = {
  leerlingen: [
    {id:"sara",  naam:"Sara",   pakket:"p10",  gevolgd:6, betaald:520},
    {id:"yousef",naam:"Yousef", pakket:"p20",  gevolgd:3, betaald:600},
    {id:"emma",  naam:"Emma",   pakket:"los",  gevolgd:4, betaald:220},
    {id:"karim", naam:"Karim",  pakket:"spoed",gevolgd:9, betaald:975},
  ],
  // slotstatus: ontbreekt = niet beschikbaar; "open" = leerling kan boeken; anders = leerling-id
  rooster: {
    "ma-10:00":"open","ma-14:30":"sara","ma-15:30":"open",
    "di-09:00":"yousef","di-10:00":"open","di-16:30":"open",
    "wo-13:30":"karim","wo-14:30":"karim","wo-15:30":"open",
    "do-09:00":"open","do-10:00":"emma","do-17:30":"open",
    "vr-11:00":"open","vr-14:30":"sara","vr-15:30":"open","vr-16:30":"yousef",
    "za-09:00":"karim","za-10:00":"open","za-11:00":"open",
  },
};
const SLEUTEL = "alandalos.demo.v2";
let S; // {leerlingen, rooster}
let rol = null; // "instructeur" | leerling-id
function laad(){
  try { const r = localStorage.getItem(SLEUTEL); if (r) { S = JSON.parse(r); return; } } catch {}
  S = JSON.parse(JSON.stringify(START));
}
function bewaar(){ try { localStorage.setItem(SLEUTEL, JSON.stringify(S)); } catch {} }
const pakketVan = l => PAKKETTEN.find(p => p.id === l.pakket);
const geplandVan = id => Object.values(S.rooster).filter(v => v === id).length;
const resterend = l => { const p = pakketVan(l); return p.id === "los" ? null : Math.max(0, p.lessen - l.gevolgd - geplandVan(l.id)); };
const openstaand = l => { const p = pakketVan(l); const kost = p.id === "los" ? (l.gevolgd + geplandVan(l.id)) * p.prijs : p.prijs; return Math.max(0, kost - l.betaald); };
const euro = n => "€ " + n.toLocaleString("nl-NL");
const esc = s => String(s).replace(/[&<>"]/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));

/* ================= login ================= */
function naarSite(){
  document.getElementById("weergave-portaal").classList.add("verborgen");
  document.getElementById("weergave-site").classList.remove("verborgen");
  window.scrollTo({top:0});
}
function naarPortaal(){
  document.getElementById("weergave-site").classList.add("verborgen");
  document.getElementById("weergave-portaal").classList.remove("verborgen");
  toonLogin();
  window.scrollTo({top:0});
}
function toonLogin(){
  rol = null;
  document.getElementById("scherm-login").classList.remove("verborgen");
  document.getElementById("scherm-app").classList.add("verborgen");
  const holder = document.getElementById("rollen");
  holder.innerHTML =
    \`<button class="rol instructeur" data-rol="instructeur">
       <span class="bol">I</span>
       <span><b>Instructeur</b><span>Rooster, leerlingen en betalingen beheren</span></span>
     </button>\` +
    S.leerlingen.map(l =>
    \`<button class="rol" data-rol="\${l.id}">
       <span class="bol">\${esc(l.naam[0])}</span>
       <span><b>\${esc(l.naam)}</b><span>Leerling · \${esc(pakketVan(l).naam)}</span></span>
     </button>\`).join("");
}
document.getElementById("rollen").addEventListener("click", e => {
  const b = e.target.closest(".rol"); if (!b) return;
  rol = b.dataset.rol;
  document.getElementById("scherm-login").classList.add("verborgen");
  document.getElementById("scherm-app").classList.remove("verborgen");
  teken();
});
document.getElementById("knop-uitlog").addEventListener("click", () => { toonLogin(); });
document.querySelectorAll("[data-naar-login]").forEach(b => b.addEventListener("click", e => { e.preventDefault(); naarPortaal(); }));
document.querySelectorAll("[data-naar-site]").forEach(b => b.addEventListener("click", e => { e.preventDefault(); naarSite(); }));
document.getElementById("knop-reset").addEventListener("click", () => {
  try { localStorage.removeItem(SLEUTEL); } catch {}
  laad(); teken();
});

/* ================= rooster-html ================= */
function roosterHtml(voorLeerling){
  let html = '<div class="rooster-wrap"><table class="rooster"><thead><tr><th></th>' +
    DAGEN.map(d => \`<th>\${DAGNAMEN[d]}</th>\`).join("") + "</tr></thead><tbody>";
  for (const uur of UREN){
    html += \`<tr><td class="uur">\${uur}</td>\`;
    for (const dag of DAGEN){
      const sleutel = \`\${dag}-\${uur}\`;
      const wie = S.rooster[sleutel];
      let cls = "vrij", tekst = "", uitleg = "niet beschikbaar";
      if (wie === "open"){ cls = "open"; tekst = "open"; uitleg = "beschikbaar"; }
      else if (wie){
        const l = S.leerlingen.find(x => x.id === wie);
        if (voorLeerling){
          if (wie === voorLeerling){ cls = "mijn"; tekst = "mijn les"; uitleg = "uw les"; }
          else { cls = "andere"; tekst = "bezet"; uitleg = "bezet"; }
        } else { cls = "bezet"; tekst = l ? l.naam : "?"; uitleg = "les"; }
      } else if (voorLeerling){ cls = "andere"; tekst = ""; uitleg = "niet beschikbaar"; }
      const uit = voorLeerling && (cls === "andere");
      html += \`<td><button class="slot \${cls}" data-slot="\${sleutel}" aria-label="\${DAGNAMEN[dag]} \${uur}: \${uitleg}" \${uit ? "disabled" : ""}>\${esc(tekst)}</button></td>\`;
    }
    html += "</tr>";
  }
  return html + "</tbody></table></div>";
}

/* ================= instructeur ================= */
function tekenInstructeur(){
  const totGepland = Object.values(S.rooster).filter(v => v && v !== "open").length;
  const totOpen = Object.values(S.rooster).filter(v => v === "open").length;
  const totTegoed = S.leerlingen.reduce((a, l) => a + openstaand(l), 0);
  document.getElementById("inhoud").innerHTML = \`
    <div class="tegels">
      <div class="tegel"><b>\${totGepland}</b><span>lessen gepland</span></div>
      <div class="tegel"><b>\${totOpen}</b><span>open plekken</span></div>
      <div class="tegel"><b>\${S.leerlingen.length}</b><span>leerlingen</span></div>
      <div class="tegel"><b>\${euro(totTegoed)}</b><span>openstaand</span></div>
    </div>
    <h2 class="kop">Weekrooster</h2>
    \${roosterHtml(null)}
    <p class="legenda">
      <span><i style="background:#F1EDE2"></i>niet beschikbaar — tik om open te zetten</span>
      <span><i style="background:var(--smaragd-zacht);border:1.5px dashed var(--smaragd)"></i>open uur — tik om een leerling in te delen</span>
      <span><i style="background:var(--smaragd)"></i>ingeplande les</span>
    </p>
    <h2 class="kop">Leerlingen</h2>
    <div class="kaart">\${S.leerlingen.map(l => {
      const p = pakketVan(l), rest = resterend(l), open = openstaand(l), gepland = geplandVan(l.id);
      const klaar = p.id === "los" ? 0 : Math.round(100 * l.gevolgd / p.lessen);
      return \`<div class="leerling-rij">
        <span class="naam">\${esc(l.naam)}</span>
        <span class="veld">\${esc(p.naam)}</span>
        <span class="veld"><b>\${l.gevolgd}</b> gevolgd · <b>\${gepland}</b> gepland\${rest === null ? "" : \` · <b>\${rest}</b> over\`}</span>
        <span class="voortgang">\${p.id === "los" ? "" : \`<div class="balk"><i style="width:\${klaar}%"></i></div>\`}</span>
        <span>\${open === 0 ? '<span class="chip groen">betaald</span>' : \`<span class="chip geel">\${euro(open)} open</span>\`}</span>
      </div>\`;
    }).join("")}</div>
    <h2 class="kop">Pakketten <span style="font-size:13px;color:var(--gedempt)">(voorbeeldprijzen)</span></h2>
    <div class="pakketten">\${PAKKETTEN.map(p => \`
      <div class="pakket \${p.populair ? "populair" : ""}">
        <h3>\${esc(p.naam)}</h3>
        <div class="prijs">\${euro(p.prijs)}</div>
        <div class="per">\${esc(p.per)}</div>
        <ul>\${p.punten.map(x => \`<li>\${esc(x)}</li>\`).join("")}</ul>
      </div>\`).join("")}
    </div>\`;
}
function instructeurTik(sleutel){
  const wie = S.rooster[sleutel];
  const [dag, uur] = sleutel.split("-");
  if (!wie){ S.rooster[sleutel] = "open"; bewaar(); teken(); return; }
  if (wie === "open"){
    toonModal(\`\${DAGNAMEN[dag]} \${uur}\`, "Deel een leerling in, of sluit het uur.",
      S.leerlingen.map(l => ({tekst:l.naam, sub:\`\${esc(pakketVan(l).naam)}\${resterend(l) === 0 ? " · pakket is vol" : ""}\`, actie:() => { S.rooster[sleutel] = l.id; }}))
      .concat([{tekst:"Niet beschikbaar maken", sub:"Uur sluiten", rood:true, actie:() => { delete S.rooster[sleutel]; }}]));
    return;
  }
  const l = S.leerlingen.find(x => x.id === wie);
  toonModal(\`\${DAGNAMEN[dag]} \${uur} — \${l ? l.naam : "les"}\`, "Wat wilt u met deze les doen?", [
    {tekst:"Les annuleren, uur open laten", sub:"Het uur blijft open in je rooster", actie:() => { S.rooster[sleutel] = "open"; }},
    {tekst:"Les annuleren en uur sluiten", rood:true, actie:() => { delete S.rooster[sleutel]; }},
  ]);
}

/* ================= leerling ================= */
function tekenLeerling(id){
  const l = S.leerlingen.find(x => x.id === id);
  const p = pakketVan(l), rest = resterend(l), open = openstaand(l), gepland = geplandVan(id);
  const klaar = p.id === "los" ? null : Math.round(100 * l.gevolgd / p.lessen);
  const mijn = Object.entries(S.rooster).filter(([, wie]) => wie === id)
    .map(([sleutel]) => sleutel).sort((a, b) => DAGEN.indexOf(a.split("-")[0]) - DAGEN.indexOf(b.split("-")[0]) || a.localeCompare(b));
  document.getElementById("inhoud").innerHTML = \`
    <p style="margin:4px 0 14px;color:var(--gedempt)">Welkom terug, <b style="color:var(--inkt)">\${esc(l.naam)}</b> · \${esc(p.naam)}</p>
    <div class="tegels">
      <div class="tegel"><b>\${l.gevolgd}</b><span>lessen gevolgd</span></div>
      <div class="tegel"><b>\${gepland}</b><span>gepland</span></div>
      \${rest === null ? "" : \`<div class="tegel"><b>\${rest}</b><span>nog over</span></div>\`}
      <div class="tegel"><b>\${p.id === "los" ? euro(p.prijs) : euro(Math.round(p.prijs / p.lessen))}</b><span>per les</span></div>
      <div class="tegel">\${open === 0
        ? '<b style="font-size:17px;padding-top:5px">betaald ✓</b><span>saldo</span>'
        : \`<b style="color:#8a6212">\${euro(open)}</b><span>nog te betalen</span>\`}</div>
    </div>
    \${klaar === null ? "" : \`<div class="kaart" style="margin-top:12px">
      <div style="display:flex;justify-content:space-between;font-size:13.5px;color:var(--gedempt)">
        <span>Voortgang pakket</span><span><b style="color:var(--inkt)">\${l.gevolgd}</b> van \${p.lessen} lessen</span>
      </div>
      <div class="balk"><i style="width:\${klaar}%"></i></div>
    </div>\`}
    <h2 class="kop">Mijn lessen deze week</h2>
    <div class="kaart">\${mijn.length === 0
      ? '<span style="color:var(--gedempt)">Nog geen les gepland. Je instructeur deelt je in; zodra er een les staat, zie je hem hier.</span>'
      : mijn.map(sleutel => { const [dag, uur] = sleutel.split("-");
        return \`<div class="afspraak">
          <span class="wanneer">\${DAGNAMEN[dag]} \${uur}<small>60 minuten · ophalen wordt afgestemd</small></span>
          <span class="chip groen">gepland</span>
        </div>\`; }).join("")}
    </div>
    <p style="margin:14px 0 0;color:var(--gedempt);font-size:13.5px">Wil je een les verzetten? Stuur je instructeur even een berichtje.</p>\`;
}
document.getElementById("inhoud").addEventListener("click", e => {
  const s = e.target.closest(".slot"); if (!s) return;
  if (rol === "instructeur") instructeurTik(s.dataset.slot);
});

/* ================= modal ================= */
const modal = document.getElementById("modal");
function toonModal(kop, sub, opties){
  document.getElementById("modal-kop").textContent = kop;
  document.getElementById("modal-sub").textContent = sub;
  const lijst = document.getElementById("modal-lijst");
  lijst.innerHTML = opties.map((o, i) =>
    \`<button data-i="\${i}" class="\${o.rood ? "rood" : ""}">\${esc(o.tekst)}\${o.sub ? \`<small>\${o.sub}</small>\` : ""}</button>\`).join("") +
    '<button data-i="-1"><small>Sluiten</small></button>';
  lijst.onclick = e => {
    const b = e.target.closest("button"); if (!b) return;
    const i = Number(b.dataset.i);
    modal.close();
    if (i >= 0){ opties[i].actie(); bewaar(); teken(); }
  };
  modal.showModal();
}
modal.addEventListener("click", e => { if (e.target === modal) modal.close(); });

/* ================= start ================= */
function teken(){ if (rol === "instructeur") tekenInstructeur(); else if (rol) tekenLeerling(rol); }
laad();
</script>
</body>
</html>
`;
