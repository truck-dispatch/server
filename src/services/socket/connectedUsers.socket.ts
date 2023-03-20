export const connectedUsers: Record<string, string> = {}

export function getConnectedUserSocketByUserId(userId: string) {
    return connectedUsers[userId];
}

export function addConnectedUser(userId: string, userSocketId: string) {
    connectedUsers[userId] = userSocketId;
}

export function removeConnectedUser(socketId: string) {
    const key = Object.keys(connectedUsers).find((userId) => connectedUsers[userId] === socketId);
    if (key) delete connectedUsers[key];
}

