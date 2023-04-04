import React from 'react';

const GoogleCalendar = () => {
  return (
    <iframe
      src="https://calendar.google.com/calendar/embed?height=600&amp;wkst=1&amp;bgcolor=%23ffffff&amp;ctz=America%2FChicago&amp;showNav=1&amp;showPrint=0&amp;showTabs=1&amp;showTz=0&amp;showCalendars=0&amp;src=Y2EzMmUwOTMwNzkwMTk3OTc3YTZkNTQ1YTFlZTQ1MjQyMmIyZmUyODQ0ZDY3MDk5ZTJiYWM4ODg3NDU1ZjgwYkBncm91cC5jYWxlbmRhci5nb29nbGUuY29t&amp;color=%23F6BF26"
      style={{ border: 0, width:"100%", height:'80vh' }}
      frameborder="0"
      scrolling="no"
    ></iframe>
  );
};

export default GoogleCalendar;
