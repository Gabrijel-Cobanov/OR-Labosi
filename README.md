# Skup podataka o stripovima

Ovaj skup podataka sadrži informacije o popularnim stripovima, uključujući Spider-Man i Batman stripove, obuhvaćajući različite priče, autore i umjetnike. Skup podataka je strukturiran tako da omogućuje istraživanje ključnih metapodataka, uključujući detalje o objavi, likovima i ulogama autora.

## Metapodaci

- **Licenca**: Apache License 2.0
- **Autor**: Vaše ime i prezime
- **Verzija skupa podataka**: 1.0
- **Jezik**: Engleski
- **Veličina skupa podataka**: 10 unosa, s atributima vezanim uz detalje o objavi stripova
- **Sustav za upravljanje bazom podataka**: PostgreSQL
- **Atributi**:
  - `publisher`: Ime izdavača stripa (npr. Marvel, DC Comics)
  - `publisher_country`: Zemlja u kojoj je izdavač smješten
  - `title`: Naslov stripa
  - `writers`: Popis pisaca koji su doprinijeli priči
  - `artists`: Popis umjetnika koji su radili na stripu (npr. crtači, inkeri, koloristi)
  - `main_character`: Glavni lik u stripu (npr. Spider-Man, Batman)
  - `side_characters`: Sporedni likovi u stripu
  - `story_arc`: Glavna priča ili događaj u stripu
  - `comic_number`: Broj izdanja stripa
  - `date_published`: Datum objavljivanja stripa
  - `number_of_pages`: Ukupan broj stranica u stripu
  - `genre`: Žanr stripa (npr. Superherojski)

## Objašnjenje licence

Ovaj skup podataka licenciran je pod **Apache License 2.0**. Ova licenca dopušta korisnicima da koriste podatke u bilo koje svrhe, uključujući komercijalne projekte, pod uvjetom da dodaju odgovarajuću obavijest o autorskim pravima i licencu u sve distribucije. Promjene su dopuštene, ali moraju biti zabilježene.

Više detalja o licenci možete pronaći ovdje: [Apache License 2.0](https://www.apache.org/licenses/LICENSE-2.0)

## Kako koristiti ovaj skup podataka

- Skup podataka se može koristiti za bilo koju svrhu, uključujući komercijalne projekte, uz uvjet da se uključi obavijest o licenci.
- Možete uvesti podatke u PostgreSQL ili ih analizirati pomoću Python, R ili bilo kojeg alata koji podržava CSV ili JSON formate.
