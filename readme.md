# Emotional Chronicles



> Emotional Chronicles is a simple diary app that uses an emotional analysis service to help users keep track of their emotional state.

>It has a CRUD backend written in Express, and a React frontend currently using Bootstrap for styling.

> This project was built as a capstone project for the Springboard Software Engineering program

## What am I looking at here??? 

### Current Deployment

A live version of this project can be found at [EMOTIONAL CHRONICLES](https://infallible-mahavira-dffe57.netlify.app/)

A live version of the API can be found at [EMOTIONAL CHRONICLES API](https://emotional-chronicles-backend.herokuapp.com)


The mono-repo can be found at [MONOREPO](https://github.com/DJTwoTone/Emotional_Chronicles)

The backend-repo can be found at [BACKEND](https://github.com/DJTwoTone/emotional_chronicles_backend)

The frontend-repo can be found at [FRONTEND](https://github.com/DJTwoTone/emotional_chronicles_frontend)

### Current Features

- Users
    
    - account creation
    - writing diary entries
    - getting emotional analysis of diary entries
    - seeing / reviewing diary entries for any day
    - accessing a calendar of diary entries
    - viewing daily emotions in graph from for each month
    - get inspiration at any time
    - sharing inspirational quotations

- Admin 

    - All the users features (except account creation)
    - Approve / Disapprove prompt additions
    - Approve / Disapprove inspiration additions


### Walkthrough

1. Login or Signup for an account.
1. To write a diary entry. Click on 'Today' (Note - If you have already written an entry today, you will be redirected.)
    1. You will be presented with a list of emotions. Click on the ones you are feeling today.
    1. Next, read your writing prompt.
        1. If you don't like it you can get a new one
    1. Write away.
    1. If you need some inspiration, you can find some under the writing form.
        1. Click to get more if you'd like.
    1. Once you're done writing, click the 'RECORD' button.
    1. You're writing will be analyzed, and you will be redirected to that entries page to see the results.
1. You can also access a calendar of all your entries.
    1. Click on the day of interest, and you will be taken to that diary entry.
    1. Under the calendar, you will find a graph of you emotions for each month.
    1. In addition, you will also find a link to a list of all your diary entries at the bottom.
1. You can also access a list of inspirational quotes or add some inspiration if you'd like to share.
    

### Behind the Scenes

#### The Backend

The backend of this app is built on a PostgreSQL server with the Express framework doing the heavy lifting. Of note, the Luxon library was used to help with some of the date/time work. Dates and time are tough.

#### The Frontend

This is a React app that makes use of [Symanto](https://api.symanto.net)'s emotional analysis API. It also makes use of several frameworks and libraries:

 - Bootstrap (in particular React Bootstrap is used for styling)
 - Luxon, again, is used to help with the date/time work
 - React-calendar was used to provide a simple calendar interface
 - React-tagcloud is providing the random list of emotions
 - Recharts provides the charts both line graph under the calendar and the radar chart in individual entries

## Getting Started (If you want to tinker with it)

Before you get started, there are a few things that you'll need to have installed on your system.

- PostgreSQL server (make sure you have this setup for your preferences)
- Node 

### Prerequisites

Most of the libraries you need will be installed from the package.json files, but:

- You will need an API key from the emotion analysis API [Symanto](https://api.symanto.net). You will need to set up a .env file and include it API_KEY=whatever_your_API_key_is


## Installing



### Setup the Databases

> Make sure you have PostgreSQL all setup as you like it

From the project directory
```
createdb emo-chron
createdb emo-chron-test

psql emo-chron < data.psql
psql emo-chron-test < testing-data.psql
```

> NOTE* The resources that were used to seed the databases can be found in the resource_collection folder 

### Install the Backend

```
cd EC_backend
npm install
```

### Install the Frontend

```
cd emo_chron_frontend
npm install
```

Those should get you going

## Running Tests

There are currently tests for both the backend and the frontend. These tests will continue to be developed to better ensure quality in the codebase. 



### Backend Tests

Go into the backend folder (EC_backend)
There is a script set up.
All the tests can currently be found in the "__tests__" folder.

```
cd EC_backend
npm test
```

### Frontend Tests

Go into the backend folder (emo_chron_frontend)
There is a script set up.
All the tests can currently be found in the "src" folder right under the components they are testing.

```
cd emo_chron_frontend
npm test
```

## Database Diagram

Here's is the working sketch of the database

<img src='EmotionalChroniclesDB.svg' alt='Emotional Chronicles Database' width=1000 height=1000>

## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.

## Code Owners

* **Benjamin W. Slater** - *I did this but nothing is done isolation. I stand on the shoulders of giants.* - [Here is my github](https://github.com/DJTwoTone)

## Acknowledgments

* My mentor - Jim Rudolf (Without his advice and gentle prodding, I would be stuck staring at my computer screen still)
* My wife - Miyeong Jung (For putting up with me for all these years and believing that this coding thing is something I can do)
* Everyone else who has given me little pushes and showed interest in what I'm doing.


## Possible Future Additions

- There is a much better emotional analysis service, but it cost cold hard cash. It could be implemented in the future if this project were to take a commercial turn (I doubt it, but you never know).
- It would be nice to have a feature for downloading a user's diary (formatted or as a spreadsheet).
- Add the ability to editing accounts.
- Including email/text reminder to write in the diary.
- Adding user input range to emotion graph.
- The UI needs a lot of work. I'm waiting patiently for my expert to take a whack at it.
- Tightening up security and user access.
- Keeping track of used and rejected writing prompts
- TESTING, TESTING, TESTING!

## License

MIT License

Copyright (c) [2021] [Benjamin W Slater]

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

