import React, { useEffect, useRef } from 'react';
import Plyr from 'plyr/dist/plyr.js';
import 'plyr/dist/plyr.css';

const Player = ({ initialVideoId = 'HbkF5Dv_AoQ' }) => {
  const playerRef = useRef(null);
  const containerRef = useRef(null);

  // Inline styles
  const appStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    padding: '20px',
  };

  const videoContainerStyle = {
    width: '100%',
    maxWidth: '800px',
    aspectRatio: '16 / 9',
    position: 'relative',
  };

  // Inject CSS to disable YouTube controls
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      .plyr__video-embed iframe {
        pointer-events: none !important;
      }
      .plyr__video-embed {
        pointer-events: auto !important;
      }
      .plyr__controls {
        pointer-events: auto !important;
      }
    `;
    document.head.appendChild(style);

    return () => {
      style.remove();
    };
  }, []);

  // Simple obfuscation function (not secure, just makes it slightly harder to find)
  const obfuscate = (str) => btoa(str);
  const deobfuscate = (str) => atob(str);

  useEffect(() => {
    // Decode the video ID at runtime
    const videoId = deobfuscate(obfuscate(initialVideoId));
    
    // Create a new div element for the player
    const playerElement = document.createElement('div');
    // Set attributes programmatically to avoid static HTML
    playerElement.setAttribute('data-plyr-provider', 'youtube');
    playerElement.setAttribute('data-plyr-embed-id', videoId);
    
    // Clear container and append new element
    if (containerRef.current) {
      containerRef.current.innerHTML = '';
      containerRef.current.appendChild(playerElement);
    }

    const player = new Plyr(playerElement, {
      youtube: {
        noCookie: true, // Use YouTube's no-cookie domain
        modestbranding: 0, // Disable YouTube branding
        rel: 0, // Disable related videos
        showinfo: 0, // Hide video information
        iv_load_policy: 3, // Hide video annotations
        disablekb: 0, // Enable keyboard controls
        fs: 1, // Enable fullscreen
        playsinline: 1, // Play inline on mobile
      },
      speed: { selected: 1.0, options: [0.5, 1.0,1.25, 1.5, 2.0] }, // Enable speed control
      quality: { default: 720, options: [ 1080, 720, 480, 360, 240],
        forced: true
      }, // Enable quality control
      settings: ['speed','quality'], // Add quality option to the settings menu
      hideControls: false, // Keep Plyr controls visible
      resetOnEnd: true, // Reset video when it ends (helps hide suggestions)
    });

    playerRef.current = player;

    // Remove the "Copy Link" button programmatically
    player.on('ready', () => {
      const shareButton = document.querySelector('.plyr__controls button[data-plyr="share"]');
      if (shareButton) {
        shareButton.remove(); // Remove the button from the DOM
      }
      
      // Remove video ID from DOM attributes after player is ready
      playerElement.removeAttribute('data-plyr-embed-id');
      
      // Disable right-click on the video to prevent "Copy Link" menu
      const videoWrapper = containerRef.current;
      if (videoWrapper) {
        videoWrapper.addEventListener('contextmenu', (e) => {
          e.preventDefault();
          return false;
        });
      }
    });

    // Auto-restart video when it ends to prevent showing suggestions
    player.on('ended', () => {
      setTimeout(() => {
        player.restart();
        player.pause();
      }, 100);
    });

    return () => {
      if (playerRef.current) {
        playerRef.current.destroy(); // Clean up the Plyr instance on unmount
        playerRef.current = null;
      }
    };
  }, [initialVideoId]);

  return (
    <div style={appStyle}>
      <h1>YouTube Video Player</h1>
      <div style={videoContainerStyle} ref={containerRef}></div>
    </div>
  );
};

export default Player;