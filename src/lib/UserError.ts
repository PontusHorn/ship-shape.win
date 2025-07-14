/**
 * Errors of this class include a message that is suitable to present directly
 * to a user, along with the more technical error.
 */
export class UserError extends Error {
	userMessage: string;
	constructor(message: string, userMessage = message) {
		super(message);
		this.userMessage = userMessage;
	}
}
