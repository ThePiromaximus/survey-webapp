# Exam #1234: "Questionari"
## Student: s287028 Inzerillo Gabriele 

## React Client Application Routes

- Route `/homepage`: nella homepage sono visualizzati tutti i questionari. La homepage è la route di "default" per gli utenti che non sono loggati.
- Route `/admin`: route nella quale viene visualizzato il componente "AdminDashboard" e i relativi componenti figli. Rappresenta la schermata principale per un utente loggato, cioè un admin.

## API Server

- POST `/api/login`
  - request parameters and request body content
  - response body content
- GET `/api/sessions/current`
  - request parameters
  - response body content
- DELETE `/api/logout`
  - request parameters and request body content
  - response body content
- GET `/api/surveys`
  - request parameters and request body content
  - response body content
- GET `/api/survey=:survey`
  - request parameters and request body content
  - response body content
- POST `/api/user`
  - request parameters and request body content
  - response body content
- POST `/api/survey`
  - request parameters and request body content
  - response body content
- GET `/api/admin=:admin`
  - request parameters and request body content
  - response body content
- POST `/api/admin=:admin/survey`
  - request parameters and request body content
  - response body content
- GET `/api/survey=:survey/users`
  - request parameters and request body content
  - response body content
- GET `/api/survey=:survey/user=:user`
  - request parameters and request body content
  - response body content

## Database Tables

- Table `ADMIN` - contains id, username, password. Contiene gli admin della web app
- Table `SURVEY` - contains id, title, adminId. Contiene i questionari caricati e una reference all'admin che li ha creati
- Table `QUESTION` - contains id, text, type, minAns, maxAns, surveyId. Contiene le domande presenti nei questionari. Il campo type può avere 3 possibili valori (0, 1, 2) che servono rispettivamente a distinguere tra domanda a risposta multipla, domanda aperta obbligatoria e domanda aperta non obbligatoria. minAns e maxAns sono utilizzate per tenere traccia del numero minimo e massimo di risposte selezionabili in quella domanda (solo nel caso di domande a risposta multipla).
- Table `OPTION` - contains id, description, questionId. La tabella serve a rappresentare e contenere le risposte per le domande a risposta multipla. Description è il testo della risposta, il questionId serve a fare riferimento alla domanda a cui appartengono.
- Table `ANSWER`- contains id, answerText, questionId, optionId, userId. La seguente tabella serve a salvare le risposte date alle domande dei questionari. Il campo answerText contiene la risposta (testuale) data alle domande aperte. questionId serve a capire a quale domanda, la tupla, fa riferimento. optionId invece serve a fare riferimento alla risposta (OPTION) scelta/e nel caso di domande a risposta multipla. Infine userId serve a riferirsi all'utente che ha dato quella risposta
- Table `USER`- contains id, name. Questa tabella serve a tenere solamente traccia degli utenti che compilano i questionari. È stato necessario creare una tabella (con propria PK) in quanto senza di essa, se ci fossero stati due utenti con lo stesso nome, a compilare lo stesso questionario, non sarebbe stato possibile distinguerli. Il che risulta, chiaramente, socrretto.

## Main React Components

- `NavigationBar` (in `NavigationBar.js`): questo componente rappresenta la barra di navigazione principale della Web Application. Nella parte sinistra del componente si trova il "logo" della WebApp e sulla destra un bottone di login/logout che cambia in funzione del fatto che sia stato eseguito o meno un login da un admin.
- `AdminDashboard.js` (in `AdminDashboard.js`): componente che rappresenta la "homepage" dell'admin. Tramite questo componente l'admin può decidere se creare un nuovo sondaggio o vedere i risultati dei sondaggi da lui creati (che appariranno listati).
- `ClosedQuestion.js` (in `ClosedQuestion.js`): componente renderizzato in fase di compilazione di un sondaggio da parte di un utente. Serve a rappresentare e modellare una domanda a risposta multipla. Gestisce la validazione (es: il numero di risposte date sia compreso tra min e max).
- `ModalLogin.js` (in `ModalLogin.js`): semplice componente usato per rappresentare un modal per il login. Gestisce la validazione delle credenziali di accesso.
- `ModalQuestion.js` (in `ModalQuestion.js`): componente utilizzabile solo dall'admin. Utilizzato in fase di creazione di un nuovo questionario per aggiungere nuove domande a risposta aperta e/o a risposta multipla. Nel caso delle domande a risposta multipla permette anche l'aggiunzione delle relative risposte previste (OPTION del database). Gestisce la validazione delle domande.
- `ModalSurvey.js` (in `ModalSurvey.js`): componente che modella un questionario da compilare. Permette all'utente di inserire il proprio nome e scegliere le risposte del questionario che ha selezionato. Una volta submittato il questionario, tramite API, invia le risposte scelte al database.
- `OpenQuestion.js` (in `OpenQuestion.js`): componente renderizzato in fase di compilazione di un sondaggio da parte di un utente. Serve a rappresentare e modellare una domanda a risposta aperta.
- `QuestionList.js` (in `QuestionList.js`): componente utilizzabile solo da un admin. Viene visualizzato nel momento in cui l'admin decide di creare un nuovo sondaggio. Serve a visualizzare e renderizzare la lista di domande che l'admin ha creato per il proprio (nuovo) questionario. Serve anche a gestire la cancellazione di una domanda creata per il questionario, ma anche per cambiare l'ordine delle domande nel questionario. Ovviamente tutto ciò prima che il questionario venga pubblicato.
- `Results.js` (in `Results.js`): questo componente viene visualizzato e utilizzato solo da un amdin. Viene creato nel momento in cui l'admin decide di vedere i risultati di un sondaggio da lui creato. Al suo interno viene visualizzato il nome dell'utente (di cui si stanno visualizzando le risposte) e il questionario con le risposte date dall'utente. Oltre a ciò sono presenti due tasti per potere andare "avanti" e "indietro" scorrendo i vari utenti che hanno risposto al sondaggio e le relative risposte.
- `SurveyPreview` (in `SurveyPreview.js`): card cliccabile, visualizzabile dentro il componente SurveysList, che contiene nome e autore di un questionario. Viene gestita in maniera differente in base al fatto che a visualizzarla sia un semplice user o un admin. Nel caso degli user contiene un bottone "Fill out" cliccabile che serve ad aprire il questionario (ModalSurvey) e a compilarlo. Nel caso dell'admin invece serve a visualizzare il numero di utenti che hanno rispsoto a quel questionario e contiene un bottone "See results" che una volta cliccato permette di visualizzare le risposte che sono state date a quel sondaggio.
- `SurveysList` (in `SurveysList.js`): componente che contiene tutti i questionari creati (come componenti "SurveyPreview"). Visualizzandola come "user" vi troveremo la lista di tutti i questionari creati e pubblicati fino ad ora. Visualizzandola come "admin" vi troveremo la lista di questionari da noi creati.

## Screenshot

![Screenshot](./img/screenshot.jpg)

## Users Credentials

- BruceWayne, BruceWayne (ha creato il questionario "The Dark Knight")
- PeterParker, PeterParker (ha creato il questionario "Great Powers")
