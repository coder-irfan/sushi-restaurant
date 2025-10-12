import React from "react";

const recipes = [
  {
    id: "1",
    img: "images/dragon-sushi.webp",
    title: "Dragon Sushi",
    text: "Ingredients: Fresh eel, avocado, cucumber, and sushi rice wrapped in nori, topped with sweet eel sauce.",
    price: "$50",
  },

  {
    id: "2",
    img: "images/creamy-sushi.webp",
    title: "Creamy Sushi",
    text: "Ingredients: Sushi rice, crab sticks, avocado, and cucumber mixed with creamy mayo sauce.",
    price: "$65",
  },

  {
    id: "3",
    img: "images/roll-salmon-sushi.webp",
    title: "Roll Salmon Sushi",
    text: "Ingredients: Sushi rice, fresh salmon, cucumber, avocado, and nori sheets rolled to perfection.",
    price: "$40",
  },
];

function Recipe() {
  return (
    <>
      <section className="px-4 sm:px-6 md:px-8 py-6 lg:px-16">
        {recipes.map((recipe, id) => (
          <div className="max-w-lg md:max-w-6xl mx-auto py-6 md:py-0" key={id}>
            <div
              className={`flex flex-col md:flex-row justify-center items-center gap-4 md:gap-6 lg:gap-8 ${recipe.id === "2" ? "md:flex-row-reverse" : ""}`}
            >
              <div className="">
                <img
                  src={recipe.img}
                  alt={recipe.title}
                  className="md:h-60 lg:h-72 xl:h-[21.875rem] w-full object-cover bg-deepGray"
                  width={525}
                  height={350}
                />
              </div>

              <div className="md:max-w-[18.75rem] lg:max-w-[25rem] space-y-2 md:space-y-4">
                <h3 className="font-bold font-cinzel text-lg md:text-xl xl:text-2xl text-softBeigeYellow">
                  {recipe.title}
                </h3>

                <p className="text-lightGray lg:text-lg xl:text-xl">
                  {recipe.text}
                </p>

                <h4 className="font-bold font-cinzel text-xl xl:text-3xl text-softBeigeYellow">
                  {recipe.price}
                </h4>
              </div>
            </div>
          </div>
        ))}
      </section>
    </>
  );
}

export default Recipe;
