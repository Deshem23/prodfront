// src/components/SocialFeedCard.jsx
import React, { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';

export default function SocialFeedCard() {
  const { t } = useTranslation('home');
  const primaryColor = 'rgb(5, 40, 106)';
  const fbContainerRef = useRef(null);

  useEffect(() => {
    // This useEffect hook is specifically for Facebook's Page Plugin
    // It ensures the Facebook SDK is loaded and the widget is rendered.

    // 1. Load the Facebook SDK (if not already loaded)
    // You might already have this in your public/index.html or another global script
    // If you have it globally, you can remove this part.
    if (window.FB) {
        window.FB.XFBML.parse(); // Re-parse if FB object already exists
    } else {
        window.fbAsyncInit = function() {
            window.FB.init({
                appId            : 'YOUR_FACEBOOK_APP_ID', // <<-- REPLACE WITH YOUR ACTUAL FACEBOOK APP ID
                xfbml            : true,
                version          : 'v19.0' // Use the latest API version
            });
        };

        (function(d, s, id) {
            var js, fjs = d.getElementsByTagName(s)[0];
            if (d.getElementById(id)) return;
            js = d.createElement(s); js.id = id;
            js.src = 'https://connect.facebook.net/en_US/sdk.js'; // Or your locale like 'fr_FR'
            fjs.parentNode.insertBefore(js, fjs);
        }(document, 'script', 'facebook-jssdk'));
    }

    // 2. Render the Facebook Page Plugin
    // This div will be replaced by the actual Facebook widget
    // Make sure 'data-href' points to your Facebook Page URL
    // And 'data-width', 'data-height' etc. are set as desired.
    // The 'data-width' should ideally be 100% for responsiveness within the card.

    // Example Facebook Page Plugin HTML (You'll get this from Facebook Developers)
    // <div
    //   class="fb-page"
    //   data-href="https://www.facebook.com/YourFacebookPage/" // <<<--- REPLACE WITH YOUR PAGE URL
    //   data-tabs="timeline"
    //   data-width="500" // Will be overridden by CSS max-width and fluid nature
    //   data-height="300" // Adjust as needed, but CSS max-height will limit it
    //   data-small-header="true"
    //   data-adapt-container-width="true"
    //   data-hide-cover="false"
    //   data-show-facepile="false"
    // >
    //   <blockquote cite="https://www.facebook.com/YourFacebookPage/" class="fb-xfbml-parse-ignore">
    //     <a href="https://www.facebook.com/YourFacebookPage/">Your Facebook Page Name</a>
    //   </blockquote>
    // </div>

  }, []); // Empty dependency array means this runs once on mount

  return (
    <div
      className="glass-card social-feed-card-component d-flex flex-column" // flex-column to manage internal layout
      style={{ borderTop: `20px solid ${primaryColor}` }} // Blue top border
    >
      {/* Card Header */}
      <div
        style={{
          color: primaryColor,
          padding: '10px 1rem',
          fontWeight: 'bold',
          fontSize: '1.25rem',
          borderBottom: '1px solid red'
        }}
        className="d-flex align-items-center justify-content-between"
      >
        <span>{t("socialFeedCard.title")}</span>
        <i className="bi bi-share-fill fs-4"></i> {/* New icon for social media */}
      </div>

      {/* Social Media Embed Area */}
      <div ref={fbContainerRef} className="social-feed-embed-container flex-grow-1">
        {/*
          PLACE YOUR FACEBOOK PAGE PLUGIN EMBED CODE (or other social media widget code) HERE.

          Example for Facebook (you get this from Facebook's Page Plugin configurator):
        */}
        <div
          className="fb-page"
          data-href="https://www.facebook.com/CONATELHaiti/" // <<<--- !!! IMPORTANT: REPLACE WITH YOUR PAGE URL !!!
          data-tabs="timeline"
          data-width="350" // A base width, but data-adapt-container-width="true" is key
          data-height="400" // Adjust this height as needed for the feed length
          data-small-header="true"
          data-adapt-container-width="true" // This makes it responsive to the parent container
          data-hide-cover="false"
          data-show-facepile="false"
        >
          <blockquote cite="https://www.facebook.com/CONATELHaiti/" className="fb-xfbml-parse-ignore">
            <a href="https://www.facebook.com/CONATELHaiti/">CONATEL Haiti</a> {/* Replace with your page name */}
          </blockquote>
        </div>

        {/*
          For Twitter (X), you'd embed a timeline widget similarly:
          <a class="twitter-timeline" href="https://twitter.com/YourTwitterHandle?ref_src=twsrc%5Etfw">Tweets by YourTwitterHandle</a>
          <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>
        */}
      </div>
    </div>
  );
}