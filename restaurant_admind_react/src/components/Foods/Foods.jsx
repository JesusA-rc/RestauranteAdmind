import React, { useState,useEffect } from 'react'
import styles from './Foods.module.css'
import  StatesBtn  from '/src/components/StatesButton/StateBtn'
import axios from 'axios';
import { useQuery } from '@tanstack/react-query'

const fetchFoods = async () => {
  const response = await fetch(`${import.meta.env.VITE_BASE_URL}/api/getFoods`);
  if (!response.ok) {
    throw new Error('Error fetching meals.');
  }
  return response.json();
};


const fetchCategories = async () => {
  const response = await fetch(`${import.meta.env.VITE_BASE_URL}/api/getCategories`);
  if (!response.ok) {
    throw new Error('Error fetching categories');
  }
  return response.json();
};

const fetchCountries = async () => {
  const response = await fetch(`${import.meta.env.VITE_BASE_URL}/api/getCountries`);
  if (!response.ok) {
    throw new Error('Error fetching countries.');
  }
  return response.json();
};


const Foods = () => {
  const [stateButton,setStateButton] = useState(0);
  const [nameFood,setNameFood] = useState('');
  const [price,setPrice] = useState('');
  const [description,setDescription] = useState('');
  const [image,setImage] = useState('');
  const [selectedCountry,setSelectedCountry] = useState('');
  const [selectedCategory,setSelectedCategory] = useState('');
  const [selectedFoodId,setSelectedFoodId] = useState('');
  const [searchCategory,setSearchCategory] = useState('');
  const [searchCountry,setSearchCountry] = useState('');
  const [searchNameFood,setSearchNameFood] = useState('');

  const changeState = (value) =>{
    setStateButton(value);
    clearText();
  }

  const {data,refetch} = useQuery({
      queryKey: ['getFoods'],
      queryFn: fetchFoods,
  });

  const {data:dataCategories} = useQuery({
    queryKey: ['categories'],
    queryFn: fetchCategories,
  });

  const{data:dataCountries} = useQuery({
    queryKey: ['countries'],
    queryFn: fetchCountries,
  });

  const [getFoods,setGetFoods] = useState([]);
  const categories = Array.isArray(dataCategories) ? dataCategories : dataCategories?.categories || [];
  const countries = Array.isArray(dataCountries) ? dataCountries : dataCountries?.countries || [];

  useEffect(() => {
    if (data) {
      let filtered = Array.isArray(data) ? data : data?.getFoods || [];
      setGetFoods(filtered);

      if (searchNameFood) {
        filtered = filtered.filter((food) =>
          food.name.toLowerCase().includes(searchNameFood.toLowerCase())
        );
      }
  
      if (searchCategory) {
        filtered = filtered.filter((food) => food.id_category && food.id_category === parseInt(searchCategory));
      }

      if (searchCountry) {
        filtered = filtered.filter((food) => food.pais && food.pais === searchCountry);
      }
  
      setGetFoods(filtered);
    }
  }, [data,searchNameFood, searchCategory, searchCountry]);
  
  const addFood = async (e) =>{
    e.preventDefault();
    try {
      const response = await axios.put(`${import.meta.env.VITE_BASE_URL}/api/insertFood`, {
        nameFood: nameFood,
        price: price,
        description: description,
        image_url: image,
        id_category: selectedCategory,
        pais: selectedCountry
      });      
      refetch();
      clearText();
      alert('Food inseted correctly');
    } catch (error) {
      alert('Error adding the food: ' + error.message);
    }
  };

  const updateFood = async(e) =>{
      e.preventDefault();

      if (nameFood.length > 100) {
        alert("The food name cannot exceed 100 characters.");
        return;
      }
      
      if (description.length > 100) {
        alert("The description cannot exceed 100 characters.");
        return;
      }

      try {
        const response = await axios.put(`${import.meta.env.VITE_BASE_URL}/api/updateFood`, {
          id_food: selectedFoodId,
          nameFood: nameFood,
          price: parseInt(price),
          description: description,
          image: image,
          country: selectedCountry,
          category: selectedCategory
        });
        refetch();
        clearText();
        alert('food update');
      } catch (error) {
        alert('Error updating the food: ' + error.message);
      }
      
  }

  const deleteFood = async(e) =>{
    e.preventDefault();
    try {
      const response = await axios.put(`${import.meta.env.VITE_BASE_URL}/api/deleteFood`, {
        id_food: selectedFoodId,
      });
      refetch();
      alert('The food has been deleted');
    } catch (error) {
      alert('Error deleting the food: ' + error.message);
    }
    
  }

  const clearText = () => {
    setNameFood('');
    setPrice('');
    setDescription('');
    setImage('');
    setSelectedCountry('');
    setSelectedCategory('');
    setSelectedFoodId('');
  };

  const clearFilters = () =>{
    setSearchCategory('');
    setSearchNameFood('');
    setSearchCountry('');
  }

  useEffect(() => {
    if (selectedFoodId) {
      const selectFood= getFoods.find(
        (food) => food.id_food === parseInt(selectedFoodId)
      );
      if (selectFood) {
        setNameFood(selectFood.name || '');
        setImage(selectFood.image_url || '');
        setPrice(selectFood.price || '');
        setDescription(selectFood.description || '');
        setSelectedCountry(selectFood.pais || '');
        setSelectedCategory(selectFood.id_category || '');
      }
    }
  }, [selectedFoodId, categories]);

  return (
    <div className={styles.foods}>
      <StatesBtn stateButton={stateButton} changeState={changeState}></StatesBtn>

      {
        stateButton === 0 ?
        (
          <form onSubmit={addFood} className="form">
          <div className="formRow">
          <div className="formGroup">
              <label htmlFor="nameFood">Food name</label>
              <input type="text" id="categoryFood" name="categoryFood" value={nameFood} onChange={(e) => setNameFood(e.target.value)}
              placeholder="Enter food name"required/>
          </div>
          <div className="formGroup">
              <label htmlFor="price">price</label>
              <input type="text" id="price" name="price" value={price} onChange={(e) => setPrice(e.target.value)}
              placeholder="Enter price"required/>
          </div>
          <div className="formGroup">
            <label htmlFor="Description">Description</label>
            <input type="text" id="Description" name="Description" value={description} onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter description" required/>
          </div>
          <div className="formGroup">
            <label htmlFor="imageURL">Image URL</label>
            <input type="text" id="ImageURL" name="ImageURL" value={image} onChange={(e) => setImage(e.target.value)}
            placeholder="Enter image url" required/>
          </div>

          <div className="formGroup">
                <label htmlFor="countrySelect">Country</label>
                <select id="countrySelect" value={selectedCountry} onChange={(e) => setSelectedCountry(e.target.value)} required>
                  <option value="">
                    Select a country
                  </option>
                  {countries.map((country) => (
                    <option key={country.id_pais} value={country.id_pais}>
                      {country.name_country}
                    </option>
                  ))}
                </select>
          </div>
          </div>

          <div className="formRow">
          <div className="formGroup">
                <label htmlFor="categorySelect">Category</label>
                <select id="categorySelect" value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)} required>
                  <option value="">
                    Select a category
                  </option>
                  {categories.map((category) => (
                    <option key={category.id_category} value={category.id_category}>
                      {category.name_category}
                    </option>
                  ))}
                </select>
          </div>
          <button type="submit" className="submitBtn">Add</button>
          </div>
        </form>
        )
        : ''
      }

    {
      (stateButton === 1 || stateButton === 2) && (
        <form onSubmit={stateButton ===1 ? updateFood : deleteFood} className="form">
          <div className="formRow">
            <div className="formGroup">
              <label htmlFor="selectFood">ID food</label>
              <select id="selectFood" value={selectedFoodId} onChange={(e) => setSelectedFoodId(e.target.value)}required >
                <option value="">Select an ID food</option>
                {getFoods.map((food) => (
                  <option key={food.id_food} value={food.id_food}>
                    {food.id_food}
                  </option>
                ))}
              </select>
            </div>

            <div className="formGroup">
              <label htmlFor="nameFood">Food name</label>
              <input type="text" id="categoryFood" name="categoryFood" value={nameFood} onChange={(e) => setNameFood(e.target.value)}
                placeholder="Enter food name" required={stateButton === 1} disabled={stateButton === 2} />
            </div>
            <div className="formGroup">
              <label htmlFor="price">price</label>
              <input  type="text" id="price" name="price" value={price} onChange={(e) => setPrice(e.target.value)}placeholder="Enter price"
                required={stateButton === 1} disabled={stateButton === 2}/>
            </div>
            <div className="formGroup">
              <label htmlFor="Description">Description</label>
              <input type="text" id="Description" name="Description" value={description}onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter description" required={stateButton === 1} disabled={stateButton === 2}/>
            </div>
            <div className="formGroup">
              <label htmlFor="imageURL">Image URL</label>
              <input type="text" id="ImageURL" name="ImageURL" value={image} onChange={(e) => setImage(e.target.value)}
                placeholder="Enter image url" required={stateButton === 1} disabled={stateButton === 2}/>
            </div>
          </div>

          <div className="formRow">
            <div className="formGroup">
              <label htmlFor="countrySelect">Country</label>
              <select id="countrySelect" value={selectedCountry} onChange={(e) => setSelectedCountry(e.target.value)}
                required={stateButton === 1} disabled={stateButton === 2}>
                <option value="">Select a country</option>
                {countries.map((country) => (
                  <option key={country.id_pais} value={country.id_pais}>
                    {country.name_country}
                  </option>
                ))}
              </select>
            </div>
            <div className="formGroup">
              <label htmlFor="categorySelect">Category</label>
              <select id="categorySelect"  value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)} 
              required={stateButton === 1}disabled={stateButton === 2}>
                <option value="">Select a category</option>
                {categories.map((category) => (
                  <option key={category.id_category} value={category.id_category}>
                    {category.name_category}
                  </option>
                ))}
              </select>
            </div>

            <button  type="submit" className="submitBtn">
              {
                stateButton === 1 ? 'UPDATE' : 'DELETE'
              }
            </button>
          </div>
        </form>
      )
    }

    <span className={styles.search}>Search</span>

    <div className={styles.filters}>
      <div className="formGroup">
        <label htmlFor="countrySearch">Country</label>
        <select id="countrySearch" value={searchCountry} onChange={(e) => setSearchCountry(e.target.value)}>
          <option value="">Select a country</option>
          {countries.map((country) => (
            <option key={country.id_pais} value={country.id_pais}>
              {country.name_country}
            </option>
          ))}
        </select>
      </div>

      <div className="formGroup">
        <label htmlFor="food">Food</label>
        <input type="text" placeholder='name food' value={searchNameFood} onChange={(e) => setSearchNameFood(e.target.value)}/>
      </div>

      <div className="formGroup">
        <label htmlFor="categorySearch">Category</label>
        <select id="categorySearch"  value={searchCategory} onChange={(e) => setSearchCategory(e.target.value)}>
          <option value="">Select a category</option>
          {categories.map((category) => (
            <option key={category.id_category} value={category.id_category}>
              {category.name_category}
            </option>
          ))}
        </select>
      </div>

      <button className='submitBtn' onClick={()=> clearFilters()}>Clean filters</button>
    </div>

    <div className = "table_container">
    <div className = "table_wrapper">
          <table>
            <thead>
              <tr>
                <th>Id</th>
                <th>Name</th>
                <th>Price</th>
                <th>Description</th>
                <th>img</th>
                <th>Image URL</th>
                <th>Country</th>
                <th>Category</th>
              </tr>
            </thead>
            <tbody>
              {
                getFoods.map((item) =>(
                  <tr key={item.id_food}>
                    <td>{item.id_food}</td>
                    <td>{item.name}</td>
                    <td>{item.price}</td>
                    <td>{item.description}</td>
                    <td><img src={item.image_url} alt="" /></td>
                    <td>{item.image_url}</td>
                    <td>{item.name_country}</td>
                    <td>{item.name_category}</td>
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

export default Foods