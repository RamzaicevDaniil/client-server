<link rel="preconnect" href="https://fonts.gstatic.com">
<link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@300;700&display=swap" rel="stylesheet">

<script>
  import {createSmartappDebugger, createAssistant} from '@sberdevices/assistant-client'
  import { onMount } from 'svelte'

  let message = '';
  const backendUrl = 'http://localhost:3000/'
  let wordsState = []
  let idState
  let token = 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI3NmI4MjA4OWJiNzJkMTA3NGMzMWIwNmQ1YWVmMjE0NDg4NjhjYjZkZTUxZDM4NTE0ZDY1ZjZlYTJmOTgxOTlhNTM5YmU5MjcwMDQyNjI5OCIsImF1ZCI6IlZQUyIsImV4cCI6MTYyMTg2ODkxNCwiaWF0IjoxNjIxNzgyNTA0LCJpc3MiOiJLRVlNQVNURVIiLCJ0eXBlIjoiQmVhcmVyIiwianRpIjoiMjAxNWI3MzQtNzYyNi00ZGZjLTg4ZTQtNmM0OTY0OGI3ZjE0Iiwic2lkIjoiOGQ5MWQ0OTktN2Y2Yy00MTU4LWJmZmMtMDhjYTAzYmNlOTllIn0.sX3-9KEM-qE-JrQ331zmib8-VDxZPON8njI9_bP02-Wg6az6Wm4RXwd5E5fw0EBhoQ9R2N8HMWRc63Lz89gL0EyTze_MvA-nG5-CLaDZ6nbelT5b-HzoSuk7baRcRucEdMQMJruEQd_cSlqBGB35h8aK9o4h1DrE7voqVyvLQyJOzMBkJFKzUYWOHAx123Zcs_XJr8eWHQxYUimx04whucYhyUOAYUSzIDagq2dh9thEEvkL3_ki9xjCi4upjOUhE_zeqTmcynaC3o5ZRpn25v8oeCTb51Dfl5bO7fyyjK_gPZeRSntMZtFWB3IJnOyQmJWVxPXNAoSX-sXtzOkhTgVS7wvcpWblj6Qx-RsD-6ra7kxfrrNMfPw48zgO_6MbMoAjFVslSJDqevT4d39IsZPqzMxJ7RtTIJ4RZbr_r6yf0QLzZt6gZnlMShZZWbwvrW9iAbSM8OI-VsgjTNVnZTRtveBkWPOfhEOovRQ50MRg5h5gWACZgdFQTobH6cwZ503ubPiJE7NlDZF8poFHxH5ATj-dvi0Qp7DPEaXADtZwjayZTY0IwXn3Om2tQ60LdZZDlU9pLBkuPvuwxM94JEhoaUlfqyEoy7R7V1jrcgZCRE_QZB4T9TRwgQ0KX8K9tsVFO9PFBstzIPRE9LL5SjyzD78k5D_nNDFXAkTVPFM';
  let initPhrase = 'Включи переводчик'; // <- сюда вставляем активационную фразу своего canvas app

  function getState() {
    console.log("State was get");
    const state = {
      item_selector: {
        items: [
          {rightId: idState},
          {
            words: wordsState
          }
        ],
      }
    }
    console.log(state)
    return state;
  }

  let assistant;
  onMount(() => {
    const init = () => {
      return createSmartappDebugger({
        token,
        initPhrase,
        getState,
        settings: {debugging: false}
      })
      // return createAssistant({getState});
    }
    assistant = init();

    assistant.on("start", (event) => {
      console.log(`assistant.on(start)`, event);
    });

    assistant.on("data", (event) => {
      console.log('EVENT!!!', event);
      switch (event.action.type) {
        case 'answer':
          if (wordsState[idState] === event.action.word) {
            message = '';
            promise = newGame();
          } else {
            message = 'Неверно, подумай еще раз.'
          }
        break
      }
    });
  })

  function check(ind, rightInd) {
    if (ind === rightInd) {
      message = '';
      promise = newGame();
    } else {
      message = 'Неверно, подумай еще раз.'
    }
  }

  const newGame = async () => {
    const response = await fetch(backendUrl+'game');
    if (response.ok) {
      const json = await response.json();
      wordsState = json.words;
      idState = json.trueIndex;
      return json;
    } else {
      return {trueWord: 'Ошибка сервера'}
    }
  }

  let promise = newGame();
</script>

<main>
  <div id="game">
    {#await promise then game}
      <h1>{game.trueWord}</h1>
      <div id="words-block">
        {#each game.words as word, i}
          <button on:click={() => check(i, game.trueIndex)}>{word}</button>
        {/each}
      </div>
      <div id="message">
        <p>{message}</p>
      </div>
    {/await}
  </div>
</main>

<style>
	main {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    flex: 1 1;
    font-family: 'Montserrat', sans-serif;
    background-color: #3c3c3c;
    color: #FFFFFF;
	}

	#game {
    position: relative;
    text-align: center;
    padding-bottom: 50px;
  }

  #words-block {
    min-width: 300px;
    display: flex;
    justify-content: center;
    flex: 1 1;
    margin-top: 40px;
    flex-wrap: wrap;
  }

  #words-block button {
    width: 250px;
    min-width: 100px;
    cursor: pointer;
    margin: 10px 20px;
    padding: 20px;
    border-radius: 20px;
  }

  #message {
    width: 100%;
    position: absolute;
    bottom: 0;
    color: red;
    text-align: center;
  }

	@media (min-width: 640px) {
		main {
			max-width: none;
		}
	}
</style>