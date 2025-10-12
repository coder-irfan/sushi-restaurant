import React from "react";

function ImageDivider() {
  return (
    <>
      <section className="pt-6 pb-14 md:pb-20 lg:pt-0">
        <img
          src="images/about-divider-bg.webp"
          alt="statue standing in a resturant"
          className="h-56 md:h-64 lg:h-80 xl:h-96 w-full object-cover bg-deepGray"
          width={1540}
          height={385}
        />
      </section>
    </>
  );
}

export default ImageDivider;
