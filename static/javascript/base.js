
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
        if(result.ok) {
            location.href = '/sign-in'
        }
    });
}