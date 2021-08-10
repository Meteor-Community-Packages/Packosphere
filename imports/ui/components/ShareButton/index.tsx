import React from 'react';
import { ShareOutline } from 'heroicons-react';
import { setClipboardText } from '../../../utils';

export const ShareButton = (): JSX.Element => {
  const handleClick = async (): Promise<void> => {
    // if navigator.share is not available copy window.location.href to clipboard
    if (typeof navigator.share === 'undefined') {
      try {
        await setClipboardText(window.location.href);
      } catch (e) {
        console.log(e);
      }
    } else {
      try {
        await navigator.share({
          title: document.title,
          url: window.location.href,
        });
      } catch (e) {
        console.log(e);
      }
    }
  };
  return <button onClick={handleClick} className="flex items-center justify-center w-full h-full">
    <ShareOutline size={24} className="" />
  </button>;
};
