export const fileToBase64 = (file: Blob): Promise<ArrayBuffer | string | null> => new Promise((
  resolve,
  reject
) => {
  // alert(file)
  const reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload = () => resolve(reader.result);
  reader.onerror = (error) => reject(error);
});



export const base64toBlob = (data: string) => {
  // Cut the prefix `data:application/pdf;base64` from the raw base 64
  const base64WithoutPrefix = data.substr('data:application/pdf;base64,'.length);

  const bytes = atob(base64WithoutPrefix);
  let length = bytes.length;
  let out = new Uint8Array(length);

  while (length--) {
      out[length] = bytes.charCodeAt(length);
  }

  return new Blob([out], { type: 'application/pdf' });
};