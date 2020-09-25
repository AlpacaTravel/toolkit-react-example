# Toolkit integration example with React

Example of binding the toolkit into a react application.

Add the toolkit (and encoding dependency) to your project

```
yarn add @alpaca-travel/toolkit encoding
```

## Online Demo

[![Edit Demo](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/alpaca-toolkit-react-basic-1jxor-1jxor?file=/src/use-view.tsx)

## Hook Example

The following is an example of a basic React hook that illustrates integration into your react application.

```
import { useCallback, useState, useEffect, useMemo } from "react";
import { View } from "@alpaca-travel/toolkit";

const useView = (url: string, container?: HTMLDivElement | string | null) => {
  // State to contain the basic rendered features
  const [items, setItems] = useState<any[]>();
  // State to contain the view
  const [view, setView] = useState<View>();

  // Basic creation of our view
  useEffect(() => {
    if (url && container) {
      setView(() => {
        // A view will interact with our asset
        return new View({
          url,
          container,
          width: 800,
          height: 600,
        });
      });
    }
  }, [url, container]);

  // Observer to events in our view
  const on = useMemo(() => {
    if (view?.on) {
      return view.on;
    }
  }, [view]);
  const off = useMemo(() => {
    if (view?.off) {
      return view.off;
    }
  }, [view]);

  // Example of obtaining the items (communicating to data in window)
  useEffect(() => {
    if (view && !items) {
      let mounted = true;
      const safe = (fn: Function, ...args: any[]) => {
        if (mounted) {
          fn(...args);
        }
      };

      // get the items
      const fetchItems = async () => {
        const obtainedItems = await view.getItems();

        safe(setItems, obtainedItems);
      };

      fetchItems();
    }
  }, [view, items]);

  // Set the feature shown
  const setSelectedFeature = useCallback(
    (id: string) => {
      if (view && /mapfeature/.test(id)) {
        view.setSelectedFeature(id);
      }
    },
    [view]
  );

  // Indicate a feature (hover)
  const setIndicatedFeature = useCallback(
    (id: string) => {
      if (view && /mapfeature/.test(id)) {
        view.setIndicatedFeature(id);
      }
    },
    [view]
  );

  return {
    loading: !view,
    items,
    on,
    off,
    setSelectedFeature,
    setIndicatedFeature,
  };
};

export default useView;
```
