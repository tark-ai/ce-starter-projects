import type { Handle } from "@sveltejs/kit";

export const handle: Handle = async ({ event, resolve }) => {
  return resolve(event, {
    preload: ({ type, path }) => {
      if (type === "js" || type === "css") return true;
      if (type === "font" && (path.includes("inter") || path.includes("instrument-serif")))
        return true;
      return false;
    },
  });
};
