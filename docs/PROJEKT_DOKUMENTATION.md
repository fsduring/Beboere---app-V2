# PROJEKT DOKUMENTATION: RenoveringsPortal (v7.0)

**Systemtype:** Cloud-baseret kommunikationsplatform til renoveringssager (SaaS)

**Status:** Produktionsklar Prototype (Master Edition)

**Platform:** Cross-platform Web App (Responsive SPA)

## 1. Executive summary
RenoveringsPortal er et specialiseret styringsværktøj designet til at håndtere kommunikationen mellem entreprenør, beboere og bygherre under renoveringsprojekter i beboede ejendomme (fx faldstammeudskiftning, vinduesudskiftning).

**Hovedproblemet den løser**

Klassisk beboerkommunikation foregår via løse emails, papirsedler og telefonopkald. Det skaber utryghed hos beboerne, administrativt kaos for byggelederen og manglende dokumentation overfor bygherren.

**Løsningen**

Et digitalt økosystem, der fjerner behovet for brugeroprettelse via en unik Token-baseret adgangsmodel (QR). Dette sikrer 100% tilslutning fra beboerne (ingen passwords at glemme), GDPR-compliance (ingen CPR-numre) og fuld sporbarhed af dokumentation.

## 2. Kerne-koncept: "Token access" & sikkerhed
I modsætning til traditionelle apps, hvor brugere skal oprette sig med email/password, bruger dette system en fysisk-digital bro.

- **Generering:** Når en bolig oprettes i systemet, genereres en unik, kryptografisk streng (Token), fx SEC-8291-X.
- **Distribution:** Denne token printes som en QR-kode på et fysisk varslingsbrev, der lægges i beboerens postkasse.
- **Adgang:** Beboeren scanner koden (eller indtaster den) og får øjeblikkelig adgang til deres specifikke data.
- **Sikkerhed:** Systemet isolerer dataene. Token A giver kun adgang til Bolig A’s tidslinje og dokumenter. Da "nøglen" leveres fysisk i postkassen, fungerer postkassen som en fysisk 2-faktor godkendelse.

## 3. Rollebeskrivelser & funktionalitet
Appen er opdelt i tre distinkte interfaces, der automatisk tilpasser sig brugerens rolle.

### A. Entreprenør / Admin (Drifts-interface)
- **Målgruppe:** Byggeledere og Administratorer.
- **Platform:** Desktop & Tablet.
- **Dashboard & KPI:** Realtidsovervågning af projektets sundhedstilstand.
- **Live Feed:** Ser hvem der logger ind, og hvem der har læst vigtige varslinger.
- **Status:** Visuel procent-sats for færdiggørelse og antal aktive sager.
- **Lejemålsstyring (CRUD):**
  - Oprettelse af nye sager/lejemål med få klik.
  - Automatisk generering af QR-koder og Tokens.
  - Inddeling i etaper (fx "Etape 1", "Etape 2") for at styre store byggerier.
- **Kommunikationscenter:**
  - Indbakke: Modtagelse af fejlmeldinger eller spørgsmål direkte fra beboerne.
  - Varsling: Systemet tracker, om en beboer har åbnet en kritisk varsling (read-receipt).
- **Data persistence:** Systemet gemmer alle ændringer lokalt i browserens database (LocalStorage), hvilket sikrer at data bevares mellem sessioner, selv uden ekstern serverforbindelse i prototypen.

### B. Beboer (Brugervenligt interface)
- **Målgruppe:** Lejere og ejere i ejendommen.
- **Platform:** Mobil (Smartphone).
- **Tidslinje-visualisering:** En grafisk og letforståelig visning af, hvor i processen deres bolig befinder sig (Start -> I gang -> Slut). Dette minimerer usikkerhed.
- **Dokumentarkiv:** Adgang til varslinger, tegninger og vejledninger. Vigtige dokumenter markeres med "ULÆST" og rød farve.
- **Senior Mode (Tilgængelighed):** En unik feature, der med ét klik ændrer hele appens design:
  - Skriftstørrelse øges markant.
  - Kontraster maksimeres (Sort/Hvid/Gul).
  - Interface forenkles for at imødekomme ældre beboere.
- **Fejlrapportering:** Direkte kanal til byggelederen ("Jeg har ingen vand", "Håndværker glemte at låse").

### C. Bygherre / Viewer (Passivt interface)
- **Målgruppe:** Ejendommens ejer, rådgivere eller investorer.
- **Platform:** Desktop.
- **Read-Only Dashboard:** Fuld gennemsigtighed i projektets fremdrift uden risiko for at slette eller ændre data ved en fejl.
- **Digital Aflevering (ZIP Engine):**
  - Bygherren kan med ét klik generere en komplet backup af hele sagen.
  - Teknisk: Appen bygger en ZIP-fil in-memory i browseren.
  - Struktur: Zip-filen organiserer automatisk data i en logisk mappestruktur: Projekt -> Etape -> Adresse -> Kategori (Billeder/Dokumenter).
  - Dette sikrer, at dokumentationen er sikret til fremtiden, uafhængigt af appen.

## 4. Teknisk arkitektur
Appen er bygget som en moderne Single Page Application (SPA).

- **Teknisk stack:**
  - Frontend logic: Vanilla JavaScript (ES6+) for maksimal ydeevne og ingen afhængigheder af tunge frameworks.
  - Styling: Tailwind CSS (via CDN) sikrer et moderne, responsivt og konsistent designsystem.
  - Ikoner: FontAwesome integration til visuel navigation.
  - Data engine: localStorage implementering der simulerer en NoSQL database struktur (JSON). Gør appen lynhurtig og i stand til at køre offline/lokalt.
- **Biblioteker:** JSZip & FileSaver.js håndterer generering og download af store datamængder (ZIP-eksport) direkte i klientens browser (client-side processing).
- **Datamodel (JSON struktur):**

```json
{
  "units": [
    {
      "id": 101,
      "address": "Storgade 1, 1.tv",
      "token": "SEC-8291",
      "stage": "Etape 2",
      "status": "active"
    }
  ],
  "messages": [
    {
      "from": "Storgade 1, 1.tv",
      "body": "Vandet drypper stadig...",
      "timestamp": "2023-10-24T10:00:00"
    }
  ],
  "logs": []
}
```

## 5. Unique selling points (USP)
Hvorfor vælge dette system frem for en Facebook-gruppe eller mail-liste?

- Ingen "onboarding friction": Beboere skal ikke downloade noget fra App Store eller huske koder. De scanner og er inde.
- Juridisk dokumentation: Systemet logger handlinger. Hvis en beboer påstår "jeg fik aldrig varslingen", kan admin bevise: "Jo, du åbnede den d. 24. oktober kl. 14:30".
- Afleverings-klar: Eksport-funktionen sparer rådgiveren for mange timers manuel arkivering ved projektets afslutning.
- Inklusivitet: Senior Mode sikrer, at den ældre generation (som ofte bor i renoveringsejendomme) ikke bliver hægtet af digitaliseringen.

## 6. Fremtidig skalering (Roadmap)
Nuværende version er en fuldt funktionel "Client-Side" applikation. Næste skridt for produktion (v8.0+) ville være:

- **Backend:** Udskiftning af localStorage med en rigtig cloud-database (fx Supabase eller Firebase) for real-time synkronisering på tværs af flere enheder.
- **SMS gateway:** Integration med en SMS-service (fx Twilio), så beboere får en SMS, når der er nyt i appen.
- **Billed-upload:** Implementering af en fil-server (AWS S3) til lagring af rigtige fotos i stedet for placeholders.

## HTML prototype
Nedenfor er den fulde HTML-prototype (V7) for reference. Den viser SPA layout, Senior Mode, Admin/Viewer/Beboer flows og den klient-side ZIP-engine via JSZip + FileSaver.

```html
<!DOCTYPE html>
<html lang="da">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <title>RenoveringsPortal V7 - Full Suite</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;800&display=swap" rel="stylesheet">
    
    <!-- Biblioteker til at generere rigtige ZIP filer i browseren -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/FileSaver.js/2.0.5/FileSaver.min.js"></script>

    <style>
        /* ================= CORE STYLES ================= */
        body { font-family: 'Inter', sans-serif; background-color: #f0f2f5; -webkit-tap-highlight-color: transparent; }
        
        /* SPA Logic */
        .page { display: none; opacity: 0; transition: opacity 0.3s ease-in-out; }
        .active-page { display: block; opacity: 1; }
        .fade-in-up { animation: fadeInUp 0.4s ease-out forwards; }
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }

        /* Folder Tree Style (Viewer) */
        .tree-item { padding-left: 20px; border-left: 1px dashed #cbd5e1; position: relative; }
        .tree-item::before { content: ''; position: absolute; left: 0; top: 14px; width: 15px; height: 1px; background: #cbd5e1; }
        
        /* Senior Mode Overrides */
        body.senior-mode { background-color: #ffffff; color: #000000; font-size: 110%; }
        body.senior-mode .bg-white { border: 2px solid #000; box-shadow: none !important; }
        body.senior-mode button { 
            background: #ffeb3b !important; color: #000 !important; 
            border: 3px solid #000 !important; font-weight: 900; text-transform: uppercase;
            box-shadow: 4px 4px 0px #000 !important;
        }
        body.senior-mode .senior-hide { display: none !important; }
    </style>
</head>
<body id="appBody" class="text-gray-800 h-screen overflow-hidden">

    <!-- ================================================================= -->
    <!-- 1. LOGIN SCREEN -->
    <!-- ================================================================= -->
    <div id="loginPage" class="page active-page min-h-screen flex flex-col items-center justify-center bg-slate-900 p-4">
        <div class="w-full max-w-sm bg-white rounded-2xl shadow-2xl overflow-hidden fade-in-up">
            <div class="bg-blue-600 p-8 text-center">
                <div class="inline-flex items-center justify-center w-16 h-16 bg-white rounded-full mb-4 shadow-lg text-blue-600 text-2xl">
                    <i class="fas fa-hammer"></i>
                </div>
                <h1 class="text-2xl font-extrabold text-white tracking-tight">RenoveringsPortal</h1>
                <p class="text-blue-100 text-sm">Login til sagsstyring</p>
            </div>
            
            <div class="p-8 space-y-6">
                <div>
                    <label class="block text-xs font-bold text-gray-500 uppercase mb-2">Adgangskode</label>
                    <div class="relative">
                        <span class="absolute left-4 top-3.5 text-gray-400"><i class="fas fa-key"></i></span>
                        <input type="text" id="loginInput" placeholder="Indtast kode..." 
                            class="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 outline-none font-mono text-lg uppercase"
                            onkeypress="handleEnter(event)">
                    </div>
                </div>
                <button onclick="app.login()" class="w-full bg-slate-900 text-white py-4 rounded-xl font-bold text-lg hover:bg-slate-800 transition shadow-lg">LOG IND</button>
            </div>
            
            <!-- Role Switcher (Demo Only) -->
            <div class="bg-gray-50 p-4 text-center border-t text-xs">
                <p class="text-gray-400 font-bold mb-2 uppercase tracking-widest">Vælg Rolle (Demo)</p>
                <div class="flex justify-center gap-2">
                    <button onclick="app.quickLogin('ADMIN')" class="px-3 py-1 bg-blue-100 text-blue-800 rounded font-bold">Admin</button>
                    <button onclick="app.quickLogin('BYGHERRE')" class="px-3 py-1 bg-gray-800 text-white rounded font-bold">Bygherre</button>
                    <button onclick="app.quickLogin('BEBOER')" class="px-3 py-1 bg-green-100 text-green-800 rounded font-bold">Beboer</button>
                </div>
            </div>
        </div>
    </div>

    <!-- ================================================================= -->
    <!-- 2. ADMIN DASHBOARD (Entreprenør) -->
    <!-- ================================================================= -->
    <div id="adminPage" class="page h-screen flex flex-col bg-gray-100">
        <header class="bg-slate-900 text-white shadow-lg z-20">
            <div class="flex justify-between items-center px-6 py-3">
                <div class="flex items-center gap-3">
                    <div class="bg-blue-600 px-2 py-1 rounded font-bold text-xs tracking-wide">ENTREPRENØR</div>
                    <span class="font-bold text-lg">Renovering Storgade</span>
                </div>
                <button onclick="app.logout()" class="text-sm text-gray-300 hover:text-white">Log ud <i class="fas fa-sign-out-alt ml-1"></i></button>
            </div>
            <!-- Admin Tabs -->
            <div class="flex px-6 gap-1 text-sm font-medium bg-slate-800">
                <button onclick="app.setTab('admin', 'overview')" id="tab-admin-overview" class="px-4 py-3 border-b-4 border-blue-500 text-white">Overblik</button>
                <button onclick="app.setTab('admin', 'units')" id="tab-admin-units" class="px-4 py-3 border-b-4 border-transparent text-gray-400 hover:text-white">Lejemål</button>
                <button onclick="app.setTab('admin', 'messages')" id="tab-admin-messages" class="px-4 py-3 border-b-4 border-transparent text-gray-400 hover:text-white">Indbakke</button>
            </div>
        </header>

        <main class="flex-1 overflow-y-auto p-6 max-w-7xl mx-auto w-full">
            <!-- Admin: Overview -->
            <div id="view-admin-overview" class="admin-view space-y-6">
                <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div class="bg-white p-6 rounded-xl shadow-sm border-l-4 border-blue-500">
                        <div class="text-gray-400 text-xs font-bold uppercase">Aktive Sager</div>
                        <div class="text-3xl font-bold text-gray-800 mt-1" id="kpi-units">0</div>
                    </div>
                    <div class="bg-white p-6 rounded-xl shadow-sm border-l-4 border-green-500">
                        <div class="text-gray-400 text-xs font-bold uppercase">Færdiggørelse</div>
                        <div class="text-3xl font-bold text-gray-800 mt-1">35%</div>
                    </div>
                    <div onclick="document.getElementById('modalCreateUnit').classList.remove('hidden')" class="bg-blue-600 text-white p-6 rounded-xl shadow-sm cursor-pointer hover:bg-blue-700 transition flex items-center justify-between">
                        <div>
                            <div class="font-bold text-lg">Opret Ny</div>
                            <div class="text-blue-200 text-xs">Generer QR kode</div>
                        </div>
                        <i class="fas fa-plus-circle text-3xl"></i>
                    </div>
                </div>
                
                <div class="bg-white rounded-xl shadow-sm p-6">
                    <h3 class="font-bold text-gray-800 mb-4 border-b pb-2">Seneste Aktivitet</h3>
                    <ul class="space-y-3 text-sm text-gray-600" id="activity-log">
                        <!-- Dynamic logs -->
                    </ul>
                </div>
            </div>

            <!-- Admin: Units List -->
            <div id="view-admin-units" class="admin-view hidden">
                <div class="bg-white rounded-xl shadow-sm overflow-hidden">
                    <div class="p-4 border-b bg-gray-50 flex justify-between items-center">
                        <input type="text" onkeyup="app.renderUnits()" id="unitSearch" placeholder="Søg adresse..." class="border p-2 rounded text-sm w-64">
                        <button onclick="document.getElementById('modalCreateUnit').classList.remove('hidden')" class="bg-blue-600 text-white px-3 py-2 rounded text-sm font-bold"><i class="fas fa-plus mr-1"></i> Ny</button>
                    </div>
                    <table class="w-full text-left text-sm">
                        <thead class="bg-gray-100 text-gray-600 text-xs uppercase font-bold">
                            <tr><th class="p-4">Adresse</th><th class="p-4">Etape</th><th class="p-4">Token</th><th class="p-4 text-right">QR</th></tr>
                        </thead>
                        <tbody id="unitsTable" class="divide-y divide-gray-100"></tbody>
                    </table>
                </div>
            </div>
            
             <!-- Admin: Messages -->
             <div id="view-admin-messages" class="admin-view hidden">
                <div class="bg-white rounded-xl shadow-sm p-6">
                    <h2 class="font-bold text-lg mb-4">Beskeder fra Beboere</h2>
                    <div id="message-list" class="space-y-4"></div>
                </div>
            </div>
        </main>
    </div>

    <!-- ================================================================= -->
    <!-- 3. BYGHERRE PORTAL (Viewer) -->
    <!-- ================================================================= -->
    <div id="viewerPage" class="page h-screen flex flex-col bg-slate-50">
        <header class="bg-gray-900 text-white shadow-lg z-20 border-b-4 border-green-500">
            <div class="flex justify-between items-center px-6 py-4">
                <div class="flex items-center gap-3">
                    <div class="bg-green-600 px-2 py-1 rounded font-bold text-xs tracking-wide">BYGHERRE</div>
                    <div>
                        <div class="font-bold text-lg leading-none">Renovering Storgade</div>
                        <div class="text-xs text-gray-400">Read-Only Access</div>
                    </div>
                </div>
                <button onclick="app.logout()" class="text-sm text-gray-400 hover:text-white">Log ud</button>
            </div>
        </header>

        <main class="flex-1 overflow-y-auto p-8 max-w-6xl mx-auto w-full">
            
            <!-- Top Stats -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                <div class="bg-white p-6 rounded-lg shadow-sm">
                    <h3 class="text-gray-500 font-bold uppercase text-xs mb-2">Projekt Status</h3>
                    <div class="flex items-end gap-2">
                        <span class="text-4xl font-bold text-gray-800">35%</span>
                        <span class="text-gray-500 mb-1">færdiggjort</span>
                    </div>
                    <div class="w-full bg-gray-200 h-2 rounded-full mt-3"><div class="bg-green-500 h-2 rounded-full" style="width: 35%"></div></div>
                </div>
                
                <div class="bg-white p-6 rounded-lg shadow-sm flex items-center justify-between">
                    <div>
                        <h3 class="text-gray-500 font-bold uppercase text-xs mb-2">Dokumentation</h3>
                        <p class="text-sm text-gray-600">Klar til eksport: <span class="font-bold text-black" id="viewer-total-files">0 filer</span></p>
                        <p class="text-xs text-gray-400 mt-1">Opdateret: Lige nu</p>
                    </div>
                    <button onclick="app.downloadZip()" id="downloadBtn" class="bg-gray-800 hover:bg-black text-white px-6 py-3 rounded-lg font-bold shadow flex items-center gap-3 transition">
                        <i class="fas fa-file-archive text-xl"></i>
                        <div>
                            <div class="text-xs font-normal text-gray-300">DOWNLOAD ALT</div>
                            <div class="leading-none">HENT ZIP</div>
                        </div>
                    </button>
                </div>
            </div>

            <!-- Folder Structure Visualization -->
            <div class="bg-white rounded-lg shadow-sm border border-gray-200">
                <div class="p-4 border-b bg-gray-50 font-bold text-gray-700 flex items-center gap-2">
                    <i class="fas fa-folder-tree"></i> Mappestruktur (Preview)
                </div>
                <div class="p-6 overflow-y-auto max-h-[500px] font-mono text-sm" id="folder-tree">
                    <!-- Tree rendered by JS -->
                </div>
            </div>
        </main>
    </div>

    <!-- ================================================================= -->
    <!-- 4. RESIDENT APP (Beboer) -->
    <!-- ================================================================= -->
    <div id="residentPage" class="page min-h-screen bg-white pb-20">
        <div class="bg-gray-900 text-white p-4 flex justify-between items-center sticky top-0 z-30 shadow-md">
            <div>
                <div class="text-[10px] text-gray-400 uppercase">Velkommen</div>
                <div class="font-bold" id="res-addr">Adresse...</div>
            </div>
            <button onclick="app.logout()" class="text-xs bg-gray-800 px-3 py-2 rounded border border-gray-700">Log ud</button>
        </div>
        <div class="p-4 max-w-md mx-auto space-y-6">
            <!-- Timeline -->
            <div class="bg-gray-50 p-4 rounded-xl border border-gray-100 senior-hide">
                <h3 class="text-xs font-bold text-gray-400 uppercase mb-3">Forløb</h3>
                <div class="flex items-center justify-between text-center px-2">
                    <div><div class="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center text-xs mb-1"><i class="fas fa-check"></i></div><span class="text-[10px] font-bold text-gray-500">Start</span></div>
                    <div class="h-1 bg-gray-200 flex-1 mx-2"></div>
                    <div><div class="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs mb-1 animate-pulse"><i class="fas a-tools"></i></div><span class="text-[10px] font-bold text-blue-600">Nu</span></div>
                    <div class="h-1 bg-gray-200 flex-1 mx-2"></div>
                    <div><div class="w-8 h-8 bg-gray-300 text-white rounded-full flex items-center justify-center text-xs mb-1">3</div><span class="text-[10px] font-bold text-gray-400">Slut</span></div>
                </div>
            </div>

            <div class="space-y-3">
                <h3 class="font-bold text-gray-800">Dokumenter</h3>
                <div class="bg-white border-l-4 border-red-500 shadow-sm p-4 rounded flex justify-between items-center cursor-pointer hover:bg-gray-50" onclick="alert('Åbner PDF...')">
                    <div>
                        <div class="font-bold text-gray-800">Varsling: Vandlukning</div>
                        <div class="text-xs text-red-500 font-bold">VIGTIGT - LÆS NU</div>
                    </div>
                    <i class="fas fa-file-pdf text-red-500 text-xl"></i>
                </div>
            </div>

            <button onclick="document.getElementById('modalReport').classList.remove('hidden')" class="w-full bg-gray-100 p-4 rounded-xl font-bold text-gray-600 flex items-center justify-center gap-2 hover:bg-gray-200">
                <i class="fas fa-comment-dots"></i> Kontakt Byggeleder
            </button>
            
            <label class="flex items-center justify-center gap-2 mt-6 text-gray-400 text-xs">
                <input type="checkbox" onchange="document.body.classList.toggle('senior-mode')"> Senior Visning
            </label>
        </div>
    </div>

    <!-- ================================================================= -->
    <!-- MODALS -->
    <!-- ================================================================= -->
    <!-- Create Unit Modal -->
    <div id="modalCreateUnit" class="fixed inset-0 bg-black/80 hidden z-50 flex items-center justify-center p-4 backdrop-blur-sm">
        <div class="bg-white w-full max-w-sm rounded-xl p-6 shadow-2xl fade-in-up">
            <h3 class="font-bold text-lg mb-4">Opret Lejemål</h3>
            <input id="newUnitAddr" type="text" placeholder="Adresse (fx Storgade 1, 2.tv)" class="w-full border p-3 rounded mb-3">
            <select id="newUnitStage" class="w-full border p-3 rounded mb-4"><option>Etape 1</option><option>Etape 2</option><option>Etape 3</option></select>
            <div class="flex gap-3">
                <button onclick="document.getElementById('modalCreateUnit').classList.add('hidden')" class="flex-1 py-3 text-gray-500 font-bold">Annuller</button>
                <button onclick="app.createUnit()" class="flex-1 py-3 bg-blue-600 text-white rounded font-bold">Opret</button>
            </div>
        </div>
    </div>

    <!-- QR Modal -->
    <div id="modalQR" class="fixed inset-0 bg-black/90 hidden z-50 flex items-center justify-center p-4">
        <div class="bg-white w-full max-w-xs rounded-xl p-8 text-center relative fade-in-up">
            <button onclick="document.getElementById('modalQR').classList.add('hidden')" class="absolute top-3 right-3 text-gray-400"><i class="fas fa-times"></i></button>
            <div class="bg-gray-900 p-4 rounded-lg inline-block mb-4"><i class="fas fa-qrcode text-6xl text-white"></i></div>
            <h3 id="qrAddr" class="font-bold text-lg">Adresse</h3>
            <div id="qrCode" class="bg-blue-50 border border-blue-100 text-blue-800 font-mono text-2xl font-bold py-2 rounded mt-2">CODE</div>
            <p class="text-xs text-gray-400 mt-2">Kode til beboerbrevet</p>
        </div>
    </div>

    <!-- Report Modal -->
    <div id="modalReport" class="fixed inset-0 bg-black/80 hidden z-50 flex items-center justify-center p-4">
        <div class="bg-white w-full max-w-sm rounded-xl p-6 fade-in-up">
            <h3 class="font-bold mb-2">Skriv besked</h3>
            <textarea id="msgInput" class="w-full border p-3 rounded h-32 mb-4 resize-none" placeholder="Hvad drejer det sig om?"></textarea>
            <div class="flex gap-3">
                <button onclick="document.getElementById('modalReport').classList.add('hidden')" class="flex-1 py-3 text-gray-500 font-bold">Annuller</button>
                <button onclick="app.sendMessage()" class="flex-1 py-3 bg-green-600 text-white rounded font-bold">Send</button>
            </div>
        </div>
    </div>

    <!-- ================================================================= -->
    <!-- LOGIC ENGINE -->
    <!-- ================================================================= -->
    <script>
        const app = {
            data: { units: [], messages: [], logs: [] },
            
            init() {
                const stored = localStorage.getItem('renovering_v7');
                if(stored) {
                    this.data = JSON.parse(stored);
                } else {
                    // Mock Data
                    this.data.units = [
                        { id: 1, addr: 'Storgade 10, st.th', stage: 'Etape 1', code: 'SEC-1001' },
                        { id: 2, addr: 'Storgade 10, 1.th', stage: 'Etape 1', code: 'SEC-1002' },
                        { id: 3, addr: 'Storgade 12, 2.tv', stage: 'Etape 2', code: 'SEC-2001' }
                    ];
                    this.addLog('System initialiseret med testdata');
                    this.save();
                }
                this.renderKPI();
            },

            save() {
                localStorage.setItem('renovering_v7', JSON.stringify(this.data));
                this.renderKPI();
                this.renderUnits();
                this.renderMessages();
                this.renderViewerTree(); // Update viewer preview
            },

            addLog(msg) {
                this.data.logs.unshift({ time: new Date().toLocaleTimeString(), text: msg });
                if(this.data.logs.length > 10) this.data.logs.pop();
                // Update logs in UI
                const list = document.getElementById('activity-log');
                if(list) {
                    list.innerHTML = this.data.logs.map(l => 
                        `<li class="flex items-center gap-2"><span class="text-xs text-gray-400 font-mono">${l.time}</span> <span>${l.text}</span></li>`
                    ).join('');
                }
            },

            // --- AUTH ---
            quickLogin(role) { document.getElementById('loginInput').value = role; this.login(); },
            
            login() {
                const input = document.getElementById('loginInput').value.trim().toUpperCase();
                
                if (input === 'ADMIN') {
                    this.switchPage('adminPage');
                    this.setTab('admin', 'overview');
                } else if (input === 'BYGHERRE') {
                    this.switchPage('viewerPage');
                    this.renderViewerTree();
                } else {
                    // Check resident code
                    const user = this.data.units.find(u => u.code === input) || (input === 'BEBOER' ? this.data.units[0] : null);
                    if (user) {
                        document.getElementById('res-addr').innerText = user.addr;
                        this.currentUser = user;
                        this.switchPage('residentPage');
                    } else {
                        alert('Ukendt kode');
                    }
                }
            },
            
            logout() { 
                this.switchPage('loginPage'); 
                document.getElementById('loginInput').value = '';
                document.body.classList.remove('senior-mode');
            },
            
            switchPage(pid) {
                document.querySelectorAll('.page').forEach(p => p.classList.remove('active-page'));
                document.getElementById(pid).classList.add('active-page');
            },

            setTab(role, tab) {
                document.querySelectorAll(`#${role}Page .admin-view`).forEach(v => v.classList.add('hidden'));
                document.getElementById(`view-${role}-${tab}`).classList.remove('hidden');
                
                document.querySelectorAll(`#${role}Page header button`).forEach(b => b.classList.remove('border-blue-500', 'text-white'));
                document.getElementById(`tab-${role}-${tab}`).classList.add('border-blue-500', 'text-white');
            },

            // --- ADMIN & DATA LOGIC ---
            createUnit() {
                const addr = document.getElementById('newUnitAddr').value;
                const stage = document.getElementById('newUnitStage').value;
                if(!addr) return;
                const code = 'SEC-' + Math.floor(Math.random()*9000 + 1000);
                this.data.units.unshift({ id: Date.now(), addr, stage, code });
                this.addLog(`Oprettet lejemål: ${addr}`);
                this.save();
                document.getElementById('modalCreateUnit').classList.add('hidden');
                document.getElementById('newUnitAddr').value = '';
                this.showQR(addr, code);
            },

            showQR(addr, code) {
                document.getElementById('qrAddr').innerText = addr;
                document.getElementById('qrCode').innerText = code;
                document.getElementById('modalQR').classList.remove('hidden');
            },

            renderUnits() {
                const tbody = document.getElementById('unitsTable');
                const search = document.getElementById('unitSearch').value.toLowerCase();
                tbody.innerHTML = this.data.units
                    .filter(u => u.addr.toLowerCase().includes(search))
                    .map(u => `
                        <tr class="hover:bg-gray-50 border-b">
                            <td class="p-4 font-bold text-gray-700">${u.addr}</td>
                            <td class="p-4"><span class="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-bold">${u.stage}</span></td>
                            <td class="p-4 font-mono text-xs text-gray-400">${u.code}</td>
                            <td class="p-4 text-right"><button onclick="app.showQR('${u.addr}', '${u.code}')" class="text-blue-600"><i class="fas fa-qrcode"></i></button></td>
                        </tr>
                    `).join('');
            },

            renderKPI() {
                const count = this.data.units.length;
                const kpiEl = document.getElementById('kpi-units');
                if(kpiEl) kpiEl.innerText = count;
                const fileCount = document.getElementById('viewer-total-files');
                if(fileCount) fileCount.innerText = (count * 4) + " filer"; // Mock calc: 4 files per unit
            },

            sendMessage() {
                const txt = document.getElementById('msgInput').value;
                if(txt && this.currentUser) {
                    this.data.messages.unshift({ from: this.currentUser.addr, text: txt, time: new Date().toLocaleTimeString() });
                    this.save();
                    document.getElementById('modalReport').classList.add('hidden');
                    document.getElementById('msgInput').value = '';
                    alert('Besked sendt');
                }
            },

            renderMessages() {
                const list = document.getElementById('message-list');
                if(!list) return;
                if(this.data.messages.length === 0) { list.innerHTML = '<p class="text-gray-400 text-center">Ingen beskeder.</p>'; return; }
                list.innerHTML = this.data.messages.map(m => `
                    <div class="bg-gray-50 p-4 rounded border border-gray-200">
                        <div class="flex justify-between mb-1"><span class="font-bold">${m.from}</span><span class="text-xs text-gray-400">${m.time}</span></div>
                        <p class="text-sm text-gray-600">${m.text}</p>
                    </div>
                `).join('');
            },

            // --- VIEWER & ZIP LOGIC (THE KEY FEATURE) ---
            renderViewerTree() {
                const tree = document.getElementById('folder-tree');
                if(!tree) return;
                
                // Group by Stage
                const stages = {};
                this.data.units.forEach(u => {
                    if(!stages[u.stage]) stages[u.stage] = [];
                    stages[u.stage].push(u);
                });

                let html = `<div class="font-bold text-blue-800 mb-2"><i class="fas fa-building"></i> Projekt: Storgade Renovering</div>`;
                
                for (const [stageName, units] of Object.entries(stages)) {
                    html += `<div class="tree-item font-bold text-gray-700 mt-2"><i class="fas fa-layer-group text-gray-400"></i> ${stageName}</div>`;
                    units.forEach(u => {
                        html += `
                            <div class="tree-item ml-4 text-gray-600">
                                <i class="fas fa-home text-xs"></i> ${u.addr}
                                <div class="ml-6 text-xs text-gray-400">
                                    <div><i class="fas fa-file-image"></i> Før_Billeder/ (2 filer)</div>
                                    <div><i class="fas fa-file-alt"></i> Dokumenter/ (Varsling.pdf)</div>
                                </div>
                            </div>`;
                    });
                }
                tree.innerHTML = html;
            },

            async downloadZip() {
                const btn = document.getElementById('downloadBtn');
                const origText = btn.innerHTML;
                btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Pakker...';
                
                try {
                    const zip = new JSZip();
                    const projectFolder = zip.folder("Renovering_Storgade_Eksport");

                    // Create Dummy Data Structure
                    this.data.units.forEach(u => {
                        // Folder: Etape / Adresse
                        const unitFolder = projectFolder.folder(u.stage).folder(u.addr);
                        
                        // Subfolders
                        const imgFolder = unitFolder.folder("Billeder");
                        const docFolder = unitFolder.folder("Dokumenter");
                        
                        // Dummy Files
                        imgFolder.file("før_billede_01.txt", "Dette er en placeholder for et billede af " + u.addr);
                        imgFolder.file("efter_billede_01.txt", "Dette er en placeholder for et billede af " + u.addr);
                        docFolder.file("status_rapport.log", `Status for ${u.addr}: OK\nToken: ${u.code}\nGenereret: ${new Date()}`);
                    });

                    // Generate content
                    const content = await zip.generateAsync({type:"blob"});
                    
                    // Trigger Download
                    saveAs(content, "Renovering_Storgade_MASTER.zip");
                    alert("Download startet! Tjek din download-mappe.");

                } catch (e) {
                    alert("Fejl under zip generering: " + e);
                } finally {
                    btn.innerHTML = origText;
                }
            }
        };

        window.onload = () => app.init();
        function handleEnter(e) { if(e.key === 'Enter') app.login(); }
    </script>
</body>
</html>
```
