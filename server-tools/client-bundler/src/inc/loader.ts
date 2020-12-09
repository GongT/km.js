export type IFileMap = Record<string, IFileMapItem>;

export interface IFileMapItem {
	fileName: string;
	hash: string;
}
