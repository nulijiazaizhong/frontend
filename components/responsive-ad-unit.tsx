// https://github.com/btk/nextjs-google-adsense/blob/master/src/components/ResponsiveAdUnit.tsx

import React, { useEffect } from 'react';
import Script, { ScriptProps } from "next/script";

declare const window: any;

type ResponsiveAdUnitProps = {
  publisherId: string;
  slotId: string;
  type?: string;
  style?: any;
  key?: string;
};

const initAd = () => {
  (window.adsbygoogle = window.adsbygoogle || []).push({});
};

export function ResponsiveAdUnit({
  publisherId,
  slotId,
  type = "default-ad-unit-type",
  style = {},
  key = `${slotId}-${type}`,
}: ResponsiveAdUnitProps): JSX.Element | null {

  useEffect(() => {
    try {
      if (window.adsbygoogle && window.adsbygoogle.loaded) {
        initAd();
      }
    }
    catch (error) {
        console.error("nextjs-google-adsense: Error initializing adsbygoogle", error);
    }
  })

  const _publisherId =
      process.env.NEXT_PUBLIC_ADSENSE_PUBLISHER_ID ?? publisherId;

  if(!_publisherId || !slotId){
    console.error("nextjs-google-adsense: publisherId or slotId can't be empty for the unit");
    return null;
  }

  style.display = "block";
  return (
    <div key={key} style={style}>
      <ins
        className="adsbygoogle"
        style={style}
        data-ad-client={`${_publisherId}`}
        data-ad-slot={String(slotId)}
        data-ad-format="auto"
      />
    </div>
  );
}