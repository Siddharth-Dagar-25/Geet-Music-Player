import React, { useEffect } from 'react';

const FeedbackForm = () => {
  useEffect(() => {
    const script = document.createElement('script');
    script.src = "https://forms.app/static/embed.js";
    script.async = true;
    script.defer = true;
    script.onload = () => {
      new window.formsapp('65da3e26cd824c8379e235d7', 'popup', {
        'overlay': 'rgba(45,45,45,0.5)',
        'button': {'color':'#ff9e24','text':'Are Are ye kya hai ! ?'},
        'width': '800px',
        'height': '600px',
        'openingAnimation': {'entrance':'animate__bounceIn','exit':'animate__bounceOut'}
      });
    };
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return <button formsappId="65da3e26cd824c8379e235d7"></button>;
};

export default FeedbackForm;