import { useEffect, useState } from "react";
import io from "socket.io-client";
import { v4 as uuidv4 } from 'uuid';

function PlayersTable() {
  const socket = io("localhost:3000");
  const [formInputs, setFormInputs] = useState([]);
  const [crudData, setCrudData] = useState([]);
  const [isEdit, setIsEdit] = useState(false)
  const handleInput = (event) => {
    const { name, value } = event.target;
    let obj = { [name]: value };
    setFormInputs((prev) => ({ ...prev, ...obj }));
  };
  function handleSubmit() {
    console.log(formInputs);
    socket.emit("data", {...formInputs, id:uuidv4()});
    socket.on('crudData',(response) => {
        setCrudData(response)
    })
    setFormInputs({
        name:'',
        age:'',
        phone:''
    })
  }
  function getEditData(data){
    setFormInputs(data)
    setIsEdit(true)
  }
  function handleEdit(){
    console.log(formInputs);
    socket.emit("editData", formInputs)
    setIsEdit(false)
    setFormInputs({
      name:'',
      age:'',
      phone:''
  })
  }
  function handleDelete(id){
    console.log(id);
    socket.emit('deleteData',id)
  }

  useEffect(() => {
    socket.on('crudData',(response) => {
        setCrudData(response)
    })
  },[])
  return (
    <>
      <h1>CRUD Operation</h1>

      <input
      value={formInputs.name}
        className="input-field"
        name="name"
        onChange={handleInput}
        placeholder="Enter your Name"
      />

      <input
      value={formInputs.age}
        className="input-field"
        name="age"
        onChange={handleInput}
        placeholder="Enter your Age"
      />

      <input
      value={formInputs.phone}
        className="input-field"
        name="phone"
        onChange={handleInput}
        placeholder="Enter your Phone Number"
      />
      <button className="send-scores" onClick={isEdit?handleEdit:handleSubmit}>
      {isEdit ? 'Edit':'Add'} Data
      </button>
      {crudData.length > 0 && <table>
          <tbody>
            <tr>
              <th>Name</th>
              <th>Age</th>
              <th>Phone Number</th>
              <th>-</th>
              <th>-</th>
            </tr>

            {crudData.map((data) => (
              <tr key={data.name}>
                <td>{data?.name}</td>
                <td>{data?.age}</td>
                <td>{data?.phone}</td>
                
                <td>
                    <button onClick={() => getEditData(data)} >Edit</button>
                </td>
                <td>
                    <button onClick={() => handleDelete(data.id)}>delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>}
     
       
      
    </>
  );
}

export default PlayersTable;
