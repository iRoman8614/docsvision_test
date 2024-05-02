import React, {useState, ChangeEvent, FormEvent} from 'react';
import styles from './Form.module.css'

interface FormData {
    name: string;
    count: number;
    place: string;
}
interface Props {
    id: string;
}
const FormComponent = ({id}:Props) => {
    const firestore = window.firebase.firestore()
    const [formData, setFormData] = useState<FormData>({
        name: '',
        count: 0,
        place: id
    })
    const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setFormData({
            ...formData,
            [name]: value
        })
    }
    const handleSubmit = async (event: FormEvent) => {
        event.preventDefault()
        if (formData.name.length === 0) {
            alert('Введите название')
            return
        }
        if (formData.count === 0) {
            alert('Введите количество')
            return
        }
        try {
            const placeDocRef = firestore.collection('places').doc(formData.place);
            await firestore.collection('inventory').doc().set({
                name: formData.name,
                count: formData.count,
                place: placeDocRef
            });
            console.info('Предмет успешно добавлен');
            setFormData({ name: '', count: 0, place: id });
        } catch (error) {
            console.error('Ошибка добавления:', error);
        }
    }

    return (
        <form onSubmit={handleSubmit} className={styles.root}>
            <div className={styles.input}>
                <label>Название:</label>
                <input type="text" name="name" value={formData.name} onChange={handleInputChange} />
            </div>
            <div className={styles.input}>
                <label>Количество:</label>
                <input type="number" name="count" value={formData.count} onChange={handleInputChange} />
            </div>
            <button type="submit">Добавить</button>
        </form>
    )
}

export default FormComponent
