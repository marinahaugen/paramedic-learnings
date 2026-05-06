import { loadEnvConfig } from "@next/env";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { sources, topics } from "../src/db/schema";

loadEnvConfig(process.cwd());

const client = postgres(process.env.DATABASE_URL!);
const db = drizzle(client);

const seedTopics = [
  // PROSEDYRE – step-by-step clinical procedures
  {
    topicType: "Prosedyre",
    title: "Hypotermi – aktiv oppvarming",
    area: "Akuttmedisin",
    owner: "Medisinsk fagansvarlig",
    summary:
      "Håndtering og aktiv oppvarming av hypoterme pasienter prehospitalt, inkludert vurdering av kjernetemperatur og transportbeslutning.",
    guidance: `Vurder alltid hypotermi ved kjernetemperatur under 35 °C.

Mild hypotermi (32–35 °C):
– Fjern våte klær og beskytt mot vind
– Passiv oppvarming med tepper og varmepakker i aksiller og lyske
– Overvåk EKG kontinuerlig

Moderat hypotermi (28–32 °C):
– Aktiv ekstern oppvarming (varme tepper, varmluft)
– Unngå unødvendig bevegelse – risiko for VF
– Tilkall ALS-ressurs om tilgjengelig

Alvorlig hypotermi (< 28 °C):
– IKKE erklær pasienten død uten oppvarming til ≥ 32 °C
– Prioriter transport til sykehus med ECMO-kapasitet
– Følg lokalt HLR-protokoll for hypotermi

Monitorering underveis: SpO2, EKG, puls hvert 5. minutt.`,
    rationale: `Hypoterme pasienter har overlevd etter langvarig hjertestans fordi nedkjøling gir nevroprotektiv effekt. Prinsippet "not dead until warm and dead" er godt dokumentert [1][2]. ECMO gir mulighet for oppvarming med bevart sirkulasjon og er tilgjengelig ved OUS og Haukeland [3].`,
  },
  {
    topicType: "Prosedyre",
    title: "Luftveishåndtering – RSI prehospitalt",
    area: "Luftvei",
    owner: "Anestesifaglig leder",
    summary:
      "Rapid Sequence Induction (RSI) i prehospital setting, inkludert indikasjoner, legemidler og fallback-strategi ved mislykket intubasjon.",
    guidance: `Indikasjoner:
– GCS ≤ 8 med manglende beskyttende luftveisreflekser
– Respirasjonssvikt som ikke responderer på NIV
– Forventet forverring under transport

Forberedelse:
– Forhåndsoxygenering 3 min ved BVM eller høyflow-maske
– Video-laryngoskop som primærvalg
– Kirurgisk luftvei-kit klart

Legemidler:
– Ketamin 1–2 mg/kg IV (valg ved hemodynamisk ustabilitet)
– Rokuroniumbromid 1,2 mg/kg IV
– Alternativ: Etomidat 0,3 mg/kg + suksametonium 1,5 mg/kg

Etter intubasjon:
– Bekreft med kapnografi (EtCO2 35–45 mmHg)
– Sedering: Midazolam 0,05 mg/kg + fentanyl 1–2 µg/kg

Mislykket intubasjon (2 forsøk):
– Supraglottisk luftvei (iGel eller LMA)
– Kirurgisk luftvei ved "can't intubate, can't oxygenate"`,
    rationale: `RSI prehospitalt utføres kun av lege eller spesialparamedic. Video-laryngoskopi øker suksessraten ved vanskelig luftvei [1]. Kapnografi er obligatorisk for å bekrefte korrekt plassering [2].`,
  },
  {
    topicType: "Prosedyre",
    title: "Alvorlig allergisk reaksjon og anafylaksi",
    area: "Akuttmedisin",
    owner: "Medisinsk fagansvarlig",
    summary:
      "Gjenkjenning og akuttbehandling av anafylaksi prehospitalt. Adrenalin er hjørnesteinen og skal gis raskt.",
    guidance: `Diagnosekriterier (ett av to):
1. Akutt innsettende symptomer fra hud/slimhinner + luftvei eller sirkulasjon
2. Kjent allergen-eksponering + ≥ 2 organsystemer affisert

Umiddelbar behandling:
1. Adrenalin 0,5 mg IM (lårmuskelen) – første prioritet
   – Barn < 25 kg: 0,15 mg (EpiPen Junior)
   – Kan repeteres etter 5 min
2. Legg pasienten flatt med bena hevet
3. Oksygen 15 l/min via maske
4. IV-tilgang: NaCl 0,9 % 500–1000 ml ved hypotensjon

Tilleggsbehandling:
– Antihistamin (clemastin 2 mg IV) – etter adrenalin, ikke istedenfor
– Kortikosteroid (hydrokortison 200 mg IV) – forhindrer bifasisk reaksjon
– Salbutamol inhalasjon ved bronkospasme

Observasjon minimum 4 timer etter adrenalinbehandling.`,
    rationale: `Adrenalin IM til lårmuskelen gir høyere og raskere plasmakonsentrasjon enn subkutan injeksjon [1]. Forsinkelse er den vanligste årsaken til dødelig utfall. Antihistaminer behandler symptomer men påvirker ikke bronkospasme eller hypotensjon [2].`,
  },

  // PROTOKOLL – systematic decision frameworks
  {
    topicType: "Protokoll",
    title: "STEMI – prehospital aktivering og behandling",
    area: "Hjerte-kar",
    owner: "Kardiologisk faggruppe",
    summary:
      "Protokoll for rask identifikasjon av ST-elevasjonsinfarkt og direkte PCI-aktivering. Mål: D2B-tid under 90 minutter.",
    guidance: `1. Ta 12-avlednings-EKG innen 10 minutter etter kontakt.

2. STEMI-kriterier:
   – ST-elevasjon ≥ 2 mm i ≥ 2 tilstøtende precordialavledninger
   – ST-elevasjon ≥ 1 mm i ≥ 2 ekstremitetsavledninger
   – Nytt venstre grenblokk med typiske symptomer

3. Varsle PCI-senter umiddelbart via AMK. Send EKG digitalt.

4. Behandling under transport:
   – ASA 300 mg PO (ikke ved aktiv blødning)
   – Oksygen kun ved SpO2 < 94 %
   – Nitroglyserin ved SBP > 100 mmHg
   – Morfin 2–4 mg IV ved smerter ≥ 7/10

5. IKKE forsinke transport for ytterligere diagnostikk.`,
    rationale: `Tid er myokard – for hver 30 min forsinkelse øker mortaliteten med ~7,5 %. Prehospital EKG og direkte PCI-aktivering er standard of care per ESC 2023 [1]. Rutineoksygen er kontraindisert da hyperoksi øker infarktområdet [2].`,
  },
  {
    topicType: "Protokoll",
    title: "Sepsis – tidlig gjenkjenning og behandling",
    area: "Infeksjon",
    owner: "Infeksjonsmedisinsk faggruppe",
    summary:
      "Prehospital screening og initial behandling av sepsis. Tidlig varsling til sykehus og rask transport er avgjørende.",
    guidance: `qSOFA-screening (≥ 2 = mistanke om sepsis):
– Respirasjonsfrekvens ≥ 22/min
– Endret mental status (GCS < 15)
– Systolisk BT ≤ 100 mmHg

Ved mistanke:
1. Varsle sykehuset med "Sepsis-varsling"
2. Veneflon – ta blodprøver om det ikke forsinker transport
3. Oksygen ved SpO2 < 94 %
4. Væske: NaCl 0,9 % 500 ml IV over 15 min ved SBP ≤ 90 mmHg
   – Revurder etter bolus (krepitasjoner, BT-respons)

Septisk sjokk (SBP < 90 tross væske):
– Noradrenalin 0,1–0,3 µg/kg/min via perifer vene
– Tilkall lege

Ikke gi antibiotika prehospitalt – forsinker ikke transport og gir falsk trygghet.`,
    rationale: `"Sepsis-1-time-bundle": antibiotika innen 1 time og adekvat væske reduserer mortalitet med 20–30 % [1]. Prehospital varsling gir sykehuset tid til å forberede behandlingsteam [2].`,
  },
  {
    topicType: "Protokoll",
    title: "Pediatrisk hjertestans – HLR og legemiddeldosering",
    area: "Pediatri",
    owner: "Barnemedisinsk faggruppe",
    summary:
      "HLR og legemiddeldosering ved hjertestans hos barn under 16 år. Inkluderer vektbaserte doser og alderstilpasset utstyr.",
    guidance: `Kompresjonsdybde:
– Spedbarn (< 1 år): 4 cm (2 fingre)
– Barn 1–8 år: 5 cm (1 hånd)
– Barn > 8 år: 5–6 cm (2 hender)
Frekvens: 100–120/min, ratio 15:2 (2 reddere)

Vektestimat:
– 0–12 mnd: (alder i mnd / 2) + 4
– 1–5 år: (alder × 2) + 8
– 6–12 år: (alder × 3) + 7

Adrenalin: 0,01 mg/kg IV/IO (maks 1 mg), hvert 3.–5. minutt
Defibrillering: 4 J/kg ved VF/pulsløs VT – bruk pediatrisk demper < 25 kg
IO-tilgang: Tibia proximalt ved to mislykkede IV-forsøk`,
    rationale: `Pediatrisk hjertestans er oftest sekundær til respirasjonsstans. Kompresjonsdybde ≥ 1/3 av brystdiameter er viktigere enn absolutt dybde [1]. Høydose adrenalin bedrer ROSC men gir dårligere nevrologisk utfall [2].`,
  },

  // RETNINGSLINJE – policy/guideline-level topics
  {
    topicType: "Retningslinje",
    title: "Hjerneslag – FAST og prehospital håndtering",
    area: "Nevrologi",
    owner: "Nevrologisk fagansvarlig",
    summary:
      "Retningslinje for rask gjenkjenning av akutt hjerneslag og optimalisert transport til nærmeste slagsenter.",
    guidance: `FAST-screening:
– Face: Ensidig ansiktshengning
– Arm: Armsvakhet – be pasienten løfte begge armer
– Speech: Taleforstyrrelse
– Time: Tidspunkt for symptomdebut

Positiv FAST = varsle slagsenter umiddelbart.

Prehospitale tiltak:
1. Nøyaktig debut-tidspunkt – kritisk for trombolysevurdering (vindu 4,5 t)
2. Blodglukose – utelukk hypoglykemi som mimic
3. BT: IKKE senk prehospitalt (tolerabelt inntil 220/120 ved iskemisk slag)
4. Hodeleie 30° ved bevissthetspåvirkning; flatt ved hemodynamisk ustabilitet
5. IV-tilgang – IKKE gi væske rutinemessig

Utelukk mimics: hypoglykemi, komplisert migrene, Todd's parese`,
    rationale: `Hvert minutt tapes ~1,9 millioner nevroner. Trombolyse er effektivt innen 4,5 t og trombektomi innen 24 t ved stor karklusning. Prehospital varsling øker andelen som når behandlingsvinduet [1][2].`,
  },
  {
    topicType: "Retningslinje",
    title: "Smerte – prehospital smertelindring",
    area: "Smertebehandling",
    owner: "Anestesifaglig leder",
    summary:
      "Systematisk vurdering og farmakologisk smertelindring prehospitalt. Multimodal analgesi med minst mulig opioidforbruk.",
    guidance: `Vurdering: NRS 0–10, FLACC for barn < 3 år, CPOT for intubert pasient.

Lett smerte (NRS 1–3):
– Paracetamol 1 g PO eller IV

Moderat smerte (NRS 4–6):
– Ketorolak 30 mg IV (unngå ved nyresvikt, GI-blødning, alder > 65 år)
– Esketamin intranasalt 0,5 mg/kg (ved vanskelig IV-tilgang)

Alvorlig smerte (NRS 7–10):
– Morfin 2–4 mg IV titrert, maks 0,1 mg/kg
– Fentanyl 1–2 µg/kg IV ved hemodynamisk ustabilitet
– Esketamin 0,3 mg/kg IV som adjuvans

Spesielle hensyn:
– Eldre: reduser morfin-startdose med 50 %
– Traume: smertelindring skal ikke forsinke transport
Dokumenter NRS før og etter hvert tiltak.`,
    rationale: `Undermedisinering av smerte er dokumentert i prehospital sektor og gir dårligere kliniske utfall. Multimodal analgesi gir bedre effekt med lavere opioidforbruk [1]. Intranasalt esketamin er validert som effektiv og sikker rute [2].`,
  },

  // VEILEDNING – educational/contextual guidance
  {
    topicType: "Veiledning",
    title: "Kommunikasjon med pårørende på skadested",
    area: "Kommunikasjon",
    owner: "Fagansvarlig opplæring",
    summary:
      "Veiledning for god kommunikasjon med pårørende i akutte og traumatiske situasjoner. Inkluderer krisekommunikasjon og dødsbud.",
    guidance: `Første kontakt:
– Presenter deg med navn og rolle
– Finn ett kontaktpunkt blant pårørende om mulig
– Gi kort, ærlig informasjon om situasjonen – unngå faguttrykk
– Ikke gi løfter om utfall

Under behandling:
– Gi jevnlige korte oppdateringer (hvert 5.–10. minutt)
– Tillat pårørende å være til stede ved HLR hvis de ønsker det
– Ha alltid én person dedikert til pårørendekontakt

Dødsbud prehospitalt:
– Bekreft identitet og relasjon til avdøde
– Bruk klare ord: "Han/hun er død" – ikke eufemismer
– Si hva som ble gjort, at alt mulig ble forsøkt
– Gi tid til reaksjon – ikke hast videre
– Informer om videre prosess (politioppgaver, sykehus)

Etterkontakt:
– Lever eventuelt personlige eiendeler
– Informer AMK om at pårørende er informert`,
    rationale: `Pårørende som er til stede under HLR rapporterer lavere grad av PTSD og sorgkomplikasjoner. Klar, direkte kommunikasjon reduserer usikkerhet og gir bedre grunnlag for bearbeiding av tap. Studier viser at pårørende ønsker tilstedeværelse og ærlighet fremfor beskyttelse fra situasjonen.`,
  },
  {
    topicType: "Veiledning",
    title: "Dokumentasjon og journalføring prehospitalt",
    area: "Administrasjon",
    owner: "Kvalitetsleder",
    summary:
      "Krav og anbefalinger for korrekt prehospital journalføring. God dokumentasjon sikrer kontinuitet i behandlingskjeden og ivaretar juridiske krav.",
    guidance: `Obligatoriske felt (alle oppdrag):
– Klokke: varsling, ankomst, avreise, ankomst sykehus
– Pasientidentitet: navn, fødselsdato, adresse
– Vitalia ved ankomst og ved overlevering
– Funn og vurdering (ABCDE-systematikk)
– Tiltak og respons på tiltak
– Legemidler: navn, dose, rute, tidspunkt, effekt
– Overlevering: til hvem, hva ble formidlet

Viktige prinsipper:
– Dokumenter fortløpende – ikke i etterkant
– Bruk SBAR-strukturen ved overlevering
– Negative funn er like viktige som positive
– Pasientens egne ord i anførselstegn

Særlig ved:
– HLR: tidspunkt for stans, start og avslutning
– Avvik: dokumenter i eget avviksskjema i tillegg
– Mindreårige: alltid dokumenter pårørendekontakt`,
    rationale: `Mangelfull dokumentasjon er en av de hyppigste kildene til klager og juridiske tvister mot ambulansetjenesten. God prehospital journal sikrer at mottakende sykehus har grunnlag for raske beslutninger og reduserer risiko for medikamentfeil ved overlevering.`,
  },

  // SJEKKLISTE – checklist-format topics
  {
    topicType: "Sjekkliste",
    title: "Ambulansesjekk – daglig utstyrssjekk",
    area: "Drift og utstyr",
    owner: "Driftsansvarlig",
    summary:
      "Sjekkliste for daglig kontroll av ambulanseutstyr og legemidler. Skal gjennomføres ved vaktstart og signeres i logg.",
    guidance: `KJØRETØY
☐ Drivstoff ≥ 3/4 tank
☐ Blålys og sirene fungerer
☐ Oksygentank: trykk ≥ 100 bar (byttes ved < 50 bar)
☐ Sugeapparat: test sug
☐ Strekk på båre og fixaturer

MEDISINSK UTSTYR
☐ Hjertestarter: ladt, elektroder tilkoblet, testimpuls OK
☐ Monitor/defibrillator: batteri ≥ 80 %
☐ Pulsoksymeter og kapnograf: fungerer
☐ BVM i alle størrelser (spedbarn, barn, voksen)
☐ Intubasjonsutstyr: tuber, laryngoskop, videolaryngoskop
☐ IO-drill: batteri OK, nåler på plass

LEGEMIDLER (kontroller dato og mengde)
☐ Adrenalin 1 mg/ml (minimum 5 ampuller)
☐ Morfin 10 mg/ml
☐ Midazolam
☐ ASA 300 mg
☐ Nitroglyserin
☐ Salbutamol inhalasjon
☐ Glukose 50 mg/ml
☐ Nalokson

DOKUMENTASJON
☐ Signeringslogg fylt ut med dato og initialer`,
    rationale: `Daglig utstyrssjekk er lovpålagt (forskrift om ambulansetjeneste § 14) og en forutsetning for pasientsikkerhet. Manglende utstyr eller legemidler ved akuttoppdrag er et alvorlig avvik som kan ha fatale konsekvenser.`,
  },
  {
    topicType: "Sjekkliste",
    title: "ATMIST – overlevering til sykehus",
    area: "Kommunikasjon",
    owner: "Fagansvarlig opplæring",
    summary:
      "Strukturert overlevering av pasient ved ankomst sykehus ved hjelp av ATMIST-malen. Sikrer at kritisk informasjon formidles raskt og komplett.",
    guidance: `A – Alder og kjønn
   "67 år gammel mann"

T – Tid/hendelse
   "Funnet bevisstløs kl. 14:22, estimert liggetid 2 timer"

M – Mekanisme/sykdomsbilde
   "Fall fra egen høyde, slag mot bakhodet. Initialt GCS 8."

I – Injuries / Funn
   "Kutt i occipitalt hårfeste, høyre pupill lysreaksjon treg. Ingen øvrige ytre skader."

S – Symptomer og vitalia
   "BT 148/92, puls 58, SpO2 96 % på 4L O2, GCS nå 10 (E3V3M4)"

T – Treatment / Behandling
   "Nakkekrage, IV-tilgang høyre arm, 250 ml NaCl, ingen legemidler gitt"

Tips:
– Hold overlevering under 60 sekunder
– Gi rapporten til ansvarlig mottakssykepleier eller lege direkte
– Vent på kvittering – bekreft at informasjonen er mottatt`,
    rationale: `Strukturert overlevering med ATMIST eller tilsvarende verktøy reduserer informasjonstap ved overflytting og er anbefalt av Helsedirektoratet. Studier viser at ustrukturert verbal overlevering har opp til 40 % informasjonstap.`,
  },
];

const seedSources: { topicTitle: string; sources: Array<{ title: string; content: string; url?: string; description?: string }> }[] = [
  {
    topicTitle: "Hypotermi – aktiv oppvarming",
    sources: [
      { title: "Brown et al. – Accidental Hypothermia (NEJM 2012)", content: "Oversikt over håndtering av aksidentell hypotermi, inkludert ECMO-indikasjon.", url: "https://doi.org/10.1056/NEJMra1114208", description: "Oversikt over håndtering av aksidentell hypotermi, inkludert ECMO-indikasjon." },
      { title: "Scandinavian guidelines for hypothermia 2020", content: "Nordiske retningslinjer for prehospital og hospitalt behandling.", url: "https://doi.org/10.1186/s13049-020-0764-3", description: "Nordiske retningslinjer for prehospital og hospitalt behandling." },
      { title: "ECMO-protokoll OUS 2023", content: "Intern protokoll for ekstra-korporeal oppvarming ved dypt hypotermi, Oslo universitetssykehus.", description: "Intern protokoll for ekstra-korporeal oppvarming ved dypt hypotermi, Oslo universitetssykehus." },
    ],
  },
  {
    topicTitle: "STEMI – prehospital aktivering og behandling",
    sources: [
      { title: "ESC Guidelines for STEMI 2023", content: "Europeiske retningslinjer for håndtering av ST-elevasjonsinfarkt.", url: "https://doi.org/10.1093/eurheartj/ehad191", description: "Europeiske retningslinjer for håndtering av ST-elevasjonsinfarkt." },
      { title: "AVOID-studien – Air vs Oxygen in STEMI", content: "Rutineoksygen økte infarktområdet sammenlignet med romluft.", url: "https://doi.org/10.1161/CIRCULATIONAHA.114.014494", description: "Rutineoksygen økte infarktområdet sammenlignet med romluft." },
    ],
  },
  {
    topicTitle: "Sepsis – tidlig gjenkjenning og behandling",
    sources: [
      { title: "Surviving Sepsis Campaign 2021", content: "Internasjonale retningslinjer for sepsis og septisk sjokk.", url: "https://doi.org/10.1097/CCM.0000000000005337", description: "Internasjonale retningslinjer for sepsis og septisk sjokk." },
      { title: "Seymour et al. – Time to Treatment and Mortality in Sepsis (NEJM 2017)", content: "Klar dose-respons mellom tid til antibiotika og mortalitet.", url: "https://doi.org/10.1056/NEJMoa1603058", description: "Klar dose-respons mellom tid til antibiotika og mortalitet." },
    ],
  },
  {
    topicTitle: "Alvorlig allergisk reaksjon og anafylaksi",
    sources: [
      { title: "Simons et al. – IM vs SC adrenalin absorption", content: "IM i lårmuskelen gir raskere og høyere plasmakonsentrasjon enn subkutan injeksjon.", url: "https://doi.org/10.1016/S0091-6749(98)70326-3", description: "IM i lårmuskelen gir raskere og høyere plasmakonsentrasjon enn subkutan injeksjon." },
      { title: "WAO Guidelines for Anaphylaxis 2020", content: "Internasjonale retningslinjer fra World Allergy Organization.", url: "https://doi.org/10.1186/s40413-020-00287-1", description: "Internasjonale retningslinjer fra World Allergy Organization." },
    ],
  },
];

async function seed() {
  console.log("Seeding topics...");
  const inserted = await db.insert(topics).values(seedTopics).returning();
  console.log(`Inserted ${inserted.length} topics.`);

  const titleToId = Object.fromEntries(inserted.map((t) => [t.title, t.id]));

  let sourceCount = 0;
  for (const group of seedSources) {
    const topicId = titleToId[group.topicTitle];
    if (!topicId) continue;
    for (const s of group.sources) {
      await db.insert(sources).values({ topicId, ...s });
      sourceCount++;
    }
  }

  console.log(`Inserted ${sourceCount} sources.`);
  await client.end();
}

seed().catch((e) => { console.error(e); process.exit(1); });
