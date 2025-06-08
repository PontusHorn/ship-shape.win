import type { Position } from './Position';

export type Vertex = {
	position: Position;
	controlPointForward?: Position;
	controlPointBackward?: Position;
	isMirrored?: boolean;
};
