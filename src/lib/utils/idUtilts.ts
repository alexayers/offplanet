export function uuid(): string {
    let tempUrl: string = URL.createObjectURL(new Blob());
    let uuid: string = tempUrl.toString();
    URL.revokeObjectURL(tempUrl);
    return uuid.substring(uuid.lastIndexOf('/') + 1);
}

