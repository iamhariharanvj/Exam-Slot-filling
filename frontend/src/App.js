import React from 'react';
import { useState , useEffect} from 'react';
import './App.css'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';

const App = () => {




  var [facList,setFacList] = useState([])
  var [nSlots,setnSlots] = useState([])
  var [defFac,setdefFac] = useState("")

  useEffect(() => {
     fetch("http://localhost:8080/")
    .then(response => response.json())
    .then((data) => setFacList(data))

 
  },[facList])

  return (
    <div>
      
      <span className="title">Default Max Entries Value: </span>
      <select onChange={
        async (e) => {
          const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({value: e.target.value })
          };
          
          await fetch(`http://localhost:8080/facDefault`, requestOptions)
          .then(data => console.log(data));
    
          setFacList([])
        }
      }>
        <option value="0">0</option>
        <option value="1">1</option>
        <option value="2">2</option>
        <option value="3">3</option>
        <option value="4">4</option>

      </select>


      <table className="faculty" border="2" cellSpacing="0" cellPadding="6">
        <thead>
          <tr>
              <th>Faculty</th>
              <th>Max Entries</th>
          </tr>
        </thead>

        <tbody>
          {facList.map((fac) => <Faculty key={fac._id} id={fac._id} name={fac.name} entries={fac.maxEntries} />)}


        </tbody>
      
      </table>










      <button className="btn btn-primary" onClick={()=>{

      const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ faculty: "", maxEntries: "0" })
      };
      
      fetch(`http://localhost:8080/`, requestOptions)
      .then(data => console.log(data));

      setFacList([])

          
              }}>
                Add new faculty
            </button>


            <button className="btn btn-warning" onClick={async () => {
                        const requestOptions = {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({value: '0' })
                        };
                        
                        await fetch(`http://localhost:8080/facDefault`, requestOptions)
                        .then(data => console.log(data));
                  
                        setFacList([])
                      }
            }>Reset Max Entries</button>
            <br />

            <span>Enter the number of slots</span>
            <input defaultValue="0" type="number" max="20" onChange={async (e) => {
                setnSlots(Array.from(Array(Number(e.target.value)).keys()));
                
              }}>


            </input>
            <br></br>
            <span>Default Number of Faculties</span>
            <select onChange={(e)=>{
              setdefFac(e.target.value);
              console.log(nSlots);
            }}>
              <option value="">0</option>
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>


            </select>

            <br></br>
            <br></br>


              {defFac!==2?nSlots.map((slots) => <Slot slotname={slots+1} defFac={defFac} key={slots+1} id={slots+1} />):console.log("INVALID")}
            
            
            </div>


            )
          }
          


export const Slot = (props) => {
  return (
    <div>

      <h1>Slot {props.id}</h1>
      
      <table className="slot" id={props.id} border="2" cellspacing="0" cellpadding="0">
        <tr>
          <th style={{display: 'none'}}>Slot Name</th>
          <th>Room</th>
          <th>Faculties</th>
        </tr>

        <tr>
          <td style={{display: 'none'}} ><input value={props.slotname}></input></td>
          <td><input defaultValue="IF3"></input></td>
          <td><input defaultValue={props.defFac}></input></td>
        </tr>

        <tr>
          <td style={{display: 'none'}} ><input value={props.slotname}></input></td>
          <td><input defaultValue="IF4"></input></td>
          <td><input defaultValue={props.defFac}></input></td>
        </tr>

        <tr>
          <td style={{display: 'none'}} ><input value={props.slotname}></input></td>
          <td><input defaultValue="IS4"></input></td>
          <td><input defaultValue={props.defFac}></input></td>
        </tr>

        <tr>
          <td style={{display: 'none'}} ><input  value={props.slotname}></input></td>
          <td><input defaultValue="IS5"></input></td>
          <td><input defaultValue={props.defFac}></input></td>
        </tr>
        
      </table>


      <br />
    </div>

  )
}




const Faculty = (props) => {
  return (
    <tr>

      <th><input id={props.id} type="text" placeholder="Enter Name" defaultValue={props.name} onChange= {async(e) =>{
        
        console.log(e.target.value)
        const requestOptions = {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id:props.id, name: e.target.value, maxEntries: props.entries })
        };
        await fetch(`http://localhost:8080/`, requestOptions)
            .then(data => console.log(data));
      
      } 
      
      }></input></th>


      <td><input id={props.id} type="text"  defaultValue={props.entries} onChange= {async (e) =>{
        
        console.log(e.target.value)
        const requestOptions = {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id:props.id, name: props.name, maxEntries: e.target.value })
        };
        await fetch(`http://localhost:8080/`, requestOptions)
            .then(data => console.log(data));
      
      } 
      
      }></input>

      <button className="btn btn-danger" onClick={async()=>{
        var requestOptions = {
          method: 'DELETE'
        }

        await fetch(`http://localhost:8080/${props.name}`, requestOptions)
        .then(data => console.log(data));

      }}><DeleteOutlineIcon className='deleteIcon' /></button>

        
        </td>

    </tr>
  )
}



export default App