let userData = null;

function signOut() {
  const headers = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  };
  fetch('/api/user', {
    method: 'DELETE',
    headers,
  })
    .then((response) => response.json())
    .then((result) => {
      if (result.ok) {
        location.href = '/sign-in';
      }
    });
}

async function getItinerary() {
  userData = await getUserData();
  if (userData.data === null) {
    location.href = '/sign-in';
  } else if (userData.error) {
    location.href = '/sign-in';
  } else {
    location.href = '/my-itinerary';
  }
}

async function getDashboard() {
  // userData = await getUserData();
  // if(userData.data === null) {
  //   location.href = '/sign-in'
  // }else if(userData.error) {
  //   location.href = '/sign-in'
  // }else {
  //   location.href = '/dashboard'
  // }
  location.href = '/dashboard';
}

function getUserData() {
  return fetch('api/user')
    .then((response) => {
      return response.json();
    })
    .then((result) => {
      return result;
    });
}
