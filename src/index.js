import React, {useEffect, useState} from 'react';
import ReactDOM from 'react-dom/client';
import axios from 'axios';

const Vacations = ({vacations, places})=>{
  return (
      <div>
        <h2>Vacations ({vacations.length})</h2>
        <ul>
          {
            vacations.map(vacation=>{
              const place = places.find(place =>place.id === vacation.place_id)
              return (
                <li key={vacation.id}>{new Date(vacation.created_at).toLocaleString()}
                <div>
                to {place ? place.name : ''}
                </div>
                </li>
              )
            })
          }
        </ul>
      </div>  
  )
}

const Places = ({places, vacations})=>{
  return (
      <div>
        <h2>Places ({places.length})</h2>
        <ul>
          {
            places.map(place=>{
              return (
                <li key={place.id}>{place.name}
                ({vacations.filter(vacation=> vacation.place_id === place.id).length})</li>
              )
            })
          }
        </ul>
      </div>  
  )
}

const Users = ({users, vacations})=>{
  return (
      <div>
        <h2>Users ({users.length})</h2>
        <ul>
          {
            users.map(user=>{
              return (
                <li key={user.id}>{user.name} 
                ({vacations.filter(vacation=> vacation.user_id === user.id).length})</li>
              )
            })
          }
        </ul>
      </div>  
  )
}


const App = ()=> {
  const [users, setUsers] = useState([])
  const [places, setPlaces] = useState([])
  const [vacations, setVacations] = useState([])

  useEffect (()=>{
    const fetchData = async()=>{
      const response = await axios.get('/api/vacations')
      setVacations(response.data)
    }
    fetchData()
  })
  useEffect (()=>{
    const fetchData = async()=>{
      const response = await axios.get('/api/places')
      setPlaces(response.data)
    }
    fetchData()
  })
  useEffect (()=>{
    const fetchData = async()=>{
      const response = await axios.get('/api/users')
      setUsers(response.data)
    }
    fetchData()
  })

  return (
    <div>
    <h1>Vacation Planner</h1>
    <main>
    <Vacations vacations={vacations} places={places}/>
    <Users users={users} vacations={vacations}/>
    <Places places={places} vacations={vacations}/>
    </main>
    </div>
  );
};

const root = ReactDOM.createRoot(document.querySelector('#root'));
root.render(<App />);
