import { SchematicsException, Tree, UpdateRecorder } from '@angular-devkit/schematics';
import { requireChangeFile } from './lib';

interface IInsertRecord {
	offset: number;
	content: string;
}

interface IInserter {
	(...match: ReadonlyArray<string>): IInsertRecord | null;
}

export class RegexInserter {
	private readonly update: UpdateRecorder;
	private readonly original: string;
	private readonly orderedUpdate: IInsertRecord[] = [];

	constructor(private readonly tree: Tree, filePath: string) {
		const handle = requireChangeFile(tree, filePath);
		this.update = handle.update;
		this.original = handle.content;
	}

	insert(regexp: RegExp, insert: IInserter) {
		const match = regexp.exec(this.original);
		if (!match) {
			throw new SchematicsException('缺少内容：' + regexp.toString());
		}

		const ret = insert(...match);
		if (!ret) return;

		ret.offset += match.index;
		this.orderedUpdate.push(ret);
	}

	commit() {
		if (this.orderedUpdate.length === 0) return;

		const updates = this.orderedUpdate.sort(({ offset: offset1 }, { offset: offset2 }) => {
			return offset2 - offset1;
		});

		for (const { content, offset } of updates) {
			this.update.insertRight(offset + 1, content);
		}
		this.tree.commitUpdate(this.update);
	}
}
