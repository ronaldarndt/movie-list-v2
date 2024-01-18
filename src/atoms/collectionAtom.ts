import { atomWithStorage } from "jotai/utils";

const KEY = "collection";

const defaultData = {
  selected: "",
  selectedName: "",
};

type Collection = typeof defaultData;

const savedData = localStorage.getItem(KEY);

export const collectionAtom = atomWithStorage<Collection>(
  KEY,
  savedData ? JSON.parse(savedData) : defaultData,
);
