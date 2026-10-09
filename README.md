# Lentis — platformă optică medicală & marketplace (MVP Beta)

Site: https://lentis-optica.vercel.app/ · Repository: https://github.com/nistordaniel06-cpu/lentis

## Funcționează acum
- Homepage responsive, catalog demonstrativ, favorite/coș local (fără plăți).
- Proba virtuală: cameră sau fotografie, trei forme, ajustare manuală; detectare facială automată opțională via MediaPipe în browser. Nu trimite imagini către server. Doar simulare, fără măsurare pupilară medicală.
- SEO: meta title, canonical, descriere, Open Graph, schema.org Optician, robots.txt, sitemap.xml.
- Consimțământ explicit pentru analytics; fără cookie analytics înainte de accept.
- Admin UI disponibil pe ruta neafișată în navigație: `/atelier-console-7e4/`, dar **autentificarea este obligatorie**.

## Necesită conectare pentru funcționalitate persistentă
Panoul de administrare, publicarea produselor reale, parteneriatele reale și dashboard-ul de trafic folosesc un backend dedicat Supabase + Vercel Functions. **Nu sunt conectate până la configurarea unui proiect Supabase dedicat LentiS.** Nu utiliza un proiect Supabase existent, cu alt scop, fără a decide explicit acest lucru. Nu există parolă demo de administrator.

1. Creează un proiect Supabase dedicat LentiS (verifică întâi costurile). Rulează `supabase/001_lentis.sql` în SQL Editor.
2. Creează utilizatorul administrator în Supabase Auth > Users, apoi adaugă UUID-ul lui manual în `public.lentis_admins`.
3. În `config.js` adaugă URL-ul Supabase și cheia **publishable** (anon, sigură pentru client) — **NU cheia service-role**. Setează `partnerSubmissionEnabled: true` și `analyticsEnabled: true` doar după deploy API.
4. În Vercel: `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `LENTIS_ORIGIN=https://lentis-optica.vercel.app`, `LENTIS_ANALYTICS_SALT` (secret aleatoriu suficient de lung). Exclusiv server-side, fără prefix VITE_ sau NEXT_PUBLIC_.
5. Activează protecție anti-spam (Turnstile) și rate limiting persistent înainte de colectarea cererilor reale.
6. Actualizează politica de confidențialitate, perioada de retenție, consimțământul și datele operatorului. Configurează ștergerea datelor analytics după 90 zile (sau interval aprobat), plus export/ștergere.
7. Pagina SEO poate fi editată în studio, dar metadatele crawlerelor sunt statice în `index.html`: sincronizează-le cu build-ul/SSR pentru modificări SEO vizibile motoarelor de căutare. Indexare după trecerea în producție reală.

## Securitate
- URL-ul „ascuns” nu este o măsură de securitate. Accesul admin cere Supabase Auth și apartenența la `lentis_admins` verificată prin RLS.
- Adminul nu poate gestiona date când Supabase nu este conectat; nu există fake-login / parolă în JS.
- Serviciile API necesită cheie secretă doar pe server. Nici o fotografie de cameră nu este încărcată.
- Analiza traficului necesită consimțământ; IP-ul brut nu se salvează; se reține un hash cu rotație zilnică și țara derivată din infrastructura serverului.
- Consent cookies și localStorage nu reprezintă o evidență GDPR completă; revizia juridică este necesară înainte de colectarea reală.

## Lansare locală
`npm run dev` → `http://localhost:5173` (serverul local nu execută funcțiile `/api`; pentru acestea este necesar Vercel). `npm run build` produce `dist/`, care poate fi servit static. Pentru Vercel folosește codul din rădăcina repo-ului, cu funcțiile din `api/`.

## Roadmap
- Faza 1: Foto/cameră try-on și admin securizat pregătit; SEO; consimțământ.
- Faza 2: Database dedicated + auth/RLS, produse reale & stock, validare clinici, lead ledger, inbox.
- Faza 3: facial tracking robust testat mobil, potrivirea ramelor pe lățimea feței și măsurători optice calibrate (numai cu validare specialist); galerie produse multi-angle.
- Faza 4: rezervări clinici, comisioane doar pentru conversii confirmate, plăți și e-factura / POS.