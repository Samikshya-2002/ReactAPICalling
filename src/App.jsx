// import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
// import './App.css'

// function App() {
//   const [count, setCount] = useState(0)

//   return (
//     <>
//       <div>
//         <a href="https://vitejs.dev" target="_blank">
//           <img src={viteLogo} className="logo" alt="Vite logo" />
//         </a>
//         <a href="https://react.dev" target="_blank">
//           <img src={reactLogo} className="logo react" alt="React logo" />
//         </a>
//       </div>
//       <h1>Vite + React</h1>
//       <div className="card">
//         <button onClick={() => setCount((count) => count + 1)}>
//           count is {count}
//         </button>
//         <p>
//           Edit <code>src/App.jsx</code> and save to test HMR
//         </p>
//       </div>
//       <p className="read-the-docs">
//         Click on the Vite and React logos to learn more
//       </p>
//     </>
//   )
// }

// export default App


// src/App.jsx
// import React, { useState, useEffect } from 'react';

// const App = () => {
//   const [data, setData] = useState([]);
//   const [newUser, setNewUser] = useState({ name: '', username: '' });

//   useEffect(() => {
//     fetchData();
//   }, []);

//   const fetchData = async () => {
//     try {
//       const response = await fetch('https://jsonplaceholder.typicode.com/users');
//       if (!response.ok) {
//         throw new Error('Failed to fetch data');
//       }
//       const jsonData = await response.json();
//       setData(jsonData);
//       localStorage.setItem('users', JSON.stringify(jsonData));
//     } catch (error) {
//       console.error('Error fetching data:', error);
//     }
//   };

//   const postUser = async () => {
//     try {
//       const response = await fetch('https://jsonplaceholder.typicode.com/users', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(newUser),
//       });
//       if (!response.ok) {
//         throw new Error('Failed to post data');
//       }
//       console.log('Posted Data:', newUser);
//       // Assuming you want to update the UI after posting data
//       fetchData();
//     } catch (error) {
//       console.error('Error posting data:', error);
//     }
//   };

//   const handleInputChange = (e) => {
//     setNewUser({
//       ...newUser,
//       [e.target.name]: e.target.value
//     });
//   };

//   return (
//     <div>
//       <h1>Users</h1>
//       <table>
//         <thead>
//           <tr>
//             <th>ID</th>
//             <th>Name</th>
//             <th>Username</th>
//           </tr>
//         </thead>
//         <tbody>
//           {data.map((user) => (
//             <tr key={user.id}>
//               <td>{user.id}</td>
//               <td>{user.name}</td>
//               <td>{user.username}</td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//       <h2>Add New User</h2>
//       <input type="text" name="name" value={newUser.name} onChange={handleInputChange} placeholder="Name" />
//       <input type="text" name="username" value={newUser.username} onChange={handleInputChange} placeholder="Username" />
//       <button onClick={postUser}>Add User</button>
//     </div>
//   );
// };

// export default App;  


import React, { useState, useEffect } from 'react';

const App = () => {
  const [data, setData] = useState([]);
  const [newUser, setNewUser] = useState({ name: '', username: '' });

  useEffect(() => {
    const storedData = localStorage.getItem('users');
    if (storedData) {
      setData(JSON.parse(storedData));
    } else {
      fetchData();
    }
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch('https://jsonplaceholder.typicode.com/users');
      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }
      const jsonData = await response.json();
      setData(jsonData);
      localStorage.setItem('users', JSON.stringify(jsonData));
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const postUser = async () => {
    try {
      const response = await fetch('https://jsonplaceholder.typicode.com/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newUser),
      });
      if (!response.ok) {
        throw new Error('Failed to post data');
      }

      const responseData = await response.json();

      // Find the maximum ID currently in use
      const maxId = data.reduce((max, user) => Math.max(max, user.id), 0);

      // Use the next available ID for the new user
      const updatedData = [...data, { ...responseData, id: maxId + 1 }];

      // Update state and local storage
      setData(updatedData);
      localStorage.setItem('users', JSON.stringify(updatedData));

      setNewUser({ name: '', username: '' });
    } catch (error) {
      console.error('Error posting data:', error);
    }
  };

  const deleteUser = (userId) => {
    const newData = data.filter(user => user.id !== userId); // Filter to keep only non-matching users
    setData(newData);

    // Update Local Storage with specific changes
    localStorage.setItem('users', JSON.stringify(newData));
  };

  const handleInputChange = (e) => {
    setNewUser({
      ...newUser,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div>
      <h1>Users</h1>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Username</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {data.map((user, index) => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.name}</td>
              <td>{user.username}</td>
              <td>
                <button onClick={() => deleteUser(user.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <h2>Add New User</h2>
      <input
        type="text"
        name="name"
        value={newUser.name}
        onChange={handleInputChange}
        placeholder="Name"
      />
      <input
        type="text"
        name="username"
        value={newUser.username}
        onChange={handleInputChange}
        placeholder="Username"
      />
      <button onClick={postUser}>Add User</button>
    </div>
  );
};

export default App;