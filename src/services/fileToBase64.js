const FileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
        const fileReader = new FileReader();
        fileReader.readAsDataURL(file);
        fileReader.onloadend = () => {
            const base64String = fileReader.result.replace(/^data:image\/[a-zA-Z]+;base64,/, "");
            resolve(base64String);
        };
        fileReader.onerror = (error) => reject(error);
    });
};

const FilesToBase64 = async (files) => {
    if (!Array.isArray(files)) return [];

    const validFiles = files.filter(file => file instanceof Blob);

    const base64Promises = validFiles.map(file =>
        new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64String = reader.result.replace(/^data:image\/[a-z]+;base64,/, '');
                resolve(base64String);
            };
            reader.onerror = () => reject(new Error(`Failed to convert file: ${file.name}`));
            reader.readAsDataURL(file);
        })
    );

    return await Promise.all(base64Promises);
};

export { FileToBase64, FilesToBase64 };


