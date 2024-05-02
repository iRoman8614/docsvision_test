import React, {FC, ReactNode, useState} from 'react'
import {PlaceNode} from "../../types";
import styles from './PlacesItem.module.css'
import { useStoreMap } from 'effector-react';
import {$storePlaceId, $childrenLevels, choosePlace, chechChildrenLevels, $storeItemId, clearId} from '../../effector/stores'

interface Props {
    children?: ReactNode;
    data: PlaceNode;
    id?: string
    warning?: string;
}
interface Node {
    id: string;
    name?: string;
    children?: Node[];
}

function findNodeIdInFirstLevelChildren(tree: Node, searchId: string): string | undefined {
    if (tree.children) {
        for (const child of tree.children) {
            if (child.id === searchId) {
                return child.id;
            }
        }
    }
    return undefined
}

export const PlacesItem:FC<Props> = ({children, data, id, warning}:Props) => {
    const[status, setStatus] = useState<'hidden' | 'active' | 'found'>('hidden')
    const placeId = useStoreMap({
        store: $storePlaceId,
        keys: [],
        fn: (storeState) => storeState,
    })
    const childrenBoolean = useStoreMap({
        store: $childrenLevels,
        keys: [],
        fn: (storeState) => storeState,
    })
    const itemId = useStoreMap({
        store: $storeItemId,
        keys: [],
        fn: (storeState) => storeState,
    })
    const changeStatus = () => {
        setStatus(status == 'hidden' ? 'active' : 'hidden')
        clearId('')
    }
    const result = findNodeIdInFirstLevelChildren(data, itemId)
    return(
        <div>
            <div className={(placeId == '' && data.id == warning) ? styles.found : ''}>
                <a className={styles.title} onClick={() => {
                    choosePlace(data.id)
                    data.children.length > 0 ? chechChildrenLevels(true) : chechChildrenLevels(false)
                }}>{data.name}</a>
                {data.children.length > 0 && <span className={styles.link} onClick={() => {changeStatus()}}>
                    {status == 'hidden' ? ' развернуть' : ' свернуть'}
                </span>}
            </div>
            <div id={data.id} className={(result == itemId || status == 'active') ? styles.active : styles.hidden}>
                {data.children.map((child)=>{
                    return(
                        <div key={child.id} className={styles.level}>
                            <PlacesItem warning={result} id={child.id} data={child}></PlacesItem>
                        </div>
                    )
                })}
                {children}
            </div>
        </div>
    )
}