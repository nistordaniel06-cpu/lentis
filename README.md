# Lentis · Optică medicală & marketplace

Prima versiune a website-ului **Lentis**, inspirată ca structură de site-urile de optică online, cu brandingul original Lentis (ochi albastru + triunghi și numele cu `s` mic).

## Date oficiale de contact (din cartea de vizită furnizată)

- Brand: **Lentis — Optică Medicală Mobilă**
- Slogan: **„Vedere clară, oriunde ai nevoie!”**
- Reprezentant: **Andrei Hâlcu**, Administrator | Tehnician optometrist
- Telefon: **0774 987 055** (`tel:+40774987055`)
- Adresă de contact: **Prel. Ghencea nr. 94–100, Sector 6, București**
- Facebook (nume afișat): **Optica Lentis**; linkul este de căutare Facebook până la confirmarea URL-ului paginii oficiale.
- Servicii: **consultații optometrice**, **ochelari de vedere**, **lentile de contact**, **la domiciliu / la firmă** (disponibilitatea se confirmă telefonic).

Nu se presupune că la adresă există o clinică cu program permanent; spațiul ilustrat în machetă nu reprezintă o fotografie reală.

## Ce funcționează acum

- Homepage premium și responsive (desktop / tabletă / mobil)
- Catalog demonstrativ, filtrare după categorie, căutare, sortare după preț
- Favorite și coș cu cantități, persistente în `localStorage`
- Secțiune pentru optica medicală Lentis și contact telefonic
- Formular demonstrativ de înscriere a clinicilor; datele sunt salvate **numai în browserul utilizatorului**, nu trimise nicăieri
- Ferestre explicative pentru programare, comandă și probă virtuală (încă neconectate)
- Elemente SEO de bază, navigare accesibilă, layout fără dependențe grele

**Atenție:** Acesta este un prototip de interfață, nu un magazin operațional. Produsele, prețurile și imaginile de produs sunt **exemple vizuale**, nu oferte comerciale validate. Coșul nu procesează plăți, formularul nu trimite solicitări, programările nu sunt înregistrate. Pentru lansare: integrare backend, inventar real, procesator de plăți, gestionare comenzi, GDPR, email-uri, loguri de consimțământ, contracte cu clinici și un mecanism verificabil de atribuire/comisionare a lead-urilor.

## Rulare locală

```bash
npm run dev
```

Pentru build static:

```bash
npm run build
npm run preview
```

## Publicare pe GitHub Pages

1. Creează un repository **public** gol pe GitHub cu numele `lentis` (nu adăuga README automat dacă încarci proiectul complet).
2. Încarcă toate fișierele acestui proiect pe branch-ul `main`, inclusiv `.github/workflows/deploy.yml`.
3. În **Settings → Pages → Build and deployment**, alege **GitHub Actions**.
4. GitHub Actions va construi site-ul Vite și îl va publica la `https://<user>.github.io/lentis/`, după finalizarea cu succes a workflow-ului.

Logo-ul oficial utilizat este derivat din prima variantă aleasă, fără modificări de identitate.

## Roadmap

1. Backend: autentificare, conturi client, catalog/inventar și panou admin
2. Comenzi reale + plăți + facturare, stoc, retururi și notificări
3. Portal clinici: verificare, servicii, calendar, programări și comision/lead atribuit
4. Test virtual bazat pe cameră numai cu consimțământ și respectarea datelor biometrice
5. Analitice, SEO avansat, performanță și publicare pe domeniu propriu