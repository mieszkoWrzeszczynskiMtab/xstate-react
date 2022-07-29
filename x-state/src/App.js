import { useState } from 'react';
import { createMachine } from 'xstate';
import { useMachine } from '@xstate/react';
import './App.css';

const states = {
  init: 'init',
  loading: 'loading',
  loaded: 'loaded',
  error: 'error',
  emptyImage: 'emptyImage',
}

const imageMachine = createMachine({
  id: 'imageMachine',
  context: {
    imageSrc: ''
  },
  initial: states.init,
  states: {
    [states.init]: {
      on: {
        FETCH_IMG: states.loading
      }
    },
    [states.loading]: {
      on: {
        FETCH_IMG_SUCCESS: {
          target: states.loaded,
          actions: 'addWater'
        },
        FETCH_IMG_FAILURE: states.error
      }
    },
    [states.loaded]: {
      on: {
        FETCH_IMG: states.loading,
        EMPTY_IMG: states.emptyImage,
      }
    },
    [states.emptyImage]: {
      on: {
        FETCH_IMG: states.loading,
        EMPTY_IMG: states.emptyImage,
      }
    },
    [states.error]: {
      type: 'final'
    },
  }
});

function App() {
  const [currentState, send] = useMachine(imageMachine);
  const [imageSrc, setImageSrc] = useState('');

  const fetchImage = async () => {
    send('FETCH_IMG');

    try {
      const res = await fetch('https://api.thecatapi.com/v1/images/search');
      const [imageData] = await res.json();

      setImageSrc(imageData.url);

      send('FETCH_IMG_SUCCESS');
    } catch (error) {
      send('FETCH_IMG_FAILURE');

      throw new Error(error);
    }
  }

  return (
    <div className="App">
      <main>
        {currentState.matches(states.error) && 'Sth went wrong!!!'}
        {currentState.matches(states.loading) ? 'Loading ...' : <img src={imageSrc} alt="" />}
        {currentState.matches(states.emptyImage) && 'Empty image'}
        {currentState.matches(states.init) && 'Click fetch!'}
      </main>
      {!currentState.matches(states.error) && (
        <>
          <button onClick={() => {
            fetchImage();
          }}>
            Fetch
          </button>
          {!currentState.matches(states.init) &&
            <button onClick={() => {
              send('EMPTY_IMG');
              setImageSrc('');
            }}>
              Clear image
            </button>
          }
        </>
      )}
    </div>
  );
}

export default App;
