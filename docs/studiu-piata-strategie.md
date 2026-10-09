# Lentis — studiu rapid de piață și strategia de diferențiere
Data analizei: 9 octombrie 2026. Surse publice, nu audit exhaustiv sau test comparativ al ofertelor.

## România — repere verificate
- **Lensa**: aplicație cu probă virtuală, salvare și partajare rezultate. https://lp.lensa.ro/app-virtual-try-on/
- **Videt**: probă virtuală online pentru mii de rame și stilist virtual cu scanarea formei feței. https://www.videt.ro/ochelari-de-vedere-cu-proba-virtuala.html și https://www.videt.ro/
- **Optica la Domiciliu / Metec**: servicii optice la domiciliu și reglaje/asistență. https://optica-ladomiciliu.ro/
- **OptiLife**: optică mobilă și servicii corporate la birou. https://www.optilife.ro/

Concluzie: nici proba virtuală, nici consultațiile mobile **nu sunt funcții unice** pe piața românească. Nu afirmăm că o funcție lipsește din absolut toate site-urile din România fără o cercetare sistematică.

## Internațional — idei relevante
- **Warby Parker Advisor** combină scanarea feței, aprecierea modelelor și recomandări personalizate. https://www.warbyparker.com/advisor
- **Zenni** leagă proba virtuală de potrivire, distanță interpupilară (PD), rețetă, configurarea lentilelor și cumpărare. https://www.zennioptical.com/help/frames-fitting/virtual-try-on
- **Warby Parker** oferă pe web probare și în aplicație recomandări de dimensiune pentru rame. https://www.warbyparker.com/ways-to-try

## Teza de produs
**Lentis Smart Vision: «Probează → compară → cere părerea specialistului → rezervă → cumpără».**
Să combinăm 3 fluxuri: magazin e-commerce, optică mobilă pentru acasă/birou și marketplace deschis cu clinici independente. Conexiunea operațională dintre probare, rezervare și urmărirea comisioanelor este mai interesantă decât simpla funcție AR.

## Ce adăugăm, în ordinea impactului
1. **Virtual try-on web** (beta realizată): cameră sau fotografie, ramă ajustabilă, analiză față locală opțională. Nu certifică mărimi/PD și nu face diagnostic.
2. **Fit Match™**: utilizatorul introduce lățimea vechii rame, puntea și brațele sau folosește o scanare calibrată; produse filtrate după dimensiunile fizice reale și stil. Nu estima dioptrii din cameră.
3. **Ask an Optometrist**: trimite o listă de 3 rame și solicită recomandare din partea specialistului Lentis / unei clinici. Cu consimțământ pentru procesarea foto dacă e trimisă către specialist.
4. **Partner Lead Ledger**: sursa clientului, consimțământ, statut (nou/contactat/programat/prezentat/conversie), atribuire și comision după confirmarea reală a conversiei — protecție la duplicare.
5. **«Consult la tine»** cu disponibilitate pe zone: clientul introduce localitate/cartierul, vede dacă optica mobilă acoperă zona și solicită slot, fără promisiuni false despre timp.
6. **Family Vision**: profiluri opt-in ale membrilor familiei, reminder pentru controale, schimbarea lentilelor și păstrarea rețetelor; datele medicale necesitând protecție suplimentară și bază legală validă.
7. **Corporate Vision Days**: cereri de screening optometric pentru companii, pachete/beneficii și planner logistic.
8. **Preț total transparent**: ramă + lentile + tratamente + montaj + livrare, clar înainte de checkout; compararea produselor la nivel de parametri.

## Admin panel: versiunea corectă
- Stoc & produse cu categorii, imagini, prețuri și publicare.
- Editarea principalelor texte, a motto-ului, a temei și a logo-ului.
- Cereri de parteneriat + status, ulterior contracte, procente și ledger.
- Statistică agregată (sesiuni consimțite, țări, vizite pe pagini). Istoric autentificări admin separat; fără supraveghere invazivă.
- Audit log pentru schimbările de produse & setări.
- Autentificare server-backed + autorizare RLS; URL-ul neafișat în meniu nu este securitate.

## Prioritizare de lansare
### Săptămânile 1–2
Alegere bazei de date și configurare autentificare, produse reale, formulare clinici cu protecție anti-spam, test funcția AR pe mobile, SEO de bază + consimțământ cookie.
### Săptămânile 3–4
Preview produse după lățime, rezervări clienți și parteneri (manual sau automat), procesare solicitări, email tranzacțional, monitorizare erori.
### Luna 2
Plăți & logistică, jurnal de lead-uri cu comisioane, parteneriate pilot cu 3–5 clinici, validare măsurători optice, date structurate Product pentru produse reale.
### Luna 3
Măsurarea conversiei, A/B teste, Fit Match pe dimensiuni reale, corporate vision days.

## Metrici utile
- try-on → click pe produs; try-on → consult; lead → programare; programare → prezentare; rată de anulare; conversii verificabile/clinică; revenue per lead; marja netă după comision; costul achiziției.

## GDPR și securitate
Datele de trafic (IP inclusiv) sunt date personale. Colectăm doar cu temei adecvat, minimizăm retenția, nu folosim IP pentru profilare fără informare. Analytics cu opt-in, hash zilnic și țară, 90 zile sau politică aprobată. Nu colectăm și nu stocăm imagini de cameră la proba virtuală. Pentru imagini transmise specialistului e necesar un flux separat cu consimțământ și retenție.

Surse privind IP: https://commission.europa.eu/law/law-topic/data-protection/data-protection-explained_en și politica de cookie-uri https://commission.europa.eu/cookies-policy_ro