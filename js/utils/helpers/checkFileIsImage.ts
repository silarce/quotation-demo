const checkFileIsImage = (file: File) => {
  const imageReg = /^image/;
  const isImage = imageReg.test(file.type);

  return isImage;
};

export { checkFileIsImage };
