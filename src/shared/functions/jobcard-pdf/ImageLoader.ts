export const brandLogo = async () => {
  return {
    style: "brandLogo",
    image: await getBase64ImageFromURL(`${process.env.PUBLIC_URL}/logo512.png`),
    fit: [76, 76],
  };
};

export const footerStripes = async () => {
  return {
    columns: [
      {
        image: await getBase64ImageFromURL(
          `${process.env.PUBLIC_URL}/stripes-full.png`
        ),
        width: 100,
        height: 60,
      },
    ],
  };
};

export const getBase64ImageFromURL = (url: string) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.setAttribute("crossOrigin", "anonymous");

    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;

      const ctx = canvas.getContext("2d");
      ctx?.drawImage(img, 0, 0);

      const dataURL = canvas.toDataURL("image/png");

      resolve(dataURL);
    };

    img.onerror = (error) => {
      reject(error);
    };

    img.src = url;
  });
};
