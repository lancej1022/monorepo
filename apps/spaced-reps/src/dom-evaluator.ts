export interface DOMMessage {
	type: 'GET_DOM'
}

export interface DOMMessageResponse {
	headlines: string[]
}

// TODO: do we still need this now that we dont use educative?
// This runs as a callback AFTER the extension App.tsx has run
const messagesFromExtensionListener = (
	msg: DOMMessage,
	_sender: chrome.runtime.MessageSender,
	sendResponse: (response: DOMMessageResponse) => void,
) => {
	// eslint-disable-next-line no-console -- intentionally logging here
	console.log('[main.tsx] Message received', msg)

	const headlines = Array.from(document.getElementsByTagName<'h2'>('h2')).map(
		(h2) => h2.innerText,
	)

	// Prepare the response object with information about the site
	const response: DOMMessageResponse = {
		headlines,
	}

	sendResponse(response)
	return undefined // TODO: is this `return undefined` right?
}

// Fired when a message is sent from either an extension process or a content script.
chrome.runtime.onMessage.addListener(messagesFromExtensionListener)
