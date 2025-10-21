import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';

export const writeFile = async (path, data) => {
    const directory = Directory.Documents//Directory.Cache//
    const encoding  = Encoding.UTF8

    const { uri } = await Filesystem.writeFile({ path, data, directory})

    return uri
}

export const readFile = async (path) => {
    const directory = Directory.Documents
    const encoding  = Encoding.UTF8
    const contents  = await Filesystem.readFile({ path, directory, encoding })
}

export const deleteFile = async (path) => {
    await Filesystem.deleteFile({ path, directory: Directory.Documents });
};

export const readFilePath = async (path) => {
  // Here's an example of reading a file with a full file path. Use this to
  // read binary data (base64 encoded) from plugins that return File URIs, such as
  // the Camera.
    const contents = await Filesystem.readFile({ path });

};