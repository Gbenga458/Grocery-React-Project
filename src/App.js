import React, {useState, useEffect} from 'react';
import List from './List'
import Alert from './Alert'

const getLocalStorage =()=>{
  let list = localStorage.getItem('list')
  if(list){
    return (list = JSON.parse(localStorage.getItem('list')))
  } else {
    return []
  }
}

function App(){
  const [name, setName] = useState('')
  const [list, setList] = useState(getLocalStorage())
  const [isEditing, setIsEditing] = useState(false)
  const [editID, setEditID] = useState(null)
  const [alert, setAlert] = useState({show:false, type:'', msg:''})

  const handleSubmit =(e)=>{
    e.preventDefault()
    if(!name){
      showAlert(true,'danger','pls enter a value')
    } else if (name && isEditing){
      setList(
        list.map((item)=>{
        if(item.id === editID){
       return {...item, title:name}
        }
       return item
      }))
    
    setName('')
    setEditID(null)
    setIsEditing(false)
     showAlert(true, 'success', 'value changed')
    } else {
       showAlert(true,'success','value added')
      const newItem = {id: new Date().getTime().toString(), title:name}
        setList([...list, newItem])
        setName('')
    }

  } 

  const showAlert =(show=false, type='' , msg='')=>{
     setAlert({show, type,msg})
  }
  const clearItem =()=>{
    showAlert(true, 'danger', 'item cleared')
    setList([])
  }
  const removeItem=(id)=>{
    showAlert(true, 'danger', 'item deleted')
    setList(list.filter((item)=> item.id !== id))
  }
const editItem =(id)=>{
  const specificItem = list.find((item)=> item.id === id)
  setName(specificItem.title)
  setIsEditing(true)
  setEditID(id)
}
useEffect(()=>{
localStorage.setItem('list', JSON.stringify(list))
},[list]);

  return(
    <section className='section-center'>
    <form className='grocery-form' onSubmit={handleSubmit}>
     {alert.show && <Alert {...alert} removeAlert={showAlert} list={list}/> }
     <h3>Grocery Bud</h3>
     <div className='form-control'>
      <input
      type='text'
      className='grocery'
      placeholder='eg.eggs'
      value={name}
      onChange={(e)=> setName(e.target.value)}
      />
      <button className='submit-btn' type='submit'>
        {isEditing? 'edit': 'submit'}
      </button>
     </div>
    </form>
    {list.length > 0 && (
    <div className='grocery-container'>
        <List items={list} editItem={editItem} removeItem={removeItem}/>
    <button className='clear-btn' onClick={clearItem}>clear item</button>
    </div>
    )}
    </section>
  )

}
export default App;