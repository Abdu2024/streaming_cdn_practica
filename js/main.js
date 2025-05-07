// Script para usar WebP si está soportado, o JPG como fallback
window.addEventListener('DOMContentLoaded', () => {
  const posterImg = document.querySelector('#videoPoster img');
  const video = document.getElementById('myVideo');
  
  if (posterImg && video) {
    video.poster = posterImg.currentSrc;
  }
  
  // Estadísticas de vídeo
  const toggleStats = document.getElementById('toggleStats');
  const videoStats = document.getElementById('videoStats');
  
  // Variables para estadísticas
  let startLoadTime = Date.now();
  let qualityChanges = 0;
  let totalBufferingTime = 0;
  let isBuffering = false;
  let bufferingStartTime = 0;
  
  // Eventos para monitorear el buffering
  video.addEventListener('waiting', () => {
    isBuffering = true;
    bufferingStartTime = Date.now();
  });
  
  video.addEventListener('playing', () => {
    if (isBuffering) {
      const bufferingDuration = (Date.now() - bufferingStartTime) / 1000;
      totalBufferingTime += bufferingDuration;
      isBuffering = false;
    }
  });
  
  // Check if elements exist before adding event listeners
  if (toggleStats && videoStats) {
    let statsVisible = false;
    let statsInterval;
    
    // Mostrar/ocultar estadísticas
    toggleStats.addEventListener('click', () => {
      statsVisible = !statsVisible;
      videoStats.style.display = statsVisible ? 'block' : 'none';
      toggleStats.textContent = statsVisible ? 'Ocultar Estadísticas' : 'Mostrar Estadísticas';
      
      if (statsVisible) {
        updateStats();
        statsInterval = setInterval(updateStats, 1000);
      } else {
        clearInterval(statsInterval);
      }
    });
    
    // Make sure videoStats is initially hidden
    videoStats.style.display = 'none';
    
    function updateStats() {
      if (!video) return;
      
      // Update all statistics elements
      const resolutionElement = document.getElementById('resolution');
      const currentFormatElement = document.getElementById('currentFormat');
      const playbackTimeElement = document.getElementById('playbackTime');
      const playbackRateElement = document.getElementById('playbackRate');
      const volumeElement = document.getElementById('volume');
      const bufferSizeElement = document.getElementById('bufferSize');
      const latencyElement = document.getElementById('latency');
      const qualityChangesElement = document.getElementById('qualityChanges');
      const bufferingTimeElement = document.getElementById('bufferingTime');
      
      // Resolución
      if (resolutionElement) {
        resolutionElement.textContent = `${video.videoWidth} x ${video.videoHeight}`;
      }
      
      // Formato actual
      if (currentFormatElement) {
        const currentSource = Array.from(video.querySelectorAll('source'))
          .find(source => {
            try {
              const url = new URL(source.src, window.location.href);
              return video.currentSrc.includes(url.pathname);
            } catch (e) {
              return false;
            }
          });
        
        currentFormatElement.textContent = currentSource ? 
          currentSource.type.split('/')[1].toUpperCase() : '-';
      }
      
      // Tiempo de reproducción
      if (playbackTimeElement) {
        if (video.duration) {
          const currentTime = Math.floor(video.currentTime);
          const minutes = Math.floor(currentTime / 60);
          const seconds = currentTime % 60;
          
          const totalMinutes = Math.floor(video.duration / 60);
          const totalSeconds = Math.floor(video.duration % 60);
          
          playbackTimeElement.textContent = `${minutes}:${seconds.toString().padStart(2, '0')} / ${totalMinutes}:${totalSeconds.toString().padStart(2, '0')}`;
        } else {
          playbackTimeElement.textContent = '-';
        }
      }
      
      // Velocidad de reproducción
      if (playbackRateElement) {
        playbackRateElement.textContent = `${video.playbackRate}x`;
      }
      
      // Volumen
      if (volumeElement) {
        volumeElement.textContent = `${Math.round(video.volume * 100)}%${video.muted ? ' (silenciado)' : ''}`;
      }
      
      // Tamaño del buffer
      if (bufferSizeElement) {
        if (video.buffered.length > 0) {
          const bufferedEnd = video.buffered.end(video.buffered.length - 1);
          const bufferedPercent = Math.round((bufferedEnd / video.duration) * 100);
          bufferSizeElement.textContent = `${bufferedPercent}%`;
        } else {
          bufferSizeElement.textContent = '-';
        }
      }
      
      // Latencia
      if (latencyElement) {
        latencyElement.textContent = `${Math.round(Date.now() - startLoadTime)} ms`;
      }
      
      // Cambios de calidad
      if (qualityChangesElement) {
        qualityChangesElement.textContent = qualityChanges;
      }
      
      // Tiempo de buffering
      if (bufferingTimeElement) {
        // Convert to milliseconds for display since totalBufferingTime is in seconds
        bufferingTimeElement.textContent = `${Math.round(totalBufferingTime * 1000)} ms`;
      }
    }
  }
});