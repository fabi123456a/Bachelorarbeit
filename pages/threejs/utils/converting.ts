export function arrayBufferToBase64(arrayBuffer: any) {
  const bytes = new Uint8Array(arrayBuffer);
  const binaryString = bytes.reduce(
    (acc, byte) => acc + String.fromCharCode(byte),
    ""
  );
  return btoa(binaryString);
}

export function base64ToBlob(base64String: string, sliceSize = 512) {
  const byteCharacters = atob(base64String);
  const byteArrays = [];

  for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
    const slice = byteCharacters.slice(offset, offset + sliceSize);

    const byteNumbers = new Array(slice.length);
    for (let i = 0; i < slice.length; i++) {
      byteNumbers[i] = slice.charCodeAt(i);
    }

    const byteArray = new Uint8Array(byteNumbers);
    byteArrays.push(byteArray);
  }

  const blob = new Blob(byteArrays, { type: "application/octet-stream" });
  return blob;
}
