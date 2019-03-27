import { history } from '../history';

export function GetUserInfo() {
  const currentUser = JSON.parse(localStorage.getItem('user'));
  if (currentUser == null) {
    history.push('/login');
    window.location.reload();
    return {};
  }
  return currentUser._doc;
}
