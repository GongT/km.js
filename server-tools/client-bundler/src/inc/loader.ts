export type IFileMap = Record<string, IFileMapItem>;

export interface IFileMapItem {
	path: string;
	hash: string;
}
