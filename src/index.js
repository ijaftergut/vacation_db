import React, {useEffect, useState} from 'react';
import ReactDOM from 'react-dom/client';
import axios from 'axios';

const VacationForm = ({users, places, bookVacation})=>{
  const [placeId, setPlaceId] = useState('')
  const [userId, setUserId] = useState('')

  const save = (ev)=>{
    ev.preventDefault()
    const vacation = {
      user_id: userId,
      place_id: placeId
    }
    bookVacation(vacation)
  }
  return (
    <form onSubmit={save}>
      <select value={userId} onChange={ev => setUserId(ev.target.value)}>
    <option value=''>--choose user--</option>
    {
      users.map(user=>{
        return (
          <option key={userId} value={user.id}>{user.name}</option>
        )
      })
    }
      </select>
      <select value={placeId} onChange={ev => setPlaceId(ev.target.value)}>
      <option value=''>--choose place--</option>
      {
      places.map(place=>{
        return (
          <option key={placeId} value={place.id}>{place.name}</option>
        )
      })
    }
      </select>
      <button disabled={!placeId || !userId}>
        Create Booking
      </button>
    </form>
  )
}


const Vacations = ({vacations, places, cancelVacation})=>{
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
                <button onClick={()=>{cancelVacation(vacation)}}>cancel</button>
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
  const bookVacation = async(vacation)=>{
    const response = await axios.post('/api/vacations', vacation)
    setVacations([...vacations, response.data])
  }
  const cancelVacation = async(vacation)=>{
    await axios.delete(`/api/vacations/${vacation.id}`)
    setVacations(vacations.filter(_vacation => _vacation.id !== vacation.id))
  }
  return (
    <div>
          <VacationForm places={places} users={users} bookVacation={bookVacation}/>
    <h1>Vacation Planner</h1>
    <main>
    <Vacations vacations={vacations} places={places}
    cancelVacation={cancelVacation}/>
    <Users users={users} vacations={vacations}/>
    <Places places={places} vacations={vacations}/>
    </main>
    </div>
  );
};

const root = ReactDOM.createRoot(document.querySelector('#root'));
root.render(<App />);
