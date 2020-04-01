import React from 'react';
import {
  FacebookShareButton,
  FacebookMessengerShareButton,
  FacebookMessengerIcon,
  TwitterShareButton,
  TelegramShareButton,
  WhatsappShareButton,
  EmailShareButton,
  FacebookIcon,
  TwitterIcon,
  TelegramIcon,
  WhatsappIcon,
  EmailIcon,
} from 'react-share';

export default props => {
  const shareUrl = props.url;
  // const content = props.c || 'fans Club';
  const content = <p>some text goes here</p>;

  return (
    <div className="Demo__container">
      <div className="Demo__some-network">
        <FacebookShareButton
          url={shareUrl}
          quote={content}
          className="Demo__some-network__share-button"
        >
          <FacebookIcon size={32} round />
        </FacebookShareButton>

        {/* <div>
            <FacebookShareCount url={shareUrl} className="Demo__some-network__share-count">
              {count => count}
            </FacebookShareCount>
          </div> */}
      </div>

      <div className="Demo__some-network">
        <FacebookMessengerShareButton
          url={shareUrl}
          appId="521270401588372"
          className="Demo__some-network__share-button"
        >
          <FacebookMessengerIcon size={32} round />
        </FacebookMessengerShareButton>
      </div>

      <div className="Demo__some-network">
        <TwitterShareButton
          url={shareUrl}
          content={content}
          className="Demo__some-network__share-button"
        >
          <TwitterIcon size={32} round />
        </TwitterShareButton>

        {/* <div className="Demo__some-network__share-count">&nbsp;</div> */}
      </div>

      <div className="Demo__some-network">
        <TelegramShareButton
          url={shareUrl}
          content={content}
          className="Demo__some-network__share-button"
        >
          <TelegramIcon size={32} round />
        </TelegramShareButton>

        {/* <div className="Demo__some-network__share-count">&nbsp;</div> */}
      </div>

      <div className="Demo__some-network">
        <WhatsappShareButton
          url={shareUrl}
          content="some text goes here"
          separator=":: "
          className="Demo__some-network__share-button"
        >
          <WhatsappIcon size={32} round />
        </WhatsappShareButton>

        {/* <div className="Demo__some-network__share-count">&nbsp;</div> */}
      </div>

      <div className="Demo__some-network">
        <EmailShareButton
          url={shareUrl}
          subject={content}
          body="body"
          className="Demo__some-network__share-button"
        >
          <EmailIcon size={32} round />
        </EmailShareButton>
      </div>
    </div>
  );
};
