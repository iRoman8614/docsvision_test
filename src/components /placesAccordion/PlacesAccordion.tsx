import React, {FC, useEffect, useState} from 'react';
import styles from './PlacesAccordion.module.css'
import {PlaceDocument, PlaceNode} from "../../types";
import {PlacesItem} from "../placesItem/PlacesItem";
import {clearId} from '../../effector/stores'

function buildHierarchy(data: PlaceDocument[]): PlaceNode[] {
    const nodeMap: { [id: string]: PlaceNode } = {}
    data.forEach(node => {
        nodeMap[node.id] = {
            id: node.id,
            name: node.data.name,
            children: []
        }
    })
    const result: PlaceNode[] = []
    data.forEach(node => {
        const treeNode = nodeMap[node.id]
        if (!treeNode.children) {
            treeNode.children = []
        }
        if (node.data.parts) {
            node.data.parts.forEach(part => {
                const childNode = nodeMap[part.id]
                if (childNode) {
                    treeNode.children.push(childNode);
                }
            })
        }
        const isRootNode = !data.some(
            parent =>
                parent.data.parts &&
                parent.data.parts.some(part => part.id === node.id)
        )
        if (isRootNode) {
            result.push(treeNode);
        }
    })
    return result;
}

export const PlacesAccordion:FC = () => {
    const [places, setPlaces] = useState<PlaceDocument[]>([]);
    useEffect(() => {
        const firestore = window.firebase.firestore()
        firestore
            .collection('places')
            .get()
            .then((snapshot: any) => {
                const docs: PlaceDocument[] = snapshot.docs.map((doc: any) => ({
                    id: doc.id,
                    data: doc.data(),
                }));
                setPlaces(docs)
            })
    }, [])
    const hierarchy = buildHierarchy(places)

    return (
        <div className={styles.root}>
            <div className={styles.title}>Помещения</div>
            <div className={styles.container}>
                {hierarchy.map((place, index) => {
                    return (
                        <div key={index}>
                            <PlacesItem id={place.id} data={place}></PlacesItem>
                        </div>
                    );
                })}
            </div>
            <div onClick={() => {clearId('')}} className={styles.refresh}>Обновить</div>
        </div>
    )
}
