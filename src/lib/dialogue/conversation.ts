export interface Conversation {
    topics: Array<Topic>
}

export interface Topic {
    topic: string
    responses: Array<Response>
}

export interface Response {
    nextTopic: string
    response: string
    callBackName?: string
}
