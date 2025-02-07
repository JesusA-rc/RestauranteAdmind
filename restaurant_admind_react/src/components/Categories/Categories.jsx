import React,{useState,useEffect} from 'react'
import styles from './Categories.module.css'
import { useQuery } from '@tanstack/react-query';
import  StatesBtn  from '/src/components/StatesButton/StateBtn'
import axios from 'axios';

const fetchCategories = async () => {
  const response = await fetch(`${import.meta.env.VITE_BASE_URL}/api/getCategories`);
  if (!response.ok) {
    throw new Error('Error al obtener las categorías');
  }
  return response.json();
};


const Categories = () => {


  const [categoryName, setCategoryName] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [isVisible, setIsVisible] = useState(false);
  const [stateButton,setStateButton] = useState(0);
  const [selectedId, setSelectedId] = useState('');

  const { data,refetch} = useQuery({
    queryKey: ['categories'],
    queryFn: fetchCategories,
  });

  const categories = Array.isArray(data) ? data : data?.categories || [];

    const addCategory = async (e) => {
      e.preventDefault();
      try {
        if (categoryName.trim() === '' || imageUrl.trim() === '') return; 
        const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/api/insertCategory`, { 
          name_category: categoryName,
          image_url: imageUrl,
          visible: isVisible
        });        
        
        setCategoryName('');
        setImageUrl('');
        refetch();
        alert('Categoría agregada exitosamente');
      } catch (error) {
        alert('Error al agregar la categoría: ' + error.message);
      }
      clearText();
    };

    const updateCategory = async (e) => {
      e.preventDefault();
      try {
        if (!selectedId || categoryName.trim() === '' || imageUrl.trim() === '') {
          alert('Por favor, complete todos los campos');
          return;
        }
    
        await axios.put(`${import.meta.env.VITE_BASE_URL}/api/updateCategory`, {
          id_category: selectedId,
          name_category: categoryName,
          image_url: imageUrl,
          visible: isVisible,
        });        
    
        alert('Categoría actualizada exitosamente');
        refetch();
        clearText();
      } catch (error) {
        alert('Error al actualizar la categoría: ' + error.message);
      }
    };

    const deleteCategory = async (e) =>{
      e.preventDefault();
      try {
        await axios.put(`${import.meta.env.VITE_BASE_URL}/api/deleteCategory`, {
          id_category: selectedId,
        });
      } catch (error) {
        alert('Error al borrar la categoría: ' + error.message);
      }
      
      refetch();
      clearText();
    }

    useEffect(() => {
      if (selectedId) {
        const selectedCategory = categories.find(
          (category) => category.id_category === parseInt(selectedId)
        );
        if (selectedCategory) {
          setCategoryName(selectedCategory.name_category || '');
          setImageUrl(selectedCategory.image_url || '');
          setIsVisible(!!selectedCategory.visible);
        }
      }
    }, [selectedId, categories]);
  

    const changeState = (value) =>{
      setStateButton(value);
      clearText();
    }

    const clearText =()=>{
      setImageUrl('');
      setCategoryName('');
      setIsVisible(false);
      setSelectedId('');
    }


  return (
    <div className={styles.categories}>
    <StatesBtn stateButton={stateButton} changeState={changeState}></StatesBtn>
    {
      stateButton === 0 ? 
      (
        <form onSubmit={addCategory} className="form">
        <div className="formRow">
        <div className="formGroup">
            <label htmlFor="categoryName">Category Name:</label>
            <input type="text" id="categoryName" name="categoryName"value={categoryName} onChange={(e) => setCategoryName(e.target.value)}
            placeholder="Enter category name"required/>
        </div>
        

        <div className="formGroup">
            <label htmlFor="imageUrl">Image URL:</label>
            <input type="url" id="imageUrl" name="imageUrl" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)}
            placeholder="Enter image URL"required/>
        </div>

        <div className="formGroup">
          <label htmlFor="visibility">Visible:</label>
          <select id="visible" name="visibible" value={isVisible} onChange={(e) => setIsVisible(e.target.value === 'true')}required>
            <option value="false">False</option>
            <option value="true">True</option>
          </select>
        </div>

        <button type="submit" className="submitBtn">Submit</button>
        </div>
    </form>
      ) 
      : ''
    }

    {
      (stateButton === 1 || stateButton === 2) ?
      (
          <form className="form" onSubmit={stateButton===1 ? updateCategory : deleteCategory}>
            <div className="formRow">
            <div className="formGroup">
            <label htmlFor="categorySelect">ID</label>
            <select id="categorySelect" value={selectedId} onChange={(e) => setSelectedId(e.target.value)} required>
              <option value="">Select an ID</option>
              {categories.map((category) => (
                <option key={category.id_category} value={category.id_category}>
                  {category.id_category}
                </option>
              ))}
            </select>
          </div>
          <div className="formGroup">
            <label htmlFor="categoryName">Category Name:</label>
            <input type="text" id="categoryName" name="categoryName"value={categoryName} onChange={(e) => setCategoryName(e.target.value)}
            placeholder="Enter category name" required={stateButton===1} disabled={stateButton===2}/>
          </div>
          <div className="formGroup">
            <label htmlFor="imageUrl">Image URL:</label>
            <input type="url" id="imageUrl" name="imageUrl" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)}
            placeholder="Enter image URL" required={stateButton===1} disabled={stateButton===2}/>
          </div>
          <div className="formGroup">
          <label htmlFor="visibility">Visible:</label>
          <select id="visible" name="visibible" value={isVisible} onChange={(e) => setIsVisible(e.target.value === 'true')} required={stateButton===1} disabled={stateButton===2}>
            <option value="false">False</option>
            <option value="true">True</option>
          </select>
          </div>

          <button type="submit" className="submitBtn">
            {
              stateButton===1 ? 'Update' : 'Delete'
            }
            </button>
          </div>
        </form>
      ) : ''
    }


    <div className="table_container">
    <div className="styles.table_wrapper">
          <table>
            <thead>
              <tr>
                <th>Id</th>
                <th>Categorie</th>
                <th>Url</th>
                <th>image</th>
                <th>Visible</th>
              </tr>
            </thead>
            <tbody>
            {
              categories.map((item) => (
                <tr key={item.id_category}>
                  <td>{item.id_category}</td>
                  <td>{item.name_category}</td>
                  <td>{item.image_url}</td>
                  <td><img src={item.image_url} alt="" /></td>
                  <td>
                    <span className={`${styles.visible} ${item.visible ? styles.true : styles.false}`}>
                      {item.visible ? "true" : "false"}
                    </span>
                  </td>
                </tr>
              ))
            }
            </tbody>
          </table>
      </div>
      </div>
    
    </div>
  )
}

export default Categories