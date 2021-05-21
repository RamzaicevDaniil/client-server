<link rel="preconnect" href="https://fonts.gstatic.com">
<link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@300;700&display=swap" rel="stylesheet">

<script>
  import {createSmartappDebugger, createAssistant} from '@sberdevices/assistant-client'
  import { onMount } from 'svelte'

  let message = '';
  const backendUrl = 'http://localhost:3000/'
  let wordsState = []
  let idState
  let token = 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2ZTBlNGU0NjkwNDUzNmZhNTgyYmVhNjU4MDNhYmI5M2VlZjQ3NGVlYTZmNjI1M2IxZDM5ODQ1ZTRhOTYzMDhlNTM5YmU5MjcwMDQyNjI5OCIsImF1ZCI6IlZQUyIsImV4cCI6MTYyMTY3OTk2NSwiaWF0IjoxNjIxNTkzNTU1LCJpc3MiOiJLRVlNQVNURVIiLCJ0eXBlIjoiQmVhcmVyIiwianRpIjoiZTIyYzMyOWYtZWVjNS00NDY0LWI4ZDQtMGQxM2VhZGRiYzljIiwic2lkIjoiNmRmNjFkNmItZjZkYy00ZWY0LTkwMGMtMmU2OTNlNzVjMzYxIn0.FaaMlZZsHdm2JB34yKGVo1nVT6YB026dMiCCnb2D6kQpOGD6s5pbE_hn-6bAmkOjtF4e8jZKN9HjM3EEfsxzfCb9hJ3UmtokICfWzG2VYc23DrDuZnxP1ZV8CRy3OgjdlSgmrjrl4fiVOybdBktK4ACb5am-kfyQVo5vAu0qS6e_fp9wqQnjqKuhS3YC9Zb6U8AehDwL3jEZR1uNOfNgL4gboaNL_JcdIE-xnBortF10BKwvXxRQ3EEKAwAKZ_wJRyJzxVvvyMDkK8miOAjnO1zQQ9FHDAmpwcVrc95u3Gm87uvXYPCC7s-LOncTWk3k1miBDWA4e98Q53ZzUSKQ6qsGAAKxxjB2LlekYVEaFfe-5xT4_mwwDXOuKEhoE04SO3tE2PJr4tXY9XQXFxMP7l-5BXBExxquUnxLd3qNKhb67q2_BVcS630ilcW0KwxMHzhzsgDYNuYksTd-aaa4AtzR9PiVqKlT25ERgzAfr-4ohN_w7oePAAcULQ8wxmwTzt5Fshg_7Zv0aguUYJSygYcm5O7O86JzsSw63d0Cefkgt4ykwf0x9OvBc2rzgmgZCKAL3gmpbDpSuSyI_q2jLSYr8QPLcAJoCwed7hDHEpcbWLE7gIUuv4dZjkOjtBYiDmzLNNwATWv9v0izktSbKvkv5ZKQin1dqCtWJmXYJhs';
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
            message = 'Неправильно, дурак!'
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
      message = 'Неправильно, дурак!'
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
    width: 200px;
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