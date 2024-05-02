import React, {FC, useEffect, useState} from 'react';
import styles from './ItemList.module.css'
import {Inventory, InventoryList} from "../../types";
import {InventoryItem} from "../InventoryItem/InventoryItem";
import {useUnit} from "effector-react";
import {$storePlaceId, $childrenLevels} from '../../effector/stores'
import Form from "../form/Form";

function transformData(array: Inventory[]): InventoryList[] {
    return array.map(item => ({
        id: item.id,
        count: item.data.count,
        name: item.data.name,
        placeId: item.data.placeId,
        place: { id: item.data.place?.id }
    }))
}
export const ItemList:FC = () => {
    const [inventory, setInventory] = useState<Inventory[]>([])
    const placeId = useUnit($storePlaceId)
    const formAvailable = useUnit($childrenLevels)
    const firestore = window.firebase.firestore()

    const fetchInventory = () => {
        firestore
            .collection('inventory')
            .get()
            .then((snapshot: any) => {
                const docs: Inventory[] = snapshot.docs.map((doc: any) => ({
                    id: doc.id,
                    data: doc.data()
                }));
                setInventory(docs);
            })
    };

    useEffect(() => {
        fetchInventory();
    }, [firestore]);

    const transformedData: InventoryList[] = transformData(inventory)
    console.log('inventory', inventory)
    console.log('transformedData', transformedData)

    const filteredData = placeId === '' ? transformedData : transformedData.filter(item => {
        return item.placeId === placeId || (item.place && item.place.id === placeId)
    })

    return(
        <div className={styles.root}>
            <div className={styles.title}>Инвентарь</div>
            {filteredData.map(item => {
                if (item.name && item.name.length > 0) {
                    return (
                        <InventoryItem onUpdate={fetchInventory} data={item} key={item.id} />
                    )
                }
            })}
            {!formAvailable && <div className={styles.form}>
                <h3>Добавить оборудование</h3>
                <Form id={placeId}/>
            </div>}
        </div>
    )
}