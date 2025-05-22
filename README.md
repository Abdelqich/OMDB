
Projectbeschrijving:
Mijn Filmzoeker is een moderne, responsive webapplicatie waarmee gebruikers films, series en episodes kunnen zoeken via de OMDB API. 
De gebruiker kan zoeken op titel, filteren op type (film, serie, episodes), jaar en minimale IMDB-rating. 
Daarnaast biedt de app sorteeropties en de mogelijkheid om favoriete titels lokaal op te slaan en te beheren. Een licht/donker thema verhoogt het gebruikersgemak.

Functionaliteiten:
•	Zoeken: Zoek op filmtitel via een zoekbalk.
•	Filteren: Filter zoekresultaten op type, jaar en IMDB-rating.
•	Sorteren: Sorteer op titel (A-Z, Z-A) en op jaar (oud-nieuw, nieuw-oud).
•	Favorietenbeheer: Toevoegen/verwijderen van favorieten opgeslagen in localStorage.
•	Details: Bekijk uitgebreide informatie over een film in een aparte detailpagina.
•	Themawissel: Wissel tussen licht en donker thema, onthouden in localStorage.
•	Responsiveness: Goede weergave op desktop


Gebruikte API's:
https://www.omdbapi.com/
De Open Movie Database API levert alle filmdata zoals titels, posters, genres, plot, acteurs en IMDB ratings.
API key gebruikt: f5c24044

Technische implementatie en code verwijzing:
  Vereiste	                            Bestand	          Lijn(en)
  DOM Manipulatie:
  
Elementen selecteren	                detail.js	          1-20
Elementen manipuleren	                detail.js	          30-70
Events aan elementen koppelen	        detail.js	          80-110

  Modern JavaScript:
  
Gebruik van constanten (const)	        detail.js	          1-20
Template literals 	                    detail.js	          40-70
Iteratie over arrays	                detail.js	          35-65
Array methodes	                        detail.js	          0-70
Arrow functions	                        detail.js	          30-110
Ternary operator (? :)	                detail.js	          55
Callback functions	                    detail.js	          30-90
Promises	                            detail.js	          25-70
Async & Await	                        detail.js	          20-70
Observer API (Intersection Observer)    main.js	              85-105
 
  Data & API:
  
Fetch om data op te halen	            detail.js	          20-70
JSON manipuleren en tonen	            detail.js	          30-80

 Opslag & Validatie:

Gebruik van localStorage	            detail.js	          85-110
Formulier validatie	                    detail.js	          110-120
 
 Styling & Layout:
 
Basis HTML layout	                    detail.js	          50-80
CSS Styling	                            style.css	          1-200
Gebruiksvriendelijke elementen	        detail.js	          110-140

 Tooling & Structuur:
 
Vite gebruikt	                        vite.config.js, package.json
Correcte folderstructuur	            /src, /dist, index.html, style.css, /assets


  Installatiehandleiding
Stap 1:Zorg dat je het volgende op je systeem hebt geïnstalleerd:Node.js 
Stap 2:Clone dit project via Git of download het als ZIP
Stap 3: Vervolgens type je dit in "npm install"
Stap 4: En als laatste type je dit in "npm run dev"
Stap 5:De server zal automatisch openen dan