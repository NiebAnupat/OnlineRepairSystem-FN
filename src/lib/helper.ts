const bufferToUrl = (buffer: Buffer): string => {
    const blob = new Blob([buffer]);
    return URL.createObjectURL(blob);
}

const BufferToBase64 = (buffer: Buffer | undefined) => {
    const b64 = new Buffer(buffer).toString('base64')
    const mimeType = 'image/png' // e.g., image/png
    return `data:${mimeType};base64,${b64}`
};

export {bufferToUrl, BufferToBase64};
