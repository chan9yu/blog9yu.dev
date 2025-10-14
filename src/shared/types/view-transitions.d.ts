/**
 * View Transitions API Type Definitions
 * https://developer.mozilla.org/en-US/docs/Web/API/View_Transitions_API
 */

interface ViewTransition {
	finished: Promise<void>;
	ready: Promise<void>;
	updateCallbackDone: Promise<void>;
	skipTransition(): void;
}

interface Document {
	startViewTransition(updateCallback: () => void | Promise<void>): ViewTransition;
}
