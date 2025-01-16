import { chatbotAPI, chatbotMultiPartAPI } from '@app/adapters/APIExporter';
import { UserFacingFile } from '@app/types/UserFacingFile';
import { AssistantChatMessage } from '@sdk/model';
import type { AxiosResponse, RawAxiosRequestConfig } from 'axios';


// TODO: When backend supports persistent files (ie, with a separate file-upload endpoint),
//  this message interface can be changed to use file references in the message. Alternatively,
//  the chat request can be made part of a "chat session" which would inherently include uploaded files.
//  In the case of "chat session", the assistant name could also be managed by the chat session
export interface OutgoingChatMessage {
  assistantName: string;
  message: string;
  files: UserFacingFile[];
}

export async function sendChatMessage(
  message: OutgoingChatMessage,
  signal?: AbortSignal
): Promise<ReadableStream<Uint8Array>> {
  const useMultipart: boolean = message.files.length > 0;

  const assistantChatMessage: AssistantChatMessage = {
    message: message.message,
    assistantName: message.assistantName,
  }

  const axiosOptions: RawAxiosRequestConfig = {
    signal: signal,
  }

  let response: AxiosResponse<string[], never>;

  // Call a different API endpoint depending upon whether there are files to upload or not.
  // NOTE: We could just make all calls go to the multipart endpoint, but I expect that endpoint will be removed
  //  once persistent files are an option on the backend. As such, it seems better to keep the more straightforward
  //  simple POST request here for use in the future.
  if (useMultipart) {
    response = await chatbotMultiPartAPI.assistantChatStreamingMp(
      assistantChatMessage,
      message.files?.map((file: UserFacingFile) => file.blob),
      axiosOptions
    );
  } else {
    response = await chatbotAPI.assistantChatStreaming(assistantChatMessage, axiosOptions);
  }

  if (response.status < 200 || response.status >= 400 || !response.data) {
    switch (response.status) {
      case 500:
        throw new Error('500');
      case 404:
        throw new Error('404');
      default:
        throw new Error('Other');
    }
  }

  // TODO: Move the response parsing here, and offer callbacks or other mechanism for signalling new sources and new
  //  chat message text.
  return ???;
}

