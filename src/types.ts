export interface PlaceDocument {
    id: string;
    data: {
        parts?: { id: string; name: string }[];
        name: string;
    }
}
export interface Inventory {
    id: string;
    data: {
        name: string;
        count?: number;
        placeId?: string;
        place?: {id:string};
    }
}
export interface PlaceNode {
    id: string;
    data?: any;
    name?: string;
    children: PlaceNode[];
}
export interface InventoryList {
    id: string;
    count?: number;
    name: string;
    placeId?: string;
    place?: {id?: string};
}