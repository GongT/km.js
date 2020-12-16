export interface IImportMapProto {
	imports: IImportMapProtoImport;
	depcache: Record<string /* files */, string[] /* dep files */>;
}

export type IImportMapProtoImport = Record<string, IImportMapProtoImportItem>;
export interface IImportMapProtoImportItem {
	fileName: string;
	hash: string;
}
