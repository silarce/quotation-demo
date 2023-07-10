const createJSONDonwload = (obj: any, fileName: string) => {
  const handleDownload = () => {
    const jsonString = JSON.stringify(obj);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const downloadLink = document.createElement('a');
    downloadLink.href = url;
    downloadLink.download = fileName;
    downloadLink.click();
  };

  return handleDownload;
};

export { createJSONDonwload };
