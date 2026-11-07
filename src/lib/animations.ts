import gsap from "gsap";

const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%";

export function createScrambleTween(
  element: HTMLElement,
  text: string
) {
  const progress = { value: 0 };

  return gsap.to(progress, {
    value: text.length,
    duration: 1.8,
    ease: "none",

    onUpdate: () => {
      const revealed = Math.floor(progress.value);

      element.textContent = text
        .split("")
        .map((char, index) => {
          if (char === " " || index < revealed) {
            return char;
          }

          return characters[
            Math.floor(Math.random() * characters.length)
          ];
        })
        .join("");
    },

    onComplete: () => {
      element.textContent = text;
    },
  });
}