import { useContext } from "react";
import { PlayerContext } from ".";

export const usePlayer = () => {
  const ctx = useContext(PlayerContext);
  return ctx;
};
