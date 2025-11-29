import React, { useRef, useState } from 'react';
import Player from './player.jsx';

const App = () => {
  const videoIdRef = useRef('HbkF5Dv_AoQ'); // Use useRef for video ID
  const [videoId, setVideoId] = useState(videoIdRef.current); // State to trigger re-render
  
  const changeVideo = (newVideoId) => {
    setVideoId(newVideoId); // Update the video ID
  };

  return (
    <div>
      <h1>YouTube Video Player</h1>
      <div>
        <button onClick={() => changeVideo('HbkF5Dv_AoQ')}>Video 1</button>
        <button onClick={() => changeVideo('0IwpeCh70aI')}>Video 2</button>
        <button onClick={() => changeVideo('dQw4w9WgXcQ')}>Video 3</button>
        <button onClick={() => changeVideo('4hWFK9mmv80')}>Video 3</button>

      </div>
      <Player initialVideoId={videoId} />
    </div>
  );
};

export default App;