import { useState } from 'react';
import { wait } from './utils';
import './App.css';

function App() {
  const [isInit, setIsInit] = useState(true);
  const [isEmptyImage, setIsEmptyImage] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setIsError] = useState(false);
  const [imageSrc, setImageSrc] = useState('');

  const fetchImage = async () => {
    setIsLoading(true);
    setIsInit(false)

    try {
      const res = await fetch('https://api.thecatapi.com/v1/images/search');
      const [imageData] = await res.json();

      setImageSrc(imageData.url);
      setIsEmptyImage(false);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      setIsError(true);

      throw new Error(error);
    }
  }

  return (
    <div className="App">
      <main>
        {hasError && 'Sth went wrong!!!'}
        {isLoading ? 'Loading ...' : <img src={imageSrc} alt="" />}
        {isEmptyImage && 'Empty image'}
        {isInit && 'Click fetch!'}
      </main>
      {!hasError && (
        <>
          <button onClick={() => {
            setIsEmptyImage(false);
            fetchImage();
          }}>
            Fetch
          </button>

          {!isInit &&
            <button onClick={() => {
              setIsEmptyImage(true);
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
