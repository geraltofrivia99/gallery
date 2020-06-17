import React, { memo, useState, useEffect } from 'react';

export const ImageComp = memo(({ image, cacheImage }) => {
    const [load, setLoad] = useState(cacheImage[image] === true); //dsa
    useEffect(() => {
      if (cacheImage[image] === undefined) {
        const img = new Image(300, 200);
        img.src = image;
        img.decode().then(() => {
            cacheImage[image] = true;
            setLoad(true);
        }).catch(() => {
            cacheImage[image] = false;
        })
      }
    }, [image]);
    if (load) {
      return (
          <img className="image" src={image} alt={""} />
      );
    }
    return (
      <div className="image-placeholder" />
    );
  });