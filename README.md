# Wilson

[![Run on Repl.it](https://repl.it/badge/github/hiubok/wilson)](https://repl.it/@OliverKovacs/wilson#README.md)
[![Discord](https://img.shields.io/discord/766705105491722252)](https://discord.gg/vV4PUad)
[![License](https://img.shields.io/github/license/hiubok/wilson)](https://github.com/hiubok/wilson/blob/main/LICENSE.md)
[![GitHub language count](https://img.shields.io/github/languages/count/hiubok/wilson)]()
[![GitHub top language](https://img.shields.io/github/languages/top/hiubok/wilson)]()
[![Size](https://img.shields.io/github/repo-size/hiubok/wilson)]()
[![Lines](https://img.shields.io/tokei/lines/github/hiubok/wilson)]()
[![Dependency](https://img.shields.io/github/package-json/dependency-version/hiubok/wilson/@google-cloud/dialogflow-cx)](https://www.npmjs.com/package/@google-cloud/dialogflow-cx)
[![Dependency](https://img.shields.io/github/package-json/dependency-version/hiubok/wilson/discord.js)](https://www.npmjs.com/package/discord.js)
[![GitHub contributors](https://img.shields.io/github/contributors/hiubok/wilson)]()

Wilson is a chatbot that can diagnose you based on your symptoms and give you information on illnesses.

Wilson uses Dialogflow for natural language processing (NLP), Symptoma for the diagnosis and the WHOs International Classification of Diseases (ICD) and Wikipedia as sources.
It is written in JavaScript and can be run online in Repl, locally with Node.js or in a Docker container.

> GIF goes here

---

## Table of contents

- [Run](#run)
- [Details](#details)
- [Languages and Technologies](#languages-and-technologies)
- [Sources](#sources)
- [Authors](#authors)
- [Roadmap](#roadmap)
- [Disclaimer](#disclaimer)
- [Legal notice](#legal-notice)


## Run
The bot can be run in a variety of environments with different frontends.

### Running in Repl:
Go to https://repl.it/@OliverKovacs/wilson#README.md  
Click `Run`

### Running locally:
You need [Node.js](https://nodejs.org/en/) and [npm](https://www.npmjs.com/) installed for this.  
Clone the repo with [git](https://git-scm.com/)
```
git clone https://github.com/hiubok/wilson.git  
```
or download as a [zip](https://github.com/hiubok/wilson/archive/main.zip).

Open a terminal in the cloned repo and run the command
```
npm install
```
Start the bot with 
```
npm start
```

### Running with [Docker](https://www.docker.com/)
Download the repo as mentioned above, in the directory run:  
On Windows: (also start Docker Desktop)
```
dockerrun.bat
```
On Linux:
```
sudo sh ./dockerrun.sh
```
This could take a few minutes if you run it for the first time.  

## Details
Details on how the bot works.

### General working principle
The diagram below demonstrates how the bot processes input and how it obtains relevant data.
![Diagram](https://raw.githubusercontent.com/hiubok/wilson/main/assets/diagram.svg)

### Frontends
The bot itself is a separate module, which can have multiple frontends.  
The command line interface for example is a frontend for the bot (see [run](#run) on how to start it), but frontends can be built for any platform.  
An example also provided in the repo is a Discord integration, which allows the bot to run as an Discord bot. It can be run with `npm run dc` (after putting a valid Discord token in `./dc/token.txt`, see more information [here](https://discord.com/developers/docs/intro)).


## Languages and technologies
The bot itself is written completely in JavaScript, plus some configuration in Dialogflow.
We used these technologies to create the bot (click on an icon for more info):

[<img align="left" alt="JavaScript" width="28px" src="./assets/icons/javascript.svg" />]()
[<img align="left" alt="Dialogflow" width="28px" src="./assets/icons/dialogflow.svg" />](https://cloud.google.com/dialogflow)
[<img align="left" alt="Google Cloud" width="28px" src="./assets/icons/googlecloud.svg" />](https://cloud.google.com/)
[<img align="left" alt="git" width="28px" src="./assets/icons/git.svg" />](https://git-scm.com/)
[<img align="left" alt="GitHub" width="28px" src="https://simpleicons.org/icons/github.svg" />](https://github.com/)
[<img align="left" alt="Discord.js" width="28px" src="./assets/icons/discord.svg" />](https://discord.js.org/#//)
[<img align="left" alt="Node.js" width="28px" src="./assets/icons/node.svg" />](https://nodejs.org/en/)
[<img align="left" alt="npm" width="28px" src="./assets/icons/npm.svg" />](https://www.npmjs.com/)
[<img align="left" alt="Repl" width="28px" src="./assets/icons/repl.png" />](https://repl.it/)
[<img align="left" alt="npm" width="28px" src="./assets/icons/docker.svg" />](https://www.docker.com/)
[<img align="left" alt="Visual Studio Code" width="28px" src="https://raw.githubusercontent.com/vscode-icons/vscode-icons/master/icons/file_type_vscode.svg" />](https://code.visualstudio.com/)
[<img align="left" alt="Webstorm" width="28px" src="./assets/icons/webstorm.png" />](https://www.jetbrains.com/webstorm/)
<br />

## Sources
Wilson uses [Symptoma](https://www.symptoma.com/en/about) to give you a diagnosis based on symptoms.  
It uses the [World Health Organizations (WHO)](https://www.who.int/) [International Classification of Diseases (ICD-11)](https://www.who.int/classifications/icd/en/) and [Wikipedia](https://www.wikipedia.org/) to give you information on illnesses.  
These sources can be removed, changed or extended.

[<img align="left" alt="Symptoma" height="48px" src="./assets/sources/symptoma.svg" />](https://www.symptoma.com/en/about)
[<img align="left" alt="Wikipedia" height="48px" src="./assets/sources/who.svg" />](https://www.who.int/)
[<img align="left" alt="Wikipedia" height="48px" src="./assets/sources/wikipedia.svg" />](https://www.wikipedia.org/)

<br />
<br />
<br />

## Authors
- Oliver Kovacs
    - [Github](https://github.com/OliverKovacs)
    - [Email](mailto:oliver.kovacs.dev@gmail.com)
- Ulrich Barnstedt
    - [Github](https://github.com/ulrich-barnstedt)
    - [Email](mailto:0x81.dev@gmail.com)
- Hanna Inselsbacher


## Roadmap
- Add further dialogues to Dialogflow
- Create integrations for other platforms apart from Discord
- Add further sources for researching info on illnesses
- Create support for other languages than English


## Disclaimer
The bot does not replace an actual diagnose by a certified medical professional, and replies and diagnoses may be inaccurate.  
Do NOT rely on the data provided by the bot for real world use, this is a work in progress, proof-of-concept project.

## Legal Notice

By using this program you agree to:
- Dialogflows [terms of service](https://cloud.google.com/dialogflow/docs/terms-trial-edition)
- Symptomas [terms of service](https://www.symptoma.com/en/terms) and [privacy policy](https://www.symptoma.com/en/privacy)
- The WHOs [privacy policy](https://www.who.int/about/who-we-are/privacy-policy)
- The Wikimedia [terms of use](https://foundation.wikimedia.org/wiki/Terms_of_Use/en) and [privacy policy](https://foundation.wikimedia.org/wiki/Privacy_policy)