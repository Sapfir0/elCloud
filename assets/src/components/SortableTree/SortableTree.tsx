import { observer } from 'mobx-react';
import React from 'react';
import SortableTree, { TreeIndex, TreeItem, TreeNode } from 'react-sortable-tree';
import FileExplorerTheme from 'react-sortable-tree-theme-file-explorer';
import 'react-sortable-tree/style.css';
import { SERVICE_IDENTIFIER } from '../../inversify/inversifyTypes';
import { useInject } from '../../shared/hooks/injectHook';
import { SortableTreeStore } from './SortableTreeStore';

export const SortableFileTree = observer(() => {
    const store = useInject<SortableTreeStore>(SERVICE_IDENTIFIER.SortableTreeStore);

    const canNodeHaveChildren = (node: TreeItem): boolean => node.is_folder;
    const getNodeKey = (data: TreeNode & TreeIndex) => data.node.path

    return (
        <div style={{ height: 400 }}>
            <SortableTree
                rowHeight={45}
                innerStyle={{
                    paddingTop: '30px',
                }}
                theme={FileExplorerTheme}
                treeData={store.treeState}
                onChange={store.changeState}
                onMoveNode={store.moveFile}
                getNodeKey={getNodeKey}
                canNodeHaveChildren={canNodeHaveChildren}
            />
        </div>
    );
});
