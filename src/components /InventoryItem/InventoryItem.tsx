import React, {ReactNode, useEffect, useState} from 'react';
import styles from './InventoryItem.module.css'
import {InventoryList} from "../../types";
import {chooseItem} from '../../effector/stores'

interface Props {
    children?: ReactNode;
    data: InventoryList;
    onUpdate: () => void;
}
export const InventoryItem = ({data, onUpdate}:Props) => {
    const [deleted, setDeleted] = useState(false)
    const [newCount, setNewCount] = useState<number | undefined>(data.count);
    const [editMode, setEditMode] = useState(false);
    const [itemUpdated, setItemUpdated] = useState(false);

    const firestore = window.firebase.firestore()
    const handleDeleteItem = async (itemId: string) => {
        try {
            await firestore.collection('inventory').doc(itemId).delete()
            console.info('Предмет был успешно удален')
            setDeleted(true)
        } catch (error) {
            console.error('Ошибка при удалении: ', error)
        }
    }

    const handleUpdateCount = async () => {
        if (newCount !== undefined) {
            try {
                await firestore.collection('inventory').doc(data.id).set({ count: newCount }, { merge: true });
                console.info('Число успешно обновлено')
                setEditMode(false)
                onUpdate()
            } catch (error) {
                console.error('Ошибка изменения количества:', error)
            }
        }
    };

    const handleSelectItem = (placeId:string|undefined, place:string|undefined) => {
        if(placeId == undefined) {
            chooseItem(place)
        }
        chooseItem(placeId)
    }

    if (deleted) return null;
    return(
        <div id={data.id} className={styles.root}>
            <div className={styles.itemName} onClick={() => handleSelectItem(data.placeId, data.place?.id)}>{data.name}</div>
            <div className={styles.count}>
                <div>{data.count}</div>
                <div className={styles.controller}>
                    <span onClick={() => setEditMode(true)} className={!editMode ? styles.active : styles.hidden}>изменить</span>
                    <input
                        id={styles.input}
                        className={editMode ? styles.active : styles.hidden}
                        type="number"
                        value={newCount !== undefined ? newCount : ''}
                        onChange={e => setNewCount(parseInt(e.target.value))}
                        onBlur={handleUpdateCount}
                    />
                    <span className={editMode ? styles.active : styles.hidden} onClick={handleUpdateCount}>сохранить</span>
                </div>
                <div onClick={() => handleDeleteItem(data.id)}>удалить</div>
            </div>
        </div>
    )
}