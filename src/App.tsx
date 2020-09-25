import React, { useRef, useCallback, useState, useEffect } from "react";

import useView from "./use-view";

export default function App() {
  const [selected, setSelected] = useState<any>();
  const [indicated, setIndicated] = useState<any>();

  const div = useRef<HTMLDivElement>(null);

  // Example hook that integrates with the alpaca-toolkit
  const { items, loading, setSelectedFeature, on, off } = useView(
    "https://embed.alpacamaps.com/2181f781-95f5-11e8-a4a7-024bc0398b11/embed",
    "alpaca"
  );

  // Example of registering to observe events...
  // Listen to events
  useEffect(() => {
    if (on && off) {
      const selectedListener = (event: any) =>
        setSelected(event.selectedFeature);
      const indicatedListener = (event: any) => {
        if (
          Array.isArray(event.indicatedFeatures) &&
          event.indicatedFeatures.length
        ) {
          setIndicated(event.indicatedFeatures[0]);
        }
      };
      on("selected", selectedListener);
      on("indicated", indicatedListener);

      return () => {
        off("selected", selectedListener);
        off("indicated", indicatedListener);
      };
    }
  }, [on, off, setIndicated, setSelected]);

  // Example of triggering events into to the window from the page
  const onClickHandler = useCallback(
    (item) => {
      setSelectedFeature(item.id);
    },
    [setSelectedFeature]
  );

  return (
    <>
      <div
        id="alpaca"
        ref={div}
        style={{ width: 800, height: 600, overflow: "hidden" }}
      />
      {loading === true ? "loading" : null}
      <ul>
        {Array.isArray(items) &&
          items
            .filter((item) => item.title && /mapfeature/.test(item.id))
            .map((item) => (
              <li key={item.id} onClick={() => onClickHandler(item)}>
                {item.title}{" "}
                {indicated && indicated.id === item.id && <>Indicated</>}{" "}
                {selected && selected.id === item.id && <>Selected</>}
              </li>
            ))}
      </ul>
    </>
  );
}
